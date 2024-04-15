// import { APIGatewayProxyEvent } from "aws-lambda";
// import { formatJSONResponse } from "@libs/api-gateway";
// import { Products } from "@functions/product/products.mock";
// import { getProductsByIdHandler } from "src/getProductsById";

// const expectedData = Products[0];

// describe('getProductByIdHandler', () => {
//     let event: APIGatewayProxyEvent = {} as APIGatewayProxyEvent;

//     beforeEach(() => {
//       jest.resetModules();
//     });

//     it('should return 400 status if product id is not provided', async () => {
//         event['pathParameters'] = {};
//         const result = await getProductsByIdHandler(event);
//         expect(result).toEqual(formatJSONResponse({
//             status: 400,
//             body: JSON.stringify({ message: "Missing productID" }),
//         }));
//     });

//     it('should return 404 status if product is not found', async () => {
//         event['pathParameters']['productId'] = 'unknown_id';
//         const result = await getProductsByIdHandler(event);
//         expect(result).toEqual(formatJSONResponse({
//             status: 404,
//             body: JSON.stringify({ message: "Product not found" }),
//         }));
//     });

//     it('should return 200 status and product data if product is found', async () => {
//         event['pathParameters']['productId'] = expectedData.id;
//         const result = await getProductsByIdHandler(event);
//         expect(result).toEqual(formatJSONResponse({
//             status: 200,
//             body: expectedData,
//         }));
//     });

//     it('should return 500 status on error', async () => {
//         event = null;
//         const result = await getProductsByIdHandler(event);
//         expect(result).toEqual(formatJSONResponse({
//             status: 500,
//             body: JSON.stringify({ message: "Cannot read properties of null (reading 'pathParameters')" }),
//         }));
//     });
// });