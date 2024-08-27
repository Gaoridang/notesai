create table user_activities (
  id bigserial primary key,
  user_id bigint not null,
  date date not null,
  title text,
  description text,
  embedding vector(512)
);
