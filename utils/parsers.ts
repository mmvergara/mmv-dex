import { Json } from "../types/db/db-generated-types";
import { peer_review_evaluation } from "../types/db/db-types";

export const emailToUsername = (email: string | any) => {
  if (email && typeof email === "string") {
    return email.split("@").slice(0, -1)[0];
  }
  return "";
};
export const usernameToEmail = (username: string | any) => {
  if (username && typeof username === "string") {
    return username + "@dexlocalhost.com";
  }
  return "";
};

// export const peerReviewDbToParsed = (dbPeerReview: Json) => {
//   const evaluationJSON = JSON.stringify(dbPeerReview, null, 2);
//   const evaluationDB = JSON.parse(evaluationJSON) as peer_review_evaluation;
//   return {
//     name: evaluationDB.name,
//     date: evaluationDB.date,

//     presentation_rating_score: evaluationDB.required_rating.presentation_score.score,
//     presentation_rating_comment: evaluationDB.required_rating.documentation_score.comment,

//     technical_rating_score: evaluationDB.required_rating.technical_score.score,
//     technical_rating_comment: evaluationDB.required_rating.technical_score.comment,

//     assists_peers_rating_score: evaluationDB.required_rating.assists_peers_score.score,
//     assists_peers_rating_comment: evaluationDB.required_rating.assists_peers_score.comment,

//     documentation_rating_score: evaluationDB.required_rating.documentation_score.score,
//     documentation_rating_comment: evaluationDB.required_rating.documentation_score.comment,

//     optional_rating_stood_out: evaluationDB.optional_rating.stood_out,
//   };
// };

// export const peerReviewParsedToDb = (parsedPeerReview: peer_reviews_evaluation_parsed): peer_reviews_evaluation_db => {
//   return {
//     name: parsedPeerReview.name,
//     date: parsedPeerReview.date,

//     required_rating: {
//       presentation_score: {
//         score: parsedPeerReview.presentation_rating_score,
//         comment: parsedPeerReview.presentation_rating_comment,
//       },
//       technical_score: {
//         comment: parsedPeerReview.technical_rating_comment,
//         score: parsedPeerReview.technical_rating_score,
//       },
//       assists_peers_score: {
//         score: parsedPeerReview.assists_peers_rating_score,
//         comment: parsedPeerReview.assists_peers_rating_comment,
//       },
//       documentation_score: {
//         score: parsedPeerReview.documentation_rating_score,
//         comment: parsedPeerReview.documentation_rating_comment,
//       },
//     },

//     optional_rating: {
//       stood_out: parsedPeerReview.optional_rating_stood_out,
//     },
//   };
// };
