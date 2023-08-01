import { object, string, array, number } from 'yup';

const platformValidationSchema = object({
  id: number().required(),
  name: string().required(),
});

export const platformsValidationsSchema = array()
  .of(platformValidationSchema)
  .required();
