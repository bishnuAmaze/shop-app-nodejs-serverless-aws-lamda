import { APIGatewayProxyHandler } from 'aws-lambda';
import * as AWS from 'aws-sdk';
import { formatJSONResponse } from '@libs/api-gateway';

const s3 = new AWS.S3({ region: 'us-east-1', signatureVersion: 'v4' });

export const importProductsFileHandler: APIGatewayProxyHandler = async (event) => {
    const fileName = event?.queryStringParameters?.name;

    if (!fileName) {
        return formatJSONResponse({
            status: 400,
            body: { message: 'Missing "name" query parameter' },
        });
    }
    const path = `uploaded/${fileName}`;

    const params = {
        Bucket: 'bkbuploadfiles',
        Key: path,
        Expires: 60, // 30 minutes only
        ContentType: 'text/csv',
    };

    try {

        const signedUrl = await s3.getSignedUrlPromise('putObject', params);

        return formatJSONResponse({
            status: 200,
            body: { url: signedUrl },
        });
    } catch (error) {
        console.log('Error while generating signed url', error);

        return formatJSONResponse({
            status: 500,
            body: 'Failed to generate signed url',
        });
    }
}