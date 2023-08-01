import { AnyObject, Schema } from 'yup';

export const validate = async <T, R>(
  data: T,
  validationSchema?: Schema<R, AnyObject>
) => {
  if (!validationSchema) {
    return;
  }

  await validationSchema.validate(data);
};
