import * as yup from "yup";

const stringRequired = (fieldName: string, min: number, max: number) => {
  return yup
    .string()
    .min(min, `${fieldName} Minimum of ${min} characters`)
    .max(max, `${fieldName} Max of ${max} characters`)
    .trim()
    .required(fieldName + " field is required.");
};

export const authValidationSchema = yup.object({
  username: stringRequired("Username", 6, 50),
  password: stringRequired("Password", 6, 150),
});

export const postValidationSchema = yup.object({
  title: stringRequired("Title", 6, 50),
  description: stringRequired("Description", 6, 500),
});
