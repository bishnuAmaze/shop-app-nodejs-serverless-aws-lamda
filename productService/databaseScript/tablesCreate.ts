import { DynamoDBClient, CreateTableCommand } from "@aws-sdk/client-dynamodb";
import { CreateTableInput } from "@aws-sdk/client-dynamodb";

const region = "localhost";
const endpoint = "http://localhost:8000";

const client = new DynamoDBClient({
  region,
  endpoint,
});

const run = async () => {
  const productsParams: CreateTableInput = {
    TableName: "products",
    KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
    AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
    ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 },
  };

  const stocksParams: CreateTableInput = {
    TableName: "stocks",
    KeySchema: [{ AttributeName: "product_id", KeyType: "HASH" }],
    AttributeDefinitions: [{ AttributeName: "product_id", AttributeType: "S" }],
    ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 },
  };

  try {
    await client.send(new CreateTableCommand(productsParams));
    console.log("Created products table.");
    await client.send(new CreateTableCommand(stocksParams));
    console.log("Created stocks table.");
  } catch (error) {
    console.error("Error creating tables", error);
  } finally {
    client.destroy();
  }
};

run();