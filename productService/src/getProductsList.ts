// import { Products } from "@functions/product/products.mock";
// import { formatJSONResponse } from "@libs/api-gateway";


// export const getAllProductsHandler = () => async () => {
//     try {
//         const products = await Promise.resolve(Products);
//         return formatJSONResponse({
//             status: 200,
//             body: products
//         })
//     }
//     catch (err) {
//         return formatJSONResponse({
//             status: 500,
//             body: JSON.stringify( { message: err.message || 'Something went wrong !!!' })
//         })
//     }
// }


import { DynamoDB } from 'aws-sdk';
import { formatJSONResponse } from '@libs/api-gateway';
import { IProduct } from '@functions/product/interfaces';

const dynamodb = new DynamoDB.DocumentClient();

export const getAllProductsHandler = async () => {
    try {
        const productsResult = await dynamodb.scan({ TableName: process.env.PRODUCTS_TABLE }).promise();

        console.log(productsResult);

        if (productsResult.Items && productsResult.Items.length) {
            const products: IProduct[] = await Promise.all(
                productsResult.Items.map(async (product: Omit<IProduct, 'count'>) => {
                    const stocksResult = await dynamodb.get({
                        TableName: process.env.STOCKS_TABLE,
                        Key: {
                            product_id: product.id
                        },
                    }).promise();

                    return {
                        ...product,
                        count: stocksResult.Item ? stocksResult.Item.count : 0,
                    };
                })
            );

            return formatJSONResponse({
                status: 200,
                body: products
            });
        }

        return formatJSONResponse({
            status: 404,
            body: 'No products found'
        });

    } catch (err) {
        console.log(err);

        return formatJSONResponse({
            status: 500,
            body: { message: err.message || 'Something went wrong!!!' }
        });
    }
};