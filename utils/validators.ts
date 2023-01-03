import formidable from "formidable";
import * as yup from "yup";

export async function validation<T = Record<string, any>>(scheme: yup.SchemaOf<T>, data: Record<string, any> | null) {
  try {
    await scheme.validate(data, { abortEarly: false });
    return { isValid: true };
  } catch (e) {
    return { isValid: false };
  }
}

export const formidableFileValidation = (file: formidable.File, allowedFileTypes: string[]) => {
  let error: { message: string } | null = null;
  let message = "";

  // Check if it's a PersistentFile formidable file
  if (!(file instanceof formidable.File)) message += "Invalid received data is not a file";

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
