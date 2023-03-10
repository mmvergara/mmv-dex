-- PROFILES TABLE
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email varchar unique not null,
  role varchar not null,
  inserted_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table profiles
  enable row level security;

--  Check if user is admin
create function public.is_admin(user_id uuid) 
returns boolean
language plpgsql security definer
as $$
begin
  return exists (select 1 from profiles where profiles.id = user_id and profiles.role = 'admin');
end
$$;

CREATE POLICY "Admin users can do CRUD on profiles" ON "public"."profiles"
AS PERMISSIVE FOR ALL
TO authenticated
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Enable read access for all users on profiles" ON "public"."profiles"
AS PERMISSIVE FOR SELECT
TO anon, authenticated
USING (true);

-- This trigger automatically creates a profile entry when a new user signs up via Supabase Auth.
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email,'user');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- POST TABLE
create table posts (
  id bigint generated always as identity primary key,
  author uuid references public.profiles on delete cascade not null,
  title text not null,
  description text not null,
  image_path text not null,
  img_is_compressed boolean not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,

  CONSTRAINT title_min_length CHECK (char_length(title) >= 7),
  CONSTRAINT title_max_length CHECK (char_length(title) <= 51),

  CONSTRAINT description_min_length CHECK (char_length(description) >= 6),
  CONSTRAINT description_max_length CHECK (char_length(description) <= 500)
);

-- Set up row level security on posts table
alter table posts
  enable row level security;

CREATE POLICY "Admin users can do CRUD on posts" ON "public"."posts"
AS PERMISSIVE FOR ALL
TO authenticated
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Enable create post for authenticated users only on posts" ON "public"."posts"
AS PERMISSIVE FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Enable read access for all users on posts" ON "public"."posts"
AS PERMISSIVE FOR SELECT
TO anon,authenticated
USING (true);

CREATE POLICY "Enable users to do CRUD on post that they own on posts" ON "public"."posts"
AS PERMISSIVE FOR ALL
TO authenticated
USING ((uid() = author))
WITH CHECK ((uid() = author));


-- API_CALLS TABLE
create table api_calls (
  id bigint generated always as identity primary key,
  api_path text not null,
  called_by uuid references profiles on delete cascade,
  called_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table api_calls
  enable row level security;

CREATE POLICY "Enable insert for anon and authenticated users on api_calls" ON "public"."api_calls"
AS PERMISSIVE FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Admin users can do CRUD on api_calls" ON "public"."api_calls"
AS PERMISSIVE FOR ALL
TO authenticated
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));


-- PEER_REVIEW TABLE
CREATE TABLE peer_reviews (
  id bigint generated always as identity primary key,
  evaluation jsonb not null,
  reviewer uuid references profiles on delete cascade not null,
  reviewee uuid references profiles on delete cascade not null,
  inserted_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table peer_reviews
  enable row level security;

CREATE POLICY "users to create peer_reviews but not for themeselves" ON "public"."peer_reviews"
AS PERMISSIVE FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = reviewer and auth.uid() != reviewee);

CREATE POLICY "Admin users can do CRUD on peer_reviews" ON "public"."peer_reviews"
AS PERMISSIVE FOR ALL
TO authenticated
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

-- POST IMAGES BUCKET
INSERT INTO storage.buckets (id,name,public) values ('post-images','post-images','true');

CREATE POLICY "Enable all users to see post-images 1hys5dx_0" ON storage.objects 
FOR SELECT TO anon, authenticated USING (bucket_id = 'post-images');

CREATE POLICY "Enable authenticated users to upload images 1hys5dx_0" ON storage.objects
FOR INSERT TO authenticated WITH CHECK (bucket_id = 'post-images' and uid() IS NOT NULL and owner = uid());

CREATE POLICY "service_role users can delete images" ON storage.objects
FOR DELETE TO service_role USING (bucket_id = 'post-images');

CREATE POLICY "service_role users can insert images 1hys5dx_0" ON storage.objects
FOR INSERT TO service_role WITH CHECK (bucket_id = 'post-images');

create or replace function public.employee_review_keyword_analysis(pattern text) 
returns setof peer_reviews  as $$
  SELECT *
  FROM peer_reviews
  WHERE evaluation::text ~* pattern;
$$ language sql;



--------#################
--------#################
--------#################
--------#################
--------#################

create or replace function public.delete_post_image() 
returns trigger as $$
declare
  myurl varchar := '{YOUR SUPABASE PROJECT URL HERE}';
  service_role_key varchar := '{YOUR SERVICE ROLE KEY HERE}';
  url varchar := myurl||'/storage/v1/object/'||'post-images'||'/'||old.image_path;
begin
perform (select status FROM http((
          'DELETE',
            url,
           ARRAY[http_header('authorization','Bearer '||service_role_key)],
           NULL,
           NULL
        )::http_request));
return old;
end;
$$ security definer language plpgsql;

create trigger on_post_delete
  after delete on public.posts
  for each row execute procedure public.delete_post_image();


