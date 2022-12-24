import { NextApiRequest } from "next";

export default function allowedMethod(req: NextApiRequest, allowedMethod: "PUT" | "POST" | "GET") {
  console.log({ req: req.method, allowedMethod });
  return req.method === allowedMethod;
}
