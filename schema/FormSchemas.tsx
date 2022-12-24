import * as yup from "yup";

const usernameValidation = yup
  .string()
  .min(6, "Username Minimum of 6 characters")
  .trim()
  .required("Username field is required.");

const passwordValidation = yup
  .string()
  .min(6, "Password Minimum of 6 characters")
  .trim()
  .required("Password field is required.");

export const authValidationSchema = yup.object({
  username: usernameValidation,
  password: passwordValidation,
});
