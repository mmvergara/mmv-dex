-- Create a table for public profiles
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text unique not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  inserted_at timestamp with time zone default timezone('utc'::text, now()) not null,

  constraint username_length check (char_length(email) >= 23)
);
-- @dexlocalhost.com.length = 17 
-- 17 + 6 == 23


-- Set up Row Level Security (RLS)
alter table profiles
  enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);


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

------------

-- create posts table
create table posts (
  id bigint generated always as identity primary key,
  author uuid references profiles.id on delete cascade not null,
  title text not null,
  description text not null,
  image_url text not null,
  img_is_compressed boolean not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,

  CONSTRAINT titlechk CHECK (char_length(title) >= 6),
  CONSTRAINT descriptionchk CHECK (char_length(description) >= 6)
);

-- Set up row level security on posts table
alter table posts
  enable row level security;

CREATE POLICY "posts are public" ON "public"."posts"
AS PERMISSIVE FOR SELECT
TO public
USING (true);

CREATE POLICY "authenticated users can create post" ON "public"."posts"
AS PERMISSIVE FOR INSERT
TO public
WITH CHECK (auth.uid() is not null);

CREATE POLICY "users can only delete posts that they own" ON "public"."posts"
AS PERMISSIVE FOR DELETE
TO public
USING (auth.uid() = author);

-- create posts-images bucket
insert into storage.buckets (id, name)
  values ('avatars', 'avatars');
INSERT INTO storage.buckets (id,name) values ("post-images","post-images");
CREATE POLICY "enable all users to see post-images" ON storage.objects FOR SELECT TO public USING (true);
CREATE POLICY "only authenticated users can upload images 1hys5dx_0" ON storage.objects FOR INSERT TO public WITH CHECK ((uid() IS NOT NULL));


-- go to  Authentication > Providers > Email > Disable Confirm Email


-- create api_calls_table
create table api_calls (
  id bigint generated always as identity primary key,
  api_path text not null,
  called_by uuid references profiles on delete cascade,
  called_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table api_calls
  enable row level security;

CREATE POLICY "Enable insert for anon and authenticated users" ON "public"."api_calls"
AS PERMISSIVE FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Enable read access for all anon and authenticated users" ON "public"."api_calls"
AS PERMISSIVE FOR SELECT
TO anon, authenticated
USING (true);
