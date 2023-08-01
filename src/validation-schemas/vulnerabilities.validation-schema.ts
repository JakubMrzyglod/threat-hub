import { object, string, array, number } from 'yup';
import { platformRelationValidationsSchema } from './platform-relation.validation-schema';

export const vulnerabilityValidationSchema = object({
  id: number().required(),
  name: string().required(),
  platforms: array().of(platformRelationValidationsSchema).required(),
});

export const vulnerabilitiesValidationSchema = array()
  .of(vulnerabilityValidationSchema)
  .required();
