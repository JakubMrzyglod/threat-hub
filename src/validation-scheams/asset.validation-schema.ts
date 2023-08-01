import { object, string, array } from 'yup';
import { platformRelationValidationsSchema } from './platform-relation.validation-schema';

export const assetValidationSchema = object({
  id: string().required(),
  name: string().required(),
  platforms: array().of(platformRelationValidationsSchema),
});
