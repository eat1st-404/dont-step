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
    .grade {
      display: inline-flex;
      margin: 14px 0 18px;
      padding: 10px 18px;
      border: 4px solid var(--red);
      color: var(--red);
      font-size: 38px;
      font-weight: 900;
      transform: rotate(-8deg);
    }
    .sheet-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px 14px;
      border-top: 3px solid var(--black);
      border-left: 3px solid var(--black);
      background: #fff;
    }
    .sheet-cell {
      border-right: 3px solid var(--black);
      border-bottom: 3px solid var(--black);
      min-height: 58px;
      display: grid;
      grid-template-columns: 52px repeat(4, 1fr);
      align-items: center;
      text-align: center;
      font-size: 20px;
      font-weight: 800;
    }
    .sheet-num {
      background: var(--yellow);
      min-height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      border-right: 3px solid var(--black);
    }
    .bubble {
      position: relative;
      min-height: 55px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .bubble.correct::after,
    .bubble.wrong::after,
    .bubble.converted::after {
      content: '';
      position: absolute;
      inset: 10px 12px;
      border: 3px solid var(--black);
      border-radius: 999px;
    }
    .bubble.correct::after { background: var(--green); }
    .bubble.wrong::after,
    .bubble.converted::after { background: var(--red); }
    .sheet-note {
      margin-top: 16px;
      font-size: 20px;
      line-height: 1.5;
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
