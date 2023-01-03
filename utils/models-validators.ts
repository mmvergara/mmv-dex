import * as yup from "yup";
import { File as formidableFile } from "formidable";
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

const max_score_rating = yup.number().min(1, "Minimum rating is 1").max(5, "Maximum rating is 5");

export const peerReviewValidation = yup.object({
  name: stringRequired("Name is required", 6, 500),
  date: yup.date().required("Date is required"),

  presentation_rating_comment: stringRequired("Presentation score comment", 6, 500),
  presentation_rating_score: max_score_rating,

  technical_rating_comment: stringRequired("Technical score comment", 6, 500),
  technical_rating_score: max_score_rating,

  assists_peers_rating_comment: stringRequired("Assissts peers score comment", 6, 500),
  assists_peers_rating_score: max_score_rating,

  documentation_rating_comment: stringRequired("Documentation score comment", 6, 500),
  documentation_rating_score: max_score_rating,

  optional_rating_stood_out: yup.string().max(500, "stood_out Max of 500 characters").trim(),
});

export async function validation<T = Record<string, any>>(scheme: yup.SchemaOf<T>, data: Record<string, any> | null) {
  try {
    await scheme.validate(data, { abortEarly: false });
    return { isValid: true };
  } catch (e) {
    return { isValid: false };
  }
}


// import { File as formidableFile } from "formidable";
                                  // file is temporarily typed as any Formidable having issues with nextjs
export const formidableFileValidation = (file: any, allowedFileTypes: string[]) => {
  let error: { message: string } | null = null;
  let message = "";

  // Check if it's a PersistentFile formidable file
  if (!file?.mimetype) message += "Invalid received data is not a file";

  // Check file type
  if (file.mimetype) {
    const mimetype = file.mimetype;
    if (!allowedFileTypes.some((fileType) => fileType === mimetype.split("/").pop())) {
      message += "Invalid file type";
    }
  }
  // Max 10MB
  // Client feedback shows 8MB making extra room for the server side image processing
  if (file.size > 8_000_000) message += "File exceeds maximum size (8MB)";
  if (!!message) error = { message };

  return { error };
};

// by:mmvergara
