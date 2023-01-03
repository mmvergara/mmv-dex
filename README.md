# MMV DEX

ongoing....

## To Do:

- server side validation supabase edge function

- Admin Dashboard
- postgre function to update api_calls table called_by to null when a user is deleted (NOT POSSIBLE)
- seo with Head Tags



-SQL
 - Add Anon key devs policies for all operations
 - no public all policies should have roles

## Installation

> Initialize supabase Tables,Policies,Buckets
> Turn off email verification
> Deploy supabase edge functions
> add next.config.js SUPABASE URL

> supabase functions deploy createpost --project-ref {supabase_url}

> Generate types `npx supabase gen types typescript --project-id 'wujacgzqqczonhruxjan' --schema public > types/db/db-generated-types.ts`

> Incremental Static Generation on Home Page

Notes:
    // Delete post image
    // Yeah we need to manully delete it 
    // https://github.com/supabase/supabase/discussions/7067?sort=new