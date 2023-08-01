import { object, number, array, string } from 'yup';
import { platformRelationValidationsSchema } from './platform-relation.validation-schema';

const assetValidationSchema = object({
  id: number().required(),
  name: string().required(),
  platforms: array().of(platformRelationValidationsSchema).required(),
});

export const assetsValidationSchema = array()
  .of(assetValidationSchema)
  .required();
