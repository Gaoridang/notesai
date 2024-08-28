CREATE OR REPLACE FUNCTION match_activities(query_embedding vector(1536), match_date date, match_threshold float, match_count int)
RETURNS TABLE (id uuid, content text, metadata jsonb, similarity float)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    ua.id,
    ua.content,
    ua.metadata,
    1 - (ae.embedding <=> query_embedding) AS similarity
  FROM
    user_activities ua
    JOIN activity_embeddings ae ON ua.id = ae.activity_id
  WHERE
    (ua.metadata->>'timestamp')::date = match_date
  AND 1 - (ae.embedding <=> query_embedding) > match_threshold
  ORDER BY ae.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

CREATE OR REPLACE FUNCTION match_activities_range(query_embedding vector(1536), start_date date, end_date date, match_threshold float, match_count int)
RETURNS TABLE (id uuid, content text, metadata jsonb, similarity float)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    ua.id,
    ua.content,
    ua.metadata,
    1 - (ae.embedding <=> query_embedding) AS similarity
  FROM
    user_activities ua
    JOIN activity_embeddings ae ON ua.id = ae.activity_id
  WHERE
    (ua.metadata->>'timestamp')::date BETWEEN start_date AND end_date
  AND 1 - (ae.embedding <=> query_embedding) > match_threshold
  ORDER BY ae.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;