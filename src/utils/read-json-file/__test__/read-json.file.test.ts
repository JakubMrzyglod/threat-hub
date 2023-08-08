import { readJsonFile } from '../read-json-file.util';

describe(`readJsonFile`, () => {
  it('should read correctly', async () => {
    const filePath = './example';
    const readPromise = readJsonFile(__dirname, filePath);
    const originalJsonData = require('./example.json');

    await expect(readPromise).resolves.toEqual(originalJsonData);
  });

  it('should throw error for empty file', async () => {
    const filePath = './empty';
    const readPromise = readJsonFile(__dirname, filePath);

    await expect(readPromise).rejects.toEqual(
      new Error('Could not parse file data for: <empty-file>')
    );
  });

  it('should throw error for invalid file path', async () => {
    const filePath = './invalid-path';
    const readPromise = readJsonFile(__dirname, filePath);

    await expect(readPromise).rejects.toEqual(
      new Error(`Could not read file for path: [${filePath}]`)
    );
  });
});
