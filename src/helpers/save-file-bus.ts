import * as path from 'path';
import * as fs from 'fs/promises';

export class SaveFileBus<T extends Record<string, any>> {
  private isFirstItem: boolean = true;
  private filePath: string;
  private parsedString = '';
  private maxParsedStringLength = Math.pow(2, 27);

  constructor(private dirPath: string, fileName: string) {
    this.filePath = path.join(dirPath, `${fileName}.json`);
  }

  async init() {
    await this.dropFile();
    await this.createDirIfNotExists();
    await fs.appendFile(this.filePath, '[');
  }

  async append(items: T[]) {
    for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
      const item = items[itemIndex];
      const addCommaBefore = !this.isFirstItem;
      this.isFirstItem = false;
      const jsonData = `${addCommaBefore ? ',' : ''}${JSON.stringify(item)}`;
      this.parsedString += jsonData;
      if (this.parsedString.length >= this.maxParsedStringLength) {
        await fs.appendFile(this.filePath, this.parsedString);
        this.parsedString = '';
      }
    }
  }

  async end() {
    await fs.appendFile(this.filePath, `${this.parsedString}]`);
  }

  private async dropFile() {
    try {
      await fs.rm(this.filePath, { recursive: true, force: true });
    } catch (e) {}
  }

  private async createDirIfNotExists() {
    try {
      await fs.readdir(this.dirPath);
    } catch (e) {
      await fs.mkdir(this.dirPath);
    }
  }
}
