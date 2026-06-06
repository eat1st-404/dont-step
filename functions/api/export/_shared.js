const PAGE_WIDTH = 900;
const PAGE_HEIGHT = 1200;

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;');
}

function renderShell(title, body) {
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <style>
    :root {
      --bg: #fffdf6;
      --paper: #f7f7f7;
      --black: #111;
      --red: #ff3b19;
      --yellow: #ffe45c;
      --blue: #2e83ff;
      --green: #2cc75f;
      --muted: #5c5c5c;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      background:
        radial-gradient(circle at top left, rgba(46,131,255,.16), transparent 28%),
        radial-gradient(circle at top right, rgba(255,228,92,.26), transparent 24%),
        var(--bg);
      font-family: "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", sans-serif;
      color: var(--black);
    }
    .frame {
      width: ${PAGE_WIDTH}px;
      padding: 36px;
    }
    .poster {
      position: relative;
      overflow: hidden;
      background: var(--bg);
      border: 5px solid var(--black);
      box-shadow: 10px 10px 0 var(--black);
      padding: 30px;
    }
    .sticker {
      display: inline-block;
      margin-bottom: 16px;
      padding: 8px 12px;
      background: var(--blue);
      color: #fff;
      border: 3px solid var(--black);
      font-size: 26px;
      font-weight: 900;
      letter-spacing: .04em;
      text-transform: uppercase;
      transform: rotate(-4deg);
    }
    .title {
      margin: 0 0 10px;
      font-size: 54px;
      line-height: 1;
      font-weight: 900;
    }
    .title .red { color: var(--red); }
    .sub {
      margin: 0 0 22px;
      font-size: 24px;
      font-weight: 700;
    }
    .panel {
      border: 4px solid var(--black);
      background: var(--paper);
      padding: 18px;
      box-shadow: inset 0 0 0 3px #d7d7d7;
    }
    .panel + .panel { margin-top: 18px; }
    .panel-title {
      margin: 0 0 14px;
      font-size: 24px;
      font-weight: 900;
    }
    .row-grid {
      display: grid;
      grid-template-columns: 1.3fr 1fr 1fr;
      border-top: 3px solid var(--black);
      border-left: 3px solid var(--black);
      background: #fff;
    }
    .cell {
      min-height: 58px;
      padding: 12px 14px;
      border-right: 3px solid var(--black);
      border-bottom: 3px solid var(--black);
      font-size: 22px;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
    }
    .cell.head {
      font-weight: 900;
      background: var(--yellow);
    }
    .total {
      margin-top: 18px;
      display: inline-flex;
      align-items: center;
      gap: 12px;
      padding: 10px 18px;
      border: 4px solid var(--black);
      background: #fff;
      font-size: 34px;
      font-weight: 900;
      color: var(--red);
      box-shadow: 6px 6px 0 var(--black);
    }
    .note {
      margin-top: 16px;
      font-size: 20px;
      line-height: 1.5;
      color: var(--muted);
    }
    .leaderboard {
      margin-top: 18px;
      border: 4px solid var(--black);
      background: #fff;
      padding: 16px;
    }
    .leader-title {
      font-size: 24px;
      font-weight: 900;
      margin-bottom: 12px;
    }
    .leader-row {
      display: grid;
      grid-template-columns: 72px 1fr 120px;
      gap: 12px;
      align-items: center;
      padding: 10px 12px;
      border: 3px solid var(--black);
      background: #fffdf6;
      font-size: 21px;
      font-weight: 800;
    }
    .leader-row + .leader-row { margin-top: 10px; }
    .leader-row.me { background: var(--yellow); }
    .sheet-head {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      align-items: flex-start;
      margin-bottom: 14px;
      font-size: 21px;
      font-weight: 800;
    }
    .hud-pill {
      border: 3px solid var(--black);
      background: var(--yellow);
      padding: 7px 12px;
      font-size: 19px;
      font-weight: 900;
    }
    .card-title {
      margin: 4px 0 12px;
      font-size: 20px;
      font-weight: 900;
      letter-spacing: .08em;
    }
    .export-sheet-wrap {
      padding: 6px;
      background: #fff;
      border: 4px solid var(--black);
      box-shadow: inset 0 0 0 3px #ececec;
    }
    .export-sheet-head {
      margin-bottom: 8px;
      align-items: center;
    }
    .sheet-title {
      font-size: 26px;
      line-height: 1.3;
      font-weight: 900;
    }
    .exam-hud {
      display: flex;
      gap: 8px;
      align-items: center;
    }
    .export-sheet {
      position: relative;
      overflow: hidden;
      border: 3px solid var(--black);
      background: #fff;
      padding-bottom: 18px;
    }
    .student-fields {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin: 14px 14px 10px;
    }
    .student-field {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 17px;
      font-weight: 800;
    }
    .student-field i {
      flex: 1;
      min-width: 0;
      height: 0;
      border-bottom: 3px solid var(--black);
    }
    .sheet-meta {
      margin: 0 14px 10px;
      font-size: 15px;
      line-height: 1.45;
      font-weight: 700;
    }
    .grade-stamp {
      position: absolute;
      top: 18px;
      right: 12px;
      min-width: 112px;
      height: 84px;
      display: grid;
      place-items: center;
      border: 4px solid var(--red);
      color: var(--red);
      background: rgba(255,255,255,.9);
      font-size: 52px;
      font-weight: 900;
      transform: rotate(-9deg);
      z-index: 3;
    }
    .grade-stamp::before {
      content: '';
      position: absolute;
      left: 16px;
      right: 10px;
      bottom: 14px;
      height: 6px;
      border-top: 4px solid var(--red);
      border-bottom: 3px solid var(--red);
      opacity: .88;
    }
    .export-answer-grid {
      position: relative;
      display: grid;
      grid-template-columns: 1fr 1fr;
      margin: 0 14px;
      border: 3px solid var(--black);
      background: #fff;
    }
    .answer-bar {
      grid-column: 1 / -1;
      position: relative;
      min-height: 58px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 10px 12px;
      border-bottom: 3px solid var(--black);
      font-size: 26px;
      font-weight: 900;
    }
    .answer-bar-label {
      transform: translateX(56px);
    }
    .answer-bar .time {
      position: absolute;
      left: 10px;
      top: 8px;
      min-width: 96px;
      text-align: center;
      background: var(--yellow);
    }
    .range-head {
      min-height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-bottom: 3px solid var(--black);
      background: #f2f2f2;
      font-size: 20px;
      font-weight: 900;
    }
    .range-head + .range-head {
      border-left: 3px solid var(--black);
    }
    .row {
      min-height: 34px;
      display: grid;
      grid-template-columns: 28px repeat(4, minmax(0, 1fr));
      align-items: stretch;
      border-bottom: 2px solid var(--black);
      padding: 3px 3px;
      background: #fff;
    }
    .row.left {
      border-right: 3px solid var(--black);
    }
    .row-num {
      display: grid;
      place-items: center;
      font-size: 19px;
      font-weight: 900;
    }
    .bubble {
      position: relative;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-weight: 800;
      border: 1px solid rgba(17,17,17,.08);
      background: #fff;
    }
    .bubble span {
      position: relative;
      z-index: 2;
    }
    .bubble.filled::after {
      content: '';
      position: absolute;
      left: 5px;
      right: 5px;
      top: 7px;
      bottom: 6px;
      border-radius: 2px;
      z-index: 1;
    }
    .bubble.correct.filled::after {
      background: #13c744;
    }
    .bubble.converted {
      border-color: rgba(20,180,60,.75);
      background: radial-gradient(circle, rgba(255,59,25,.14) 0 48%, transparent 49%), #fff;
    }
    .bubble.converted.filled::after {
      background: #ff3b19;
    }
    .footprint {
      position: absolute;
      width: 148px;
      height: 292px;
      transform-origin: 50% 90%;
      pointer-events: none;
      opacity: .96;
      filter: drop-shadow(4px 5px 0 rgba(0,0,0,.16));
    }
    .export-footprint {
      right: 56px;
      bottom: 24px;
      transform: rotate(18deg) scale(.9);
      z-index: 2;
    }
    .footprint-print {
      position: absolute;
      inset: 0;
    }
    .footprint-print .toe,
    .footprint-print .sole,
    .footprint-print .heel {
      position: absolute;
      display: block;
      background: rgba(255,59,25,.9);
      border: 3px solid var(--black);
    }
    .footprint-print .toe {
      border-radius: 999px;
    }
    .toe-1 { width: 30px; height: 34px; left: 56px; top: 18px; }
    .toe-2 { width: 26px; height: 28px; left: 90px; top: 34px; }
    .toe-3 { width: 22px; height: 24px; left: 106px; top: 62px; }
    .toe-4 { width: 20px; height: 22px; left: 110px; top: 92px; }
    .toe-5 { width: 22px; height: 24px; left: 100px; top: 122px; }
    .footprint-print .sole {
      left: 34px;
      top: 48px;
      width: 82px;
      height: 156px;
      border-radius: 48% 52% 46% 54% / 30% 30% 70% 70%;
      transform: rotate(-7deg);
    }
    .footprint-print .heel {
      left: 24px;
      top: 182px;
      width: 72px;
      height: 84px;
      border-radius: 46% 54% 50% 50% / 52% 52% 48% 48%;
      transform: rotate(-10deg);
    }
    .sheet-note {
      margin-top: 16px;
      font-size: 20px;
      line-height: 1.5;
    }
    .export-sheet-note {
      font-size: 18px;
      font-weight: 700;
    }
  </style>
</head>
<body>
  <div class="frame">${body}</div>
</body>
</html>`;
}

async function screenshotHtml(env, html) {
  if (!env.BROWSER) {
    throw new Error('browser_binding_missing');
  }

  const response = await env.BROWSER.quickAction('screenshot', {
    html,
    viewport: {
      width: PAGE_WIDTH,
      height: PAGE_HEIGHT
    },
    gotoOptions: {
      waitUntil: 'networkidle0'
    },
    screenshotOptions: {
      type: 'png'
    }
  });

  if (!response.ok) {
    throw new Error(`browser_render_${response.status}`);
  }

  return await response.arrayBuffer();
}

function pngResponse(buffer, filename) {
  return new Response(buffer, {
    headers: {
      'content-type': 'image/png',
      'content-disposition': `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`,
      'cache-control': 'no-store'
    }
  });
}

function badRequest(code) {
  return new Response(JSON.stringify({ error: code }), {
    status: 400,
    headers: {
      'content-type': 'application/json; charset=UTF-8'
    }
  });
}

export {
  badRequest,
  escapeHtml,
  pngResponse,
  renderShell,
  screenshotHtml
};
