import { SQSEvent, SQSHandler, SQSRecord } from 'aws-lambda';
import * as AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const sns = new AWS.SNS();

export const catalogBatchProcessHandler: SQSHandler = async (event: SQSEvent) => {
    const putRequests = event.Records.map((record: SQSRecord) => {
        if (record?.body) {
            const product = JSON.parse(record.body);

            const productId = uuidv4();

            return {
                PutRequest: {
                    Item: {
                        id: productId,
                        title: product.title,
                        description: product.description,
                        price: product.price,
                        count: product.count
                    }
                }
            }
        }
    });

    if (!putRequests || !putRequests.length) {
        console.log('No items to process');
        return;
    }

    try {
        const params: AWS.DynamoDB.DocumentClient.BatchWriteItemInput = {
            RequestItems: {
                [process.env.PRODUCTS_TABLE]: putRequests
            }
        };

        await dynamoDB.batchWrite(params).promise();

        const message = `Successfully created ${putRequests.length} products`;
        const snsParams = {
            Subject: 'Product Creation',
            Message: message,
            TopicArn: process.env.TOPIC_ARN,
        };
        await sns.publish(snsParams).promise();

        console.log(message);

    } catch (error) {
        console.log('Error processing items', error);
        throw error;
    }
};