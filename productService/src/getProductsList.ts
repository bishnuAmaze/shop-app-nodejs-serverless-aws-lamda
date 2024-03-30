import { Products } from "@functions/product/products.mock";
import { formatJSONResponse } from "@libs/api-gateway";


export const getAllProductsHandler = () => async () => {
    try {
        const products = await Promise.resolve(Products);
        return formatJSONResponse({
            status: 200,
            body: products
        })
    }
    catch (err) {
        return formatJSONResponse({
            status: 500,
            body: JSON.stringify( { message: err.message || 'Something went wrong !!!' })
        })
    }
}