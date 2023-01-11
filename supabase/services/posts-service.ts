import { posts, profiles } from '../../types/db/db-types';
import { SupabaseClient } from '@supabase/auth-helpers-nextjs';
import { DatabaseTypes } from '../../types/db/db-types';

// getPagination codeby: silentworks https://github.com/supabase/supabase/discussions/1223
export const getPagination = (page: number, size: number) => {
  const limit = size ? +size : 3;
  const from = page ? (page - 1) * limit : 0;
  const to = page ? from + size - 1 : size - 1;
  return { from, to };
};

export const getPosts = async (
  supabase: SupabaseClient<DatabaseTypes>,
  paginate?: { from: number; to: number },
  orderAscending: boolean = false
) => {
  if (paginate) {
    return await supabase
      .from('posts')
      .select('id,title,description,created_at,image_path, profiles( * )', { count: 'exact' })
      .order('created_at', { ascending: orderAscending })
      .range(paginate.from, paginate.to);
  }
  return supabase
    .from('posts')
    .select('id,title,description,created_at,image_path, profiles( * )', { count: 'exact' })
    .order('created_at', { ascending: orderAscending });
};

export const getReviews = async (
  supabase: SupabaseClient<DatabaseTypes>,
  paginate?: { from: number; to: number },
  orderAscending: boolean = false
) => {
  if (paginate) {
    return await supabase
      .from('peer_reviews')
      .select('*', { count: 'exact' })
      .order('inserted_at', { ascending: orderAscending })
      .range(paginate.from, paginate.to);
  }
  return supabase
    .from('peer_reviews')
    .select('*', { count: 'exact' })
    .order('inserted_at', { ascending: orderAscending });
};

export const getPostById = async (supabase: SupabaseClient<DatabaseTypes>, postid: string) =>
  await supabase.from('posts').select('*,profiles(id,email)').eq('id', postid).maybeSingle();

export const getUserPostsById = async (supabase: SupabaseClient<DatabaseTypes>, user_id: string, limit?: number) => {
  if (limit) {
    return await supabase
      .from('posts')
      .select('id,title,description,created_at,image_path,author')
      .eq('author', user_id)
      .limit(limit);
  }
  return await supabase.from('posts').select('id,title,description,created_at,image_path').eq('id', user_id);
};

export const getUserPostsTitleById = async (
  supabase: SupabaseClient<DatabaseTypes>,
  user_id: string,
  limit?: number
) => {
  if (limit) {
    return await supabase
      .from('posts')
      .select('id,title,created_at')
      .eq('author', user_id)
      .order('created_at', { ascending: false })
      .limit(limit);
  }
  return await supabase
    .from('posts')
    .select('id,title,created_at')
    .eq('id', user_id)
    .order('created_at', { ascending: false });
};

export type postWithProfilesResponse = Awaited<ReturnType<typeof getPosts>>;
export type postDetails = postWithProfilesResponse['data'];
export type postDetailsQuery = {
  data: postWithProfilesResponse['data'];
  error: postWithProfilesResponse['error'];
  hasMore: boolean;
};
export type postDetailProps = {
  id: posts['id'];
  title: posts['title'];
  description: posts['description'];
  image_url: string;
  created_at: posts['created_at'];
} & { email: profiles['email'] };
