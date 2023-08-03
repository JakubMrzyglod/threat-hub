import * as path from 'path';
import * as fs from 'fs/promises';
import { Observable, ReplaySubject, lastValueFrom, map, mergeMap } from 'rxjs';

export class SaveFileBus<T extends Record<string, any>> {
  private isFirstItem: boolean = true;
  private filePath: string;
  private appendsSubject: ReplaySubject<T[]>;
  private appends$: Observable<void>;

  constructor(private dirPath: string, fileName: string) {
    this.filePath = path.join(dirPath, `${fileName}.json`);
    this.appendsSubject = new ReplaySubject<T[]>();
    this.appends$ = this.appendsSubject.asObservable().pipe(
      mergeMap(async (items, i) => {
        for (let i = 0; i < items.length; i++) {
          const addCommaBefore = !this.isFirstItem;
          this.isFirstItem = false;
          const jsonData = `${addCommaBefore ? ',' : ''}${JSON.stringify(
            items[i]
          )}`;
          await fs.appendFile(this.filePath, jsonData);
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
    await fs.appendFile(this.filePath, ']');
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
