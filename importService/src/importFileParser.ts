import { S3Handler } from 'aws-lambda';
import csv from 'csv-parser';
import { once } from 'events';
import * as AWS from 'aws-sdk';

const sqs = new AWS.SQS();

export const importFileParserHandler: S3Handler = async (event) => {
    const s3 = new AWS.S3();
    for (const record of event?.Records) {
        if (!record?.s3?.object?.key?.endsWith('.csv')) {
            console.log(`Skipping non-CSV file "${record.s3.object.key}"`);
            continue;
        }

        const s3Object = s3
            .getObject({
                Bucket: record.s3.bucket.name,
                Key: record.s3.object.key,
            })
            .createReadStream();

        s3Object
            .on('error', err => {
                console.log('Error in S3 Stream:', err);
            })
            .pipe(csv())
            .on('data', async (data) => {
                // handle data
                console.log(data);

                await sqs.sendMessage({
                    QueueUrl: 'https://sqs.us-east-1.amazonaws.com/058264555641/catalogItemsQueue',
                    MessageBody: JSON.stringify(data),
                }).promise();
            })
            .on('error', err => {
                console.log('Error in CSV Parser:', err);
            })
            .on('end', () => { });
        try {
            await once(s3Object, 'end');
        } catch (err) {
            console.error(`Failed to process "${record.s3.object.key}": ${err}`);
        }

        try {
            const targetKey = record.s3.object.key.replace('uploaded', 'parsed');
            await s3.copyObject({
                Bucket: record.s3.bucket.name,
                CopySource: `${record.s3.bucket.name}/${record.s3.object.key}`,
                Key: targetKey,
            }).promise();
            console.log(`Copied object to "${targetKey}"`);

            await s3.deleteObject({
                Bucket: record.s3.bucket.name,
                Key: record.s3.object.key,
            }).promise();
            console.log(`Deleted original object "${record.s3.object.key}"`);
        } catch (copyError) {
            console.log('Error while copying object: ', copyError);
        }
    }

};