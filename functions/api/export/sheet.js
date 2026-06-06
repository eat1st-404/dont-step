import { badRequest, escapeHtml, pngResponse, renderShell, screenshotHtml } from './_shared.js';

function formatScore(value) {
  const score = Math.round((Number(value) || 0) * 10) / 10;
  return Number.isInteger(score) ? String(score) : score.toFixed(1);
}

function renderSheetRows(rows) {
  return rows.map((row) => `
    <div class="sheet-cell">
      <div class="sheet-num">${escapeHtml(String(row.number))}</div>
      ${row.options.map((option) => `
        <div class="bubble ${escapeHtml(option.kind || '')}">[${escapeHtml(option.label)}]</div>
      `).join('')}
    </div>
  `).join('');
}

export async function onRequestPost(context) {
  let payload;
  try {
    payload = await context.request.json();
  } catch (_) {
    return badRequest('invalid_json');
  }

  if (!payload || !Array.isArray(payload.rows) || !payload.subject) {
    return badRequest('invalid_payload');
  }

  const html = renderShell(`踩卷答题卡-${payload.subject}`, `
    <section class="poster">
      <div class="sticker">answer sheet</div>
      <h1 class="title">${escapeHtml(payload.subject)}<span class="red">答题卡</span></h1>
      <p class="sub">普通高等学校招生全国统一考试 · 踩卷记录</p>
      <section class="panel">
        <div class="sheet-head">
          <div>普通高等学校招生全国统一考试 · ${escapeHtml(payload.subject)}答题卡</div>
          <div class="hud-pill">第${escapeHtml(String(payload.levelIndex || 1))}关</div>
        </div>
        <div class="grade">${escapeHtml(formatScore(payload.score))}</div>
        <div class="sheet-grid">
          ${renderSheetRows(payload.rows)}
        </div>
        <div class="sheet-note">${escapeHtml(payload.note || '剩余彩色填涂都会计分：单选题 5 分，多选题按剩余比例记分。')}</div>
      </section>
    </section>
  `);

  const buffer = await screenshotHtml(context.env, html);
  return pngResponse(buffer, `踩卷答题卡-${payload.subject}.png`);
}
