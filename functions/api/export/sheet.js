import { badRequest, escapeHtml, pngResponse, renderShell, screenshotHtml } from './_shared.js';

function formatScore(value) {
  const score = Math.round((Number(value) || 0) * 10) / 10;
  return Number.isInteger(score) ? String(score) : score.toFixed(1);
}

function renderOption(option) {
  const kind = option.kind === 'converted' ? 'converted' : option.kind === 'correct' ? 'correct' : 'blank';
  const filledClass = kind === 'blank' ? '' : ' filled';
  return `<div class="bubble ${escapeHtml(kind)}${filledClass}"><span>[${escapeHtml(option.label)}]</span></div>`;
}

function renderQuestionRow(row, side) {
  return `
    <div class="row ${escapeHtml(side)}">
      <div class="row-num">${escapeHtml(String(row.number))}</div>
      ${row.options.map(renderOption).join('')}
    </div>
  `;
}

function renderSheetRows(rows) {
  const splitAt = Math.ceil(rows.length / 2);
  const leftRows = rows.slice(0, splitAt);
  const rightRows = rows.slice(splitAt);
  const pairs = [];

  for (let index = 0; index < leftRows.length; index += 1) {
    pairs.push(renderQuestionRow(leftRows[index], 'left'));
    if (rightRows[index]) {
      pairs.push(renderQuestionRow(rightRows[index], 'right'));
    }
  }

  return `
    <div class="answer-bar">
      <div class="hud-pill time">已交卷</div>
      <span class="answer-bar-label">答案填涂栏</span>
    </div>
    <div class="range-head">1-${splitAt} 题</div>
    <div class="range-head">${splitAt + 1}-${rows.length} 题</div>
    ${pairs.join('')}
  `;
}

function renderFootprint() {
  return `
    <div class="footprint final export-footprint">
      <div class="footprint-print">
        <span class="toe toe-1"></span>
        <span class="toe toe-2"></span>
        <span class="toe toe-3"></span>
        <span class="toe toe-4"></span>
        <span class="toe toe-5"></span>
        <span class="sole"></span>
        <span class="heel"></span>
      </div>
    </div>
  `;
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
    <section class="poster export-sheet-poster">
      <div class="sticker">answer sheet</div>
      <div class="card-title">答题卡 / PRESS HOLD DRAG RELEASE</div>
      <div class="sheet-wrap export-sheet-wrap">
        <div class="sheet-head export-sheet-head">
          <div class="sheet-title">普通高等学校招生全国统一考试 · ${escapeHtml(payload.subject)}答题卡</div>
          <div class="exam-hud">
            <div class="hud-pill">第${escapeHtml(String(payload.levelIndex || 1))}关</div>
          </div>
        </div>
        <div class="sheet export-sheet">
          <div class="student-fields">
            <div class="student-field"><span>姓名</span><i></i></div>
            <div class="student-field"><span>准考证号</span><i></i></div>
          </div>
          <div class="sheet-meta">考查规则：<br>1. 踩掉正确填涂可降低分数，请避开错填雷区。<br>2. 单选、多选均按最终答题卡残留结果计分。</div>
          <div class="grade-stamp export-grade-stamp">${escapeHtml(formatScore(payload.score))}</div>
          <div class="answer-grid export-answer-grid">
            ${renderSheetRows(payload.rows)}
          </div>
          ${renderFootprint()}
        </div>
      </div>
      <div class="sheet-note export-sheet-note">${escapeHtml(payload.note || '剩余彩色填涂都会计分：单选题 5 分，多选题按剩余比例记分。')}</div>
    </section>
  `);

  const buffer = await screenshotHtml(context.env, html);
  return pngResponse(buffer, `踩卷答题卡-${payload.subject}.png`);
}
