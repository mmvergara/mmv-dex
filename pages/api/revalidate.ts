// import { NextApiRequest, NextApiResponse } from "next";
// import { SECRET_REVALIDATE_TOKEN } from "../../config";
// import { apiError, newError } from "../../utils/error-handling";
// import allowedMethod from "../../utils/check-method";

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   // const supabase = createServerSupabaseClient<DatabaseTypes>({ req, res });
//   try {
//     if (!allowedMethod(req, "POST")) throw newError("Method not allowed", 405);
//     if (req.query?.secret_revalidate_token !== SECRET_REVALIDATE_TOKEN) {
//       throw newError("Invalid revalidate token", 401);
//     }
//     await res.revalidate("/");
//     return res.status(200).send({ message: "/ revalidated" });
//   } catch (e) {
//     const { errData, code } = apiError(e);
//     res.status(code || 500).send(errData);
//   }
// }
