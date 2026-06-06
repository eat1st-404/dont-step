import { badRequest, escapeHtml, pngResponse, renderShell, screenshotHtml } from './_shared.js';

function formatScore(value) {
  const score = Math.round((Number(value) || 0) * 10) / 10;
  return Number.isInteger(score) ? String(score) : score.toFixed(1);
}

function renderRows(rows) {
  return rows.map((row) => `
    <div class="cell">${escapeHtml(row.subject)}</div>
    <div class="cell">${escapeHtml(formatScore(row.score))}</div>
    <div class="cell">${escapeHtml(row.detail)}</div>
  `).join('');
}

function renderLeaderboard(rows, reportId) {
  return rows.map((row, index) => `
    <div class="leader-row${row.id === reportId ? ' me' : ''}">
      <span>${index + 1}</span>
      <span>${escapeHtml(row.name)}</span>
      <span>${escapeHtml(formatScore(row.score))}</span>
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

  if (!Array.isArray(payload.results) || !Array.isArray(payload.leaderboard)) {
    return badRequest('invalid_payload');
  }

  const title = '踩卷成绩单';
  const html = renderShell(title, `
    <section class="poster">
      <div class="sticker">gaokao vibe game</div>
      <h1 class="title">别踩<span class="red">试卷</span>儿</h1>
      <p class="sub">普通高等学校招生全国统一考试成绩单</p>
      <section class="panel">
        <div class="panel-title">考生姓名：踩卷儿同学　准考证号：000000</div>
        <div class="row-grid">
          <div class="cell head">科目</div>
          <div class="cell head">踩卷得分</div>
          <div class="cell head">剩余绿/红</div>
          ${renderRows(payload.results)}
        </div>
        <div class="total">总分 ${escapeHtml(formatScore(payload.total))}</div>
        <div class="note">${escapeHtml(payload.note || '')}</div>
      </section>
      <section class="leaderboard">
        <div class="leader-title">实时低分排行榜</div>
        ${renderLeaderboard(payload.leaderboard.slice(0, 8), payload.reportId)}
      </section>
    </section>
  `);

  const buffer = await screenshotHtml(context.env, html);
  return pngResponse(buffer, '踩卷成绩单.png');
}
