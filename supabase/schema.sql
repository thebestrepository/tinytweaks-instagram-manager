-- TinyTweaks Instagram Manager — Supabase Schema
-- Run this in the Supabase SQL editor (project > SQL Editor > New query)

-- ─── Posts ────────────────────────────────────────────────────────────────────
create table if not exists posts (
  id               uuid primary key default gen_random_uuid(),
  created_at       timestamptz default now(),

  -- Content (from n8n)
  date             date not null,
  day_name         text not null,
  pillar           text not null,
  post_type        text not null,
  visual_concept   text not null,
  caption          text not null,
  hashtags         text[] not null default '{}',
  best_time_to_post text,
  week_label       text,
  week_start_date  date,

  -- Lifecycle
  status           text not null default 'planned',  -- planned | posted | skipped
  posted_at        timestamptz,
  notes            text,

  -- Stats (entered manually after posting)
  likes            integer,
  saves            integer,
  reach            integer,
  comments         integer,
  follows_gained   integer,
  shares           integer
);

create index if not exists posts_date_idx on posts(date);
create index if not exists posts_status_idx on posts(status);
create index if not exists posts_pillar_idx on posts(pillar);

-- ─── Goals ────────────────────────────────────────────────────────────────────
create table if not exists goals (
  id             uuid primary key default gen_random_uuid(),
  created_at     timestamptz default now(),

  type           text not null,   -- follower_count | posts_per_week | engagement_rate | community | custom
  label          text not null,
  description    text,
  target_value   numeric,
  current_value  numeric default 0,
  unit           text,            -- 'followers', 'posts/week', '%', etc.
  deadline       date,
  is_active      boolean default true,
  sort_order     integer default 0
);

-- ─── Weekly Snapshots ─────────────────────────────────────────────────────────
-- Account-level stats entered manually each week (from Instagram Insights)
create table if not exists weekly_snapshots (
  id                uuid primary key default gen_random_uuid(),
  week_start_date   date not null unique,

  follower_count    integer,
  follower_change   integer,  -- net gain/loss that week
  total_reach       integer,
  total_impressions integer,
  total_likes       integer,
  total_saves       integer,
  total_comments    integer,
  total_shares      integer,
  posts_published   integer,
  profile_visits    integer,
  website_clicks    integer,
  notes             text,

  created_at        timestamptz default now()
);

create index if not exists snapshots_week_idx on weekly_snapshots(week_start_date);

-- ─── RLS (disable for personal use — enable if you add auth later) ────────────
alter table posts             disable row level security;
alter table goals             disable row level security;
alter table weekly_snapshots  disable row level security;
