import { IProduct } from "@functions/product/interfaces";
import { Products } from "@functions/product/products.mock";
import { formatJSONResponse } from "@libs/api-gateway";
import { APIGatewayProxyEvent } from "aws-lambda";


export const getProductsByIdHandler = () => async (event: APIGatewayProxyEvent) => {
    try {
        const productId: string | null = event.pathParameters?.productId ?? null;

        if (!productId) {
            return formatJSONResponse({
                status: 400,
                body: JSON.stringify({ message: "Missing productID" }),
            });
        }

        const product: IProduct | undefined = await Promise.resolve(Products.find(product => product.id === productId));
        if (!product) {
            return formatJSONResponse({
                status: 404,
                body: JSON.stringify({ message: "Product not found" }),
            });
        }
        return formatJSONResponse({
            status: 200,
            body: product
        })
    }
    catch (err) {
        return formatJSONResponse({
            status: 500,
            body: JSON.stringify({ message: err.message || 'Something went wrong !!!' })
        })
    }
}