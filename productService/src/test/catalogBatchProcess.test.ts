import * as AWS from 'aws-sdk';
import { SQSEvent } from 'aws-lambda';
import { catalogBatchProcessHandler } from 'src/catalogBatchProcess';

jest.mock('aws-sdk', () => {
    const mockBatchWrite = jest.fn();
    mockBatchWrite.mockReturnValue({
        promise: () => Promise.resolve(),
    });

    const mockPublish = jest.fn();
    mockPublish.mockReturnValue({
        promise: () => Promise.resolve(),
    });

    return {
        SNS: jest.fn(() => ({
            publish: mockPublish,
        })),
        DynamoDB: {
            DocumentClient: jest.fn(() => ({
                batchWrite: mockBatchWrite,
            })),
        },
    };
});

jest.mock('uuid', () => ({
    v4: jest.fn().mockReturnValue('123e4567-e89b-12d3-a456-426614174000'),
}));

describe('catalogBatchProcessHandler', () => {

    let dynamoDB: AWS.DynamoDB.DocumentClient;
    let sns: AWS.SNS;

    beforeEach(() => {
        dynamoDB = new AWS.DynamoDB.DocumentClient();
        sns = new AWS.SNS();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });


    let mockEvent: SQSEvent;

    beforeEach(() => {
        process.env.PRODUCTS_TABLE = 'product';
        process.env.TOPIC_ARN = 'topic_arn';

        mockEvent = {
            Records: [
                {
                    messageId: '1',
                    receiptHandle: 'abc',
                    body: JSON.stringify({
                        title: "Test Product",
                        description: "Test Description",
                        price: 10,
                        count: 5
                    }),
                    attributes: {
                        ApproximateReceiveCount: '1',
                        SentTimestamp: '1573251510000',
                        SenderId: 'UserID',
                        ApproximateFirstReceiveTimestamp: '1573251510001'
                    },
                    messageAttributes: {},
                    md5OfBody: 'calc-hash',
                    eventSource: 'aws:sqs',
                    eventSourceARN: 'arn:aws:sqs:us-west-2:123456789012:test_queue',
                    awsRegion: 'us-west-2'
                },
            ]
        };
    });

    it('should invoke batchWrite and publish with correct parameters', async () => {
        // Mock the values to return when the method are invoked
        dynamoDB.batchWrite = jest.fn().mockReturnValueOnce({
            promise: () => Promise.resolve({}),
        });

        sns.publish = jest.fn().mockReturnValueOnce({
            promise: () => Promise.resolve({}),
        });

        await catalogBatchProcessHandler(mockEvent, {} as any, null as any);


        const expectedParams = {
            RequestItems: {
                [process.env.PRODUCTS_TABLE]: [
                    {
                        PutRequest: {
                            Item: {
                                id: '123e4567-e89b-12d3-a456-426614174000',
                                title: "Test Product",
                                description: "Test Description",
                                price: 10,
                                count: 5
                            }
                        }
                    }
                ]
            }
        };

        expect(dynamoDB.batchWrite).toHaveBeenCalledWith(expectedParams);

        const expectedSNSParams = {
            Subject: 'Product Creation',
            Message: `Successfully created 1 products`,
            TopicArn: process.env.TOPIC_ARN,
        };

        expect(sns.publish).toHaveBeenCalledWith(expectedSNSParams);
    });
});