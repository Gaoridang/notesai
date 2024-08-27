create or replace function hybrid_search(
  query_text text,
  query_embedding vector(512),
  match_count int
)
returns setof user_activities
language sql
as $$
with semantic as (
  select
    id,
    row_number() over (order by embedding <#> query_embedding) as rank_ix
  from
    user_activities
  order by rank_ix
  limit match_count
)
select
  user_activities.*
from
  semantic
  join user_activities on semantic.id = user_activities.id
order by
  1.0 / (semantic.rank_ix)
limit
  match_count
$$;
