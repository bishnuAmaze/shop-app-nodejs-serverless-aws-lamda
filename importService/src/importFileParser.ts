import { S3Handler } from 'aws-lambda';
import { S3 } from 'aws-sdk';
import csv from 'csv-parser';
import { once } from 'events';

export const importFileParserHandler: S3Handler = async (event) => {
    const s3 = new S3();
    for (const record of event?.Records) {
        console.log('BKB', record);
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

        console.log('BKB', s3Object);

        s3Object
            .on('error', err => {
                console.log('Error in S3 Stream:', err);
            })
            .pipe(csv())
            .on('data', data => {
                // handle data
                console.log(data);
            })
            .on('error', err => {
                console.log('Error in CSV Parser:', err);
            })
            .on('end', () => {
                console.log('Finished processing');
            });
        try {
            await once(s3Object, 'end');  // Corrected line
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