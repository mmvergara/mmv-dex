import { FormikState } from "formik";
import { supabaseClient } from "../supabase/clientz";

export const classNameJoin = (...classes: string[]) => classes.filter(Boolean).join(" ");


export const getImagePublicUrl = (image_path: string, bucketName: string) => {
  const { data } = supabaseClient.storage.from(bucketName).getPublicUrl(image_path);
  return data.publicUrl;
};

export const getFormikErrorMessages = <T>(formik: FormikState<T>) => {
  const getFieldsName = Object.keys(formik.touched) as Array<keyof T>;
  const arrayOfErrorMessages = getFieldsName.map((fieldName) => formik.touched[fieldName] && formik.errors[fieldName]);
  return arrayOfErrorMessages.filter((x) => !!x);
};

export const limitStringToNLength = (string: string, maxLength: number) => {
  if (string.length < maxLength) return string;
  return string.slice(0, maxLength) + "...";
};

export const getRequiredRatings = (obj: { [key: string]: string } | any) => {
  return Array.from(
    new Set(
      Object.keys(obj)
        .filter((formikFields) => {
          // Get required fields from formik.values
          return formikFields.endsWith("score") || formikFields.endsWith("comment");
        })
        .map((x) => x.split("_rating")[0]) // remove "get required rating names"
    ) // turn to set to remove duplicates
  ); // Conver back to array
};
