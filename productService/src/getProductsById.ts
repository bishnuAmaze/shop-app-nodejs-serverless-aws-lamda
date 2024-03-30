// import { IProduct } from "@functions/product/interfaces";
// import { Products } from "@functions/product/products.mock";
// import { formatJSONResponse } from "@libs/api-gateway";
// import { APIGatewayProxyEvent } from "aws-lambda";


// export const getProductsByIdHandler = () => async (event: APIGatewayProxyEvent) => {
//     try {
//         const productId: string | null = event.pathParameters?.productId ?? null;

//         if (!productId) {
//             return formatJSONResponse({
//                 status: 400,
//                 body: JSON.stringify({ message: "Missing productID" }),
//             });
//         }

//         const product: IProduct | undefined = await Promise.resolve(Products.find(product => product.id === productId));
//         if (!product) {
//             return formatJSONResponse({
//                 status: 404,
//                 body: JSON.stringify({ message: "Product not found" }),
//             });
//         }
//         return formatJSONResponse({
//             status: 200,
//             body: product
//         })
//     }
//     catch (err) {
//         return formatJSONResponse({
//             status: 500,
//             body: JSON.stringify({ message: err.message || 'Something went wrong !!!' })
//         })
//     }
// }


import { DynamoDB } from 'aws-sdk';
import { formatJSONResponse } from '@libs/api-gateway';
import { APIGatewayProxyEvent } from "aws-lambda";
import { IProduct } from '@functions/product/interfaces';

const dynamodb = new DynamoDB.DocumentClient();

export const getProductsByIdHandler = async (event: APIGatewayProxyEvent) => {
    try {
        console.log(event.pathParameters);
        const { productId } = event.pathParameters;

        if (!productId) {
            return formatJSONResponse({
                status: 400,
                body: { message: "Missing productId" },
            });
        }

        const productResult = await dynamodb.get({
            TableName: process.env.PRODUCTS_TABLE,
            Key: { id: productId },
        }).promise();

        const productItem: IProduct | undefined = productResult.Item as IProduct;

        if (!productItem) {
            return formatJSONResponse({
                status: 404,
                body: { message: "Product not found" },
            });
        }

        const stocksResult = await dynamodb.get({
            TableName: process.env.STOCKS_TABLE,
            Key: {
                product_id: productId,
            },
        }).promise();

        return formatJSONResponse({
            status: 200,
            body: {
                ...productItem,
                count: stocksResult.Item ? stocksResult.Item.count : 0,
            },
        });
    }
    catch (err) {
        console.log(err);

        return formatJSONResponse({
            status: 500,
            body: { message: err.message || 'Something went wrong!!!' }
        });
    }
};