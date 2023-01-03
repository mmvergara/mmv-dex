import { NextApiRequest } from "next";
import { AxiosError } from "axios";

type httpMethods = "PUT" | "POST" | "GET" | "DELETE";
export default function allowedMethod(req: NextApiRequest, allowedMethod: httpMethods) {
  return req.method === allowedMethod;
}

export const apiError = (e: unknown) => {
  console.log(e)
  const error = e as Error & { statusCode: number };
  return {
    errData: { error: { message: error.message }, data: null },
    code: error.statusCode || 400,
  };
};

export const newError = (errorMessage: string, errorCode: number) => {
  const newErr = new Error(errorMessage);
  //@ts-ignore
  newErr.statusCode = errorCode || 500;
  return newErr;
};

export const axiosErrorParse = (err: unknown) => {
  console.log(err)
  const error = err as AxiosError<{ data: null; error: { message: string } }>;
  const message = error.response?.data?.error?.message || error.message;
  return { error: { message } };
};
