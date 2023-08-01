import { object, number } from 'yup';

export const platformRelationValidationsSchema = object({
  id: number().required(),
  version: object({
    min: number().required(),
    max: number().required(),
  }),
});
