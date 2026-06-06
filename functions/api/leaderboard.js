const JSON_HEADERS = {
  'content-type': 'application/json; charset=UTF-8',
  'cache-control': 'no-store'
};

const DEFAULT_LIMIT = 8;
const MAX_LIMIT = 20;
const SCHEMA_SQL = [
  'CREATE TABLE IF NOT EXISTS leaderboard_scores (id TEXT PRIMARY KEY, name TEXT NOT NULL, score REAL NOT NULL, created_at INTEGER NOT NULL)',
  'CREATE INDEX IF NOT EXISTS leaderboard_scores_rank_idx ON leaderboard_scores (score ASC, created_at DESC)'
];

function json(data, init = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      ...JSON_HEADERS,
      ...(init.headers || {})
    }
  });
}

function normalizeLimit(url) {
  const raw = Number(url.searchParams.get('limit') || DEFAULT_LIMIT);
  if (!Number.isFinite(raw) || raw <= 0) return DEFAULT_LIMIT;
  return Math.min(MAX_LIMIT, Math.floor(raw));
}

function normalizeName(value) {
  const trimmed = String(value || '').trim().slice(0, 16);
  return trimmed || '踩卷儿同学';
}

function normalizeScore(value) {
  const score = Math.round(Number(value) * 10) / 10;
  if (!Number.isFinite(score) || score < 0 || score > 300) {
    return null;
  }
  return score;
}

function normalizeId(value) {
  const id = String(value || '').trim();
  if (!id || id.length > 80) return null;
  return id;
}

async function ensureSchema(env) {
  if (!env.DB) {
    throw new Error('db_missing');
  }
  for (const sql of SCHEMA_SQL) {
    await env.DB.prepare(sql).run();
  }
}

async function loadRows(env, limit) {
  await ensureSchema(env);
  const { results = [] } = await env.DB.prepare(
    'SELECT id, name, score, created_at FROM leaderboard_scores ORDER BY score ASC, created_at DESC LIMIT ?1'
  ).bind(limit).all();

  return results.map((row) => ({
    id: row.id,
    name: normalizeName(row.name),
    score: Math.round(Number(row.score) * 10) / 10,
    time: Number(row.created_at) || 0
  }));
}

export async function onRequestGet(context) {
  const limit = normalizeLimit(new URL(context.request.url));
  const rows = await loadRows(context.env, limit);
  return json({ rows });
}

export async function onRequestPost(context) {
  let payload;
  try {
    payload = await context.request.json();
  } catch (_) {
    return json({ error: 'invalid_json' }, { status: 400 });
  }

  const id = normalizeId(payload.id);
  const score = normalizeScore(payload.score);
  const name = normalizeName(payload.name);

  if (!id || score === null) {
    return json({ error: 'invalid_score' }, { status: 400 });
  }

  try {
    await ensureSchema(context.env);
  } catch (_) {
    return json({ error: 'db_missing' }, { status: 500 });
  }

  await context.env.DB.prepare(
    'INSERT OR IGNORE INTO leaderboard_scores (id, name, score, created_at) VALUES (?1, ?2, ?3, ?4)'
  ).bind(id, name, score, Date.now()).run();

  const rows = await loadRows(context.env, normalizeLimit(new URL(context.request.url)));
  return json({ rows, saved: true });
}
