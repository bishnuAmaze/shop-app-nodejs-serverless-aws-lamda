import { middyfy } from '@libs/lambda';
import { importFileParserHandler } from 'src/importFileParser';
import { importProductsFileHandler } from 'src/importProductsFile';

export const importProductsFile = middyfy(importProductsFileHandler);
export const importFileParser = importFileParserHandler;
