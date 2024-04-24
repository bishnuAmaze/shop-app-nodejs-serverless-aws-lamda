import AWS from 'aws-sdk';
import AWSMock from 'aws-sdk-mock';
import { importProductsFileHandler } from 'src/importProductsFile';

describe('Test importProductsFileHandler', () => {
    beforeAll(() => {
        // Mock the getSignedUrlPromise method
        AWSMock.setSDKInstance(AWS);
        AWSMock.mock('S3', 'getSignedUrlPromise', 'http://example.com/signed-url');
    });

    afterAll(() => {
        // Restore the original methods after all tests are done
        AWSMock.restore('S3');
        jest.clearAllMocks();
    });

    it('should return signed url', async () => {
        const result = await importProductsFileHandler({
            queryStringParameters: { name: 'test.csv' }
        } as any, null, null);

        // Parse the body of the response
        const body = JSON.parse(result['body']);

        // Expecting body.url to be a string that starts with your bucket URL
        expect(typeof body.url).toBe('string');
        expect(body.url.startsWith('https://bkbuploadfiles.s3.amazonaws.com/uploaded/test.csv?')).toBe(true);

        // Asserting the remaining properties of the response
        expect(result).toMatchObject({
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            }
        });
    });

    it('should report missing name in query parameters', async () => {
        let result = await importProductsFileHandler({
            queryStringParameters: {}
        } as any, null, null);
        expect(result['statusCode']).toEqual(400);
    });
});