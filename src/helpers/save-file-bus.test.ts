import * as fs from 'fs/promises';
import * as path from 'path';
import { SaveFileBus } from './save-file-bus';

jest.mock('fs/promises', () => ({
  appendFile: jest.fn(),
  rm: jest.fn(),
  mkdir: jest.fn(),
  readdir: jest.fn().mockRejectedValue({}),
}));

describe('SaveFileBus', () => {
  const dirPath = '/path/to/directory';
  const fileName = 'example';

  describe('init', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should drop existing file, create directory if not exists, and append "[" to the file', async () => {
      const saveFileBus = new SaveFileBus(dirPath, fileName);

      await saveFileBus.init();

      expect(fs.rm).toHaveBeenCalledWith(
        path.join(dirPath, `${fileName}.json`),
        {
          recursive: true,
          force: true,
        }
      );
      expect(fs.readdir).toHaveBeenCalledWith(dirPath);
      expect(fs.mkdir).toHaveBeenCalledWith(dirPath);
      expect(fs.appendFile).toHaveBeenCalledWith(
        path.join(dirPath, `${fileName}.json`),
        '['
      );
    });
  });

  describe('append', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should append items to the file', async () => {
      const saveFileBus = new SaveFileBus(dirPath, fileName);
      await saveFileBus.init();

      const items = [{ name: 'John' }, { name: 'Jane' }];

      await saveFileBus.append.call(
        {
          ...saveFileBus,
          maxParsedStringLength: 1,
        },
        items
      );

      expect(fs.appendFile).toHaveBeenCalledWith(
        path.join(dirPath, `${fileName}.json`),
        JSON.stringify(items[0])
      );
      expect(fs.appendFile).toHaveBeenCalledWith(
        path.join(dirPath, `${fileName}.json`),
        `,${JSON.stringify(items[1])}`
      );
    });
  });

  describe('end', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should append the parsed string and "]" to the file', async () => {
      const saveFileBus = new SaveFileBus(dirPath, fileName);
      await saveFileBus.init();

      saveFileBus['parsedString'] = 'parsed data';
      await saveFileBus.end();

      expect(fs.appendFile).toHaveBeenCalledWith(
        path.join(dirPath, `${fileName}.json`),
        'parsed data]'
      );
    });
  });

  describe('private methods', () => {
    it('should remove the file by calling fs.rm', async () => {
      const saveFileBus = new SaveFileBus(dirPath, fileName);
      await saveFileBus['dropFile']();

      expect(fs.rm).toHaveBeenCalledWith(
        path.join(dirPath, `${fileName}.json`),
        {
          recursive: true,
          force: true,
        }
      );
    });
  });
});
