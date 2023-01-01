import { FormikState } from "formik";
import { supabaseClient } from "../supabase/clientz";

export const classNameJoin = (...classes: string[]) => classes.filter(Boolean).join(" ");
export const getServerSidePropsRedirectTo = (destination: string, permanent: boolean = false) => {
  return {
    redirect: {
      destination,
      permanent,
    },
  };
};

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
