-- WORKIONGGG
create or replace function public.delete_post_image() 
returns trigger as $$
declare
  myurl varchar := 'https://gzqicwnrxaguhmzvujut.supabase.co';
  service_role_key varchar := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6cWljd25yeGFndWhtenZ1anV0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY3Mjc0NTA2MCwiZXhwIjoxOTg4MzIxMDYwfQ.LwAN_9lVaJV6ZtI7T51iUIwb3tLTUn914gsPzuuJTNQ';
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



