CREATE TABLE IF NOT EXISTS leaderboard_scores (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  score REAL NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS leaderboard_scores_rank_idx
ON leaderboard_scores (score ASC, created_at DESC);
