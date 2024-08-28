-- Enable the necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create the activities table
CREATE TABLE activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    description TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create the activity_embeddings table
CREATE TABLE activity_embeddings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    activity_id UUID NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
    embedding vector(1536),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create an index on the embedding column for faster similarity search
CREATE INDEX ON activity_embeddings USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Create a function to update the updated_at column
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_activities_modtime
BEFORE UPDATE ON activities
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Create a function for hybrid search with Korean support
CREATE OR REPLACE FUNCTION hybrid_search_2(
    query_text TEXT,
    query_embedding vector(1536),
    match_count INT
)
RETURNS TABLE (
    id UUID,
    description TEXT,
    metadata JSONB,
    similarity FLOAT,
    created_at TIMESTAMP WITH TIME ZONE
) LANGUAGE plpgsql AS $$
BEGIN
    RETURN QUERY
    SELECT
        a.id,
        a.description,
        a.metadata,
        (1 - (ae.embedding <=> query_embedding)) * 0.3 +
        (similarity(a.description, query_text) * 0.7) AS similarity,
        a.created_at
    FROM
        activities a
    JOIN
        activity_embeddings ae ON a.id = ae.activity_id
    WHERE
        a.description % query_text
        OR 1 - (ae.embedding <=> query_embedding) > 0.2  -- Adjusted threshold
    ORDER BY
        similarity DESC
    LIMIT
        match_count;
END;
$$;

-- Create indexes to speed up trigram search
CREATE INDEX idx_activities_description_trgm ON activities USING GIN (description gin_trgm_ops);