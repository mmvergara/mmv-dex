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

const titleValidation = yup
  .string()
  .min(6, "Title Minimum of 6 characters")
  .trim()
  .required("Title field is required");

const descriptionValidation = yup
  .string()
  .min(6, "Description Minimum of 6 characters")
  .trim()
  .required("Description field is required.");

export const authValidationSchema = yup.object({
  username: usernameValidation,
  password: passwordValidation,
});

export const postValidationSchema = yup.object({
  title: titleValidation,
  description: descriptionValidation,
});
