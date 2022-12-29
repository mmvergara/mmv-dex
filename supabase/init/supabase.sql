-- go to  Authentication > Providers > Email > Disable Confirm Email



-- PROFILES TABLE
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email varchar unique not null,
  role varchar not null,
  inserted_at timestamp with time zone default timezone('utc'::text, now()) not null
);


alter table profiles
  enable row level security;

CREATE POLICY "Admin users can do CRUD on profiles" ON "public"."profiles"
AS PERMISSIVE FOR ALL
TO authenticated
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

create policy "Enable read access for all users on profiles." on "public"."profiles"
  for select using (true);

-- This trigger automatically creates a profile entry when a new user signs up via Supabase Auth.
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
  
-- PROFILES TABLE







-- POST TABLE
create table posts (
  id bigint generated always as identity primary key,
  author uuid references public.profiles on delete cascade not null,
  title text not null,
  description text not null,
  image_url text not null,
  img_is_compressed boolean not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,

  CONSTRAINT title_min_length CHECK (char_length(title) >= 6),
  CONSTRAINT title_max_length CHECK (char_length(title) <= 50),

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
TO public
USING (true);

CREATE POLICY "Enable users to do CRUD on post that they own on posts" ON "public"."posts"
AS PERMISSIVE FOR ALL
TO public
USING ((uid() = author))
WITH CHECK ((uid() = author));
-- POST TABLE





-- API_CALLS TABLE
create table api_calls (
  id bigint generated always as identity primary key,
  api_path text not null,
  called_by uuid references profiles, -- no on delete cascade
  called_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table api_calls
  enable row level security;

CREATE POLICY "Enable insert for anon and authenticated users on api_calls" ON "public"."api_calls"
AS PERMISSIVE FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Admin users can do CRUD on api_calls" ON "public"."api_calls"
AS PERMISSIVE FOR ALL
TO authenticated
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

-- API_CALLS TABLE



-- PEER_REVIEW TABLE
CREATE TABLE peer_reviews (
  id bigint generated always as identity primary key,
  evaluation jsonb not null,
  reviewer uuid references profiles on delete cascade not null
);

alter table peer_reviews
  enable row level security;

CREATE POLICY "Enable authenticated users to create peer_reviews" ON "public"."peer_reviews"
AS PERMISSIVE FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = reviewer);

CREATE POLICY "Admin users can do CRUD on peer_reviews" ON "public"."peer_reviews"
AS PERMISSIVE FOR ALL
TO authenticated
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));
-- PEER_REVIEW TABLE









-- POST IMAGES BUCKET
INSERT INTO storage.buckets (id,name) values ('post-images','post-images');
CREATE POLICY "enable all users to see post-images" ON storage.objects FOR SELECT TO public USING (true);
CREATE POLICY "Enable insert image for authenticated users only on post-images bucket" ON storage.objects FOR INSERT TO public WITH CHECK ((uid() IS NOT NULL));
-- POST IMAGES BUCKET



-- is_admin database function
create function public.is_admin(user_id uuid) 
returns boolean
language plpgsql security definer
as $$
begin
  return exists (select 1 from profiles where profiles.id = user_id and profiles.role = "admin");
end
$$;





