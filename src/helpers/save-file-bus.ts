import * as path from 'path';
import * as fs from 'fs/promises';
import { Observable, ReplaySubject, lastValueFrom, map, mergeMap } from 'rxjs';

export class SaveFileBus<T extends Record<string, any>> {
  private isFirstItem: boolean = true;
  private filePath: string;
  private appendsSubject: ReplaySubject<T[]>;
  private appends$: Observable<Promise<void>>;
  private parsedString = '';
  private maxParsedStringLength = Math.pow(2, 27);

  constructor(private dirPath: string, fileName: string) {
    this.filePath = path.join(dirPath, `${fileName}.json`);
    this.appendsSubject = new ReplaySubject<T[]>();
    this.appends$ = this.appendsSubject.asObservable().pipe(
      map(async (items, i) => {
        for (let i = 0; i < items.length; i++) {
          const addCommaBefore = !this.isFirstItem;
          this.isFirstItem = false;
          const jsonData = `${addCommaBefore ? ',' : ''}${JSON.stringify(
            items[i]
          )}`;
          this.parsedString += jsonData;
          if (this.parsedString.length >= this.maxParsedStringLength) {
            const tempParsedString = this.parsedString;
            this.parsedString = '';
            await fs.appendFile(this.filePath, tempParsedString);
          }
        }
      })
    );
  }

  async init() {
    await this.dropFile();
    await this.createDirIfNotExists();
    await fs.appendFile(this.filePath, '[');
  }

  addAppendEvent(items: T[]) {
    this.appendsSubject.next(items);
  }

  async end() {
    console.log('end');
    this.appendsSubject.complete();
    await lastValueFrom(this.appends$, { defaultValue: true });
    await fs.appendFile(this.filePath, `${this.parsedString}]`);
  }

  private async dropFile() {
    try {
      await fs.rm(this.filePath, { recursive: true, force: true });
    } catch (e) {
      console.log({ e });
    }
  }

  private async createDirIfNotExists() {
    try {
      await fs.readdir(this.dirPath);
    } catch (e) {
      await fs.mkdir(this.dirPath);
    }
  }
}
