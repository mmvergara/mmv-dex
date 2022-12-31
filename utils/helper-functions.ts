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
