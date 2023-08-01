import { PlatformRelation } from './platform-relation.type';

export type Assert = {
  id: number;
  name: string;
  platforms: PlatformRelation[];
};
