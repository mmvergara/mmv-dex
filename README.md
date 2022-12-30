# MMV DEX

ongoing....

## To Do:

- protect routes
- /profile/ ui
- getServerSide typescript support
- server side validation supabase edge function
- post link solo ui component
- peer review ui
- fetch (error handling)
- postgre function to update api_calls table called_by to null when a user is deleted
- seo with Head Tags

- User feedback when no posts are available

## Installation

> Initialize supabase Tables,Policies,Buckets 
 > Turn off email verification
> Deploy supabase edge functions
> add next.config.js SUPABASE URL

> supabase functions deploy createpost --project-ref {supabase_url}

> Generate types `npx supabase gen types typescript --project-id 'wujacgzqqczonhruxjan' --schema public > types/db/db-generated-types.ts`