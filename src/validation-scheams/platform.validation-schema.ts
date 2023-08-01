import { object, string } from 'yup';

export const platformValidationSchema = object({
  id: string().required(),
  name: string().required(),
});
