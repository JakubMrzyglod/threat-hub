import { object, string, array } from 'yup';
import { platformRelationValidationsSchema } from './platform-relation.validation-schema';

export const vulnerabilityValidationSchema = object({
  id: string().required(),
  name: string().required(),
  platforms: array().of(platformRelationValidationsSchema),
});

export const vulnerabilitiesValidationSchema = array().of(
  vulnerabilityValidationSchema
);
