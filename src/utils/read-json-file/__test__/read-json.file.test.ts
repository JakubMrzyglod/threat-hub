import { assetsValidationSchema } from '../../../validation-schemas';
import { readJsonFile } from '../read-json-file.util';
import { ValidationError } from 'yup';
describe(`readJsonFile`, () => {
  it('should read correctly', async () => {
    const filePath = './example.json';
    const readPromise = readJsonFile(__dirname, filePath);
    const originalJsonData = require('./example.json');

    await expect(readPromise).resolves.toEqual(originalJsonData);
  });

  it('should throw error for invalid validation', async () => {
    const filePath = './example.json';
    const readPromise = readJsonFile(
      __dirname,
      filePath,
      assetsValidationSchema
    );
    const originalJsonData = require('./example.json');

    await expect(readPromise).rejects.toEqual(
      new ValidationError('[0].name is a required field')
    );
  });

  it('should throw error for empty file', async () => {
    const filePath = './empty.json';
    const readPromise = readJsonFile(__dirname, filePath);

    await expect(readPromise).rejects.toEqual(
      new Error('Could not parse file data for: <empty-file>')
    );
  });

  it('should throw error for invalid file path', async () => {
    const filePath = './invalid-path.json';
    const readPromise = readJsonFile(__dirname, filePath);
    const originalJsonData = require('./example.json');

    await expect(readPromise).rejects.toEqual(
      new Error(`Could not read file for path: [${filePath}]`)
    );
  });
});
