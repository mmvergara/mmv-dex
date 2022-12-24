import * as yup from "yup";

export default async function validation<T = Record<string, any>>(
  scheme: yup.SchemaOf<T>,
  data: Record<string, any> | null
) {
  try {
    await scheme.validate(data, { abortEarly: false });
    return { isValid: true, errors: null };
  } catch (error: any) {
    console.log("ERROR VALIDATION SERVER SIDE");
    console.log(error);
    const { errors } = error;
    return { isValid: false, errors };
  }
}
