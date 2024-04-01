import { DynamoDB } from 'aws-sdk';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { IProduct } from '@functions/product/interfaces';
import { formatJSONResponse } from '@libs/api-gateway';
import { v4 as uuidv4 } from 'uuid';


const dynamodb = new DynamoDB.DocumentClient();

export const createProductHandler = async (event: APIGatewayProxyEvent) => {
    try {
        if (event?.body) {
            console.log(event.body);
            const productData: IProduct = JSON.parse(JSON.stringify(event.body));

            // Required fields for the product
            const requiredProductFields = ['title', 'description', 'price', 'count'];

            for (const field of requiredProductFields) {
                if (!productData.hasOwnProperty(field)) {
                    return formatJSONResponse({
                        status: 400,
                        body: { message: `Invalid Product Data - Missing ${field}` },
                    });
                }
            }

            const productId = uuidv4();
            productData.id = productId;

            const product = {
                TableName: process.env.PRODUCTS_TABLE,
                Item: (({ id, title, description, price }) => ({ id, title, description, price }))(productData)
            };

            const stock = {
                TableName: process.env.STOCKS_TABLE,
                Item: {
                    product_id: productData.id,
                    count: productData.count
                }
            };

            try {
                await dynamodb.put(product).promise();
                await dynamodb.put(stock).promise();

                return formatJSONResponse({
                    status: 200,
                    body: productData
                });
            } catch (error) {
                console.error('DynamoDB error: ', error);
                return formatJSONResponse({
                    statusCode: 500,
                    body: { message: error.message || 'Something went wrong!!!' }
                });
            }
        }
    } catch (err) {

        return formatJSONResponse({
            status: 400,
            body: { message: event },
        });
    }
};