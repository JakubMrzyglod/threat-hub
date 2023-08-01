import { saveJsonFile } from './save-json-file.util';
import * as path from 'path';
import * as fs from 'fs/promises';

describe(`readJsonFile`, () => {
  const filePath = 'example';
  const outputDir = path.join(__dirname, 'output');

  it('should read correctly', async () => {
    const data = { test: 'ok' };
    const savePromise = saveJsonFile(outputDir, filePath, data);

    await expect(savePromise).resolves.toEqual(undefined);

    const savedJsonData = require(`./output/${filePath}.json`);
    expect(savedJsonData).toEqual(data);
  });

  afterAll(async () => {
    await fs.rm(outputDir, { recursive: true, force: true });
  });
});
