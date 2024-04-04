import { DynamoDB } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { IProduct, IStock } from './tables.interfaces';

// Set the region and endpoint to point to your local DynamoDB instance
const ddb = new DynamoDB.DocumentClient({
    region: 'localhost', // 'eu-west-1' for add data to AWS DynamoDB
    endpoint: 'http://localhost:8000'
});

// Define tables
const productsTable = 'products';
const stocksTable = 'stocks';

// Function to put data into a table
async function putData(tableName: string, item: IProduct | IStock): Promise<void> {
    const params = {
        TableName: tableName,
        Item: item
    };

    try {
        await ddb.put(params).promise();
        console.log(`Inserted item into ${tableName}`);
    } catch (err) {
        console.error(`Failed to insert item into ${tableName}:`, err);
    }
}

async function main(): Promise<void> {
    for (let i = 0; i < 10; i++) {
        const testProduct: IProduct = {
            id: uuidv4(),
            title: `Product Title ${i + 1}`,
            description: `A Product Description ${i + 1}`,
            price: 10 + i
        };

        const testStock: IStock = {
            product_id: testProduct.id,
            count: 5 + (i * 5)
        };

        await putData(productsTable, testProduct);
        await putData(stocksTable, testStock);
    }
}

main()
    .then(() => console.log("Finished adding data"))
    .catch(err => console.error("Error adding while data: ", err));
