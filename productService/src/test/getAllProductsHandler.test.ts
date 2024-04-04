import { Products } from "@functions/product/products.mock";
import { formatJSONResponse } from "@libs/api-gateway";
import { getAllProductsHandler } from "src/getProductsList";

// A good practice is to reset all mocks before each test run.
// Ensures a clean testing environment.
beforeEach(() => {
  jest.resetModules();
});

describe('Testing getAllProductsHandler', () => {

  test('It should return all products', async () => {
    expect.assertions(1);

    const expected = formatJSONResponse({
      status: 200,
      body: Products
    });

    const response = await getAllProductsHandler();
    expect(response).toEqual(expected);

  });

});