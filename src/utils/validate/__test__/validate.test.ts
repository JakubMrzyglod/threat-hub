import { validate } from '../validate.util';
import { assetsValidationSchema } from '../../../validation-schemas';
import { ValidationError } from 'yup';

describe(`readJsonFile`, () => {
  it('should throw error for invalid data', async () => {
    const data = [{ id: 1 }];
    const readPromise = validate(data, assetsValidationSchema);

    await expect(readPromise).rejects.toEqual(
      new ValidationError('[0].platforms is a required field')
    );
  });

  it('should successfully valid and return void', async () => {
    const data = [
      {
        id: 1,
        name: 'name',
        platforms: [{ id: 1, version: { min: 0, max: 1 } }],
      },
    ];
    const readPromise = validate(data, assetsValidationSchema);

    await expect(readPromise).resolves.toEqual(undefined);
  });
});
