import { peer_reviews_evaluation_db, peer_reviews_evaluation_parsed } from "../types/db/db-types";

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

export const peerReviewDbToParsed = (dbPeerReview: peer_reviews_evaluation_db): peer_reviews_evaluation_parsed => {
  return {
    name: dbPeerReview.name,
    date: dbPeerReview.date,

    presentation_rating_score: dbPeerReview.required_rating.presentation_score.score,
    presentation_rating_comment: dbPeerReview.required_rating.documentation_score.comment,

    technical_rating_score: dbPeerReview.required_rating.technical_score.score,
    technical_rating_comment: dbPeerReview.required_rating.technical_score.comment,

    assists_peers_rating_score: dbPeerReview.required_rating.assists_peers_score.score,
    assists_peers_rating_comment: dbPeerReview.required_rating.assists_peers_score.comment,

    documentation_rating_score: dbPeerReview.required_rating.documentation_score.score,
    documentation_rating_comment: dbPeerReview.required_rating.documentation_score.comment,

    optional_rating_stood_out: dbPeerReview.optional_rating.stood_out,
  };
};

export const peerReviewParsedToDb = (dbPeerReview: peer_reviews_evaluation_parsed): peer_reviews_evaluation_db => {
  return {
    name: dbPeerReview.name,
    date: dbPeerReview.date,

    required_rating: {
      presentation_score: {
        score: dbPeerReview.presentation_rating_score,
        comment: dbPeerReview.presentation_rating_comment,
      },
      technical_score: {
        comment: dbPeerReview.technical_rating_comment,
        score: dbPeerReview.technical_rating_score,
      },
      assists_peers_score: {
        score: dbPeerReview.assists_peers_rating_score,
        comment: dbPeerReview.assists_peers_rating_comment,
      },
      documentation_score: {
        score: dbPeerReview.documentation_rating_score,
        comment: dbPeerReview.documentation_rating_comment,
      },
    },

    optional_rating: {
      stood_out: dbPeerReview.optional_rating_stood_out,
    },
  };
};
