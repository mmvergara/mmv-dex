# MMV DEX

ongoing....

## To Do:

- peer review ui
- UI and backend - Reviewer cannot review himself/herself
- server side validation supabase edge function
- postgre function to update api_calls table called_by to null when a user is deleted
- seo with Head Tags
- search user ui


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
