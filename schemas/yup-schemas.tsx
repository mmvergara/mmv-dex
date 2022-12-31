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

const max_rating = yup.number().max(5, "Max rating is 5");

export const peerReviewValidation = yup.object({
  name: stringRequired("Name is required", 6, 500),
  date: yup.date().required("Date is required"),

  presentation_score_comment: stringRequired("Presentation score comment", 6, 500),
  presentation_score_rating: max_rating,

  technical_score_comment: stringRequired("Technical score comment", 6, 500),
  technical_score_rating: max_rating,

  assists_peers_score: stringRequired("Assissts peers score comment", 6, 500),
  assists_peers_rating: max_rating,

  documentation_score: stringRequired("Documentation score comment", 6, 500),
  documentation_score_rating: max_rating,

  optional_rating_stood_out: yup
    .string()
    .min(6, "stood_out Minimum of 6 characters")
    .max(500, "stood_out Max of 500 characters")
    .trim(),
});
