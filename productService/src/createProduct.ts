import { DynamoDB } from 'aws-sdk';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { IProduct } from '@functions/product/interfaces';
import { formatJSONResponse } from '@libs/api-gateway';

const dynamodb = new DynamoDB.DocumentClient();

export const createProductHandler = async (event: APIGatewayProxyEvent) => {
    console.log(event.body);
    const productData: IProduct = JSON.parse(event.body);

    // Required fields for the product
    const requiredProductFields = ['title', 'description', 'price', 'count'];

    for (const field of requiredProductFields) {
        if (!productData.hasOwnProperty(field)) {
            return formatJSONResponse({
                statusCode: 400,
                body: JSON.stringify({ message: `Invalid Product Data - Missing ${field}` }),
            });
        }
    }

    const product = {
        TableName: process.env.PRODUCTS_TABLE,
        Item: (({ title, description, price }) => ({ title, description, price }))(productData)
    };

    product.Item

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
            statusCode: 200,
            body: JSON.stringify(productData)
        });
    } catch (error) {
        console.log(error);
        return formatJSONResponse({
            statusCode: 500,
            body: JSON.stringify({ message: error.message || 'Something went wrong!!!' })
        });
    }
};