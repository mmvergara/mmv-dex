import { NextApiRequest } from "next";

export default function allowedMethod(req: NextApiRequest, allowedMethod: "PUT" | "POST" | "GET") {
  return req.method === allowedMethod;
}
