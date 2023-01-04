import { SupabaseClient, SupabaseClientOptions } from "@supabase/supabase-js";
import { FormikState } from "formik";
import { supabaseClient } from "../supabase/clientz";
import {
  DatabaseTypes,
  peer_reviews,
  peer_review_evaluation,
  peer_review_formik,
  peer_review_required_ratings,
} from "../types/db/db-types";

export const classNameJoin = (...classes: string[]) => classes.filter(Boolean).join(" ");

export const emailToUsername = (email: string | any) =>
  email && typeof email === "string" ? email.split("@").slice(0, -1)[0] : "";

export const usernameToEmail = (username: string | any) =>
  username && typeof username === "string" ? `${username}@dexlocalhost.com` : "";

export const peer_review_formik_to_peer_review_evaluation = (
  peerReviewFormik: peer_review_formik
): peer_review_evaluation => {
  const peerReviewEvaluation: peer_review_evaluation = {
    name: peerReviewFormik.name,
    date: new Date().toUTCString(),
    required_rating: {
      presentation_score: {
        score: peerReviewFormik.presentation_rating_score,
        comment: peerReviewFormik.presentation_rating_comment,
      },
      technical_score: {
        score: peerReviewFormik.technical_rating_score,
        comment: peerReviewFormik.technical_rating_comment,
      },
      assists_peers_score: {
        score: peerReviewFormik.assists_peers_rating_score,
        comment: peerReviewFormik.assists_peers_rating_comment,
      },
      documentation_score: {
        score: peerReviewFormik.documentation_rating_score,
        comment: peerReviewFormik.documentation_rating_comment,
      },
    },
    optional_rating: {
      stood_out: peerReviewFormik.optional_rating_stood_out,
    },
  };
  return peerReviewEvaluation;
};

export const checkAuthOnServer = async (supabase: SupabaseClient<DatabaseTypes>) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized / Session expired, try logging in again.");
  return user
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

// Refer to X as the "search query string"
// Refer to X as the "search query string"
export const postsKeywordAnalysis = (
  posts: { id: number; description: string; author: string }[] | null,
  searchString: string
) => {
  if (!posts || searchString.length === 0) return null;
  const totalPosts = posts.length;
  let total_OccurenceOf_X_InDesc = 0;
  let total_OccurenceOf_X_InEachPostDescription_WithId: { id: number; searchStringOccurenceCount: number }[] = [];

  // We are using a set so the users id won't be duplicated
  const seenAuthors = new Set<string>();

  for (let i = 0; i < posts.length; i++) {
    const descriptionHasSearchString = posts[i].description.toLowerCase().includes(searchString.toLowerCase());

    if (descriptionHasSearchString) {
      const occurenceOfXinTheCurrentDescription = countOccurrences(posts[i].description, searchString);
      total_OccurenceOf_X_InDesc += occurenceOfXinTheCurrentDescription;
      total_OccurenceOf_X_InEachPostDescription_WithId.push({
        id: posts[i].id,
        searchStringOccurenceCount: occurenceOfXinTheCurrentDescription,
      });
    }
    if (descriptionHasSearchString) seenAuthors.add(posts[i].author);
  }

  return {
    totalPosts,
    total_OccurenceOf_X_InDesc,
    total_OccurenceOf_X_InEachPostDescription_WithId,
    total_UsersUsing_X_inTheirDesc: seenAuthors.size,
  };
};

export type PostAnalysisResult = ReturnType<typeof postsKeywordAnalysis>;

const countOccurrences = (inputString: string, searchString: string): number => {
  if (searchString.length === 0) return 0;
  let counter = 0;
  let startIndex = 0;

  while (true) {
    const index = inputString.toLowerCase().indexOf(searchString.toLowerCase(), startIndex);
    if (index === -1) break;
    counter++;
    startIndex = index + searchString.length;
  }

  return counter;
};

const getCommentsFromPR_required_ratings = (required_ratings: peer_review_required_ratings) => {
  const evaluationValues = Object.values(required_ratings);
  const comments = evaluationValues
    .map((ev) => {
      return ev.comment;
    })
    .join(" ");
  return comments;
};

type KeywordsAnalysis = {
  [key: string]: {
    keywordOccurrences: number;
    reviewsContainingKeyword: number;
  };
};

export const employeeReviewKeywordAnalysis = (evaluations: peer_reviews[] | null, pattern: string) => {
  if (!pattern) return null;
  if (!evaluations) return null;

  const reviewKeywords = pattern.split("|");
  const keywordsAnalysis: KeywordsAnalysis = {};

  for (const evaluation of evaluations) {
    const seenKeyword = new Set<string>();
    const comments = getCommentsFromPR_required_ratings(evaluation.evaluation.required_rating);
    const optionalComments = Object.values(evaluation.evaluation.optional_rating).join(" ");
    const allComments = `${comments} ${optionalComments}`;

    for (const keyword of reviewKeywords) {
      if (seenKeyword.has(keyword)) continue;
      seenKeyword.add(keyword);

      if (allComments.includes(keyword)) {
        keywordsAnalysis[keyword] = {
          reviewsContainingKeyword: (keywordsAnalysis[keyword]?.reviewsContainingKeyword || 0) + 1,
          keywordOccurrences:
            (keywordsAnalysis[keyword]?.keywordOccurrences || 0) + countOccurrences(allComments, keyword),
        };
      } else {
        keywordsAnalysis[keyword] = {
          reviewsContainingKeyword: 0,
          keywordOccurrences: 0,
        };
      }
    }
  }

  return Object.entries(keywordsAnalysis);
};

export type employeeReviewKeywordAnalysisResults = ReturnType<typeof employeeReviewKeywordAnalysis>;
