# Installation

## 1. Create a new supabase project

- https://supabase.com/ <br/>
- Create a new account and create a project with the region of your choice
- Go To and get your api keys and url https://app.supabase.com/project/_/settings/api

## 2. Initialize Supabase Tables | Policies | Functions

1. Go to the Project Source File > supabase > initialize.sql and <br/>
   copy the all of sql queries then <br/>
   paste it to `supabase > sql editor`

   > This will create all of the database configs like table for the project

2. Go to Database > Extensions > Enable HTTP Extension
   > This project uses this http extension to automatically delete post images when a post is deleted
3. Go to Authentication > Providers > Email > Turn off `Confirm Email`
   > We only use username and password for auth
4. Add `Supabase URL` Project in next.config.js remote patterns to enable

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [{ hostname: {YOUR SUPABASE URL HERE}, protocol: "https" }],
  },
};

module.exports = nextConfig;
```

> This for our post images so that nextjs allows then

## 4. Database Types | Deploye edge functions
### Generate Database Types
1. Install the Supabase CLI then login with your [access token](https://app.supabase.com/account/tokens)

2. Run this command to generate Database Types

```powershell
npx supabase gen types typescript --project-id 'YOUR SUPABASE PROJECT URL HERE' --schema public > types/db/db-generated-types.ts
```

### Deploy Edge Funbctions
Using the supabase CLI you can deploy your edge function using<br/>

```powershell
supabase functions deploy createpost --project-ref {YOUR SUPABASE PROJECT URL HERE}
```


## 6. Environment Variables and Dependencies

Fill out `.env.local`
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```
Install project dependencies and run the project

```powershell
npm install
npm run dev
```