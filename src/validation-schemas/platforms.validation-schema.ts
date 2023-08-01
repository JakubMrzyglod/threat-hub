import { object, string, array } from 'yup';

const platformValidationSchema = object({
  id: string().required(),
  name: string().required(),
});

export const platformsValidationsSchema = array().of(platformValidationSchema);
