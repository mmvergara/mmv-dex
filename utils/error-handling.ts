import { AxiosError } from "axios";

export const apiError = (e: unknown) => {
  const error = e as Error & { statusCode: number };
  return {
    errData: { error: { message: error.message }, data: null },
    code: error.statusCode,
  };
};

export const newError = (errorMessage: string, errorCode: number) => {
  const newErr = new Error(errorMessage);
  //@ts-ignore
  newErr.statusCode = errorCode || 500;
  return newErr;
};

export const axiosErrorParse = (err: unknown) => {
  const error = err as AxiosError<{ data: null; error: { message: string } }>;
  const message = error.response?.data.error.message || error.message;
  return { data: null, error: { message } };
};
