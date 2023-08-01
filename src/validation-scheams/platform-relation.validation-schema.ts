import { object, string, array, number } from 'yup';

export const platformRelationValidationsSchema = object({
  id: string().required(),
  version: object({
    min: number().required(),
    max: number().required(),
  }),
});
