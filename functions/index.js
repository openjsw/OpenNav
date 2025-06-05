export async function onRequestGet({ env, request }) {
  const url = new URL(request.url);
  const lang = url.searchParams.get('lang') === 'en' ? 'en' : 'zh';

  const langText = {
    zh: {
      title: '开源项目导航',
      powered: '由 OpenJSW 开放技术支持',
      switch: 'ENGLISH',
      d1Error: '未绑定 D1 数据库，请在 Cloudflare 控制台绑定 D1 并重试。',
    },
    en: {
      title: 'Open Source Project Navigator',
      powered: 'Powered by OpenJSW',
      switch: '简体中文',
      d1Error: 'D1 Database not bound. Please bind D1 database in Cloudflare dashboard and try again.',
    }
  };

  function errorHtml(msg) {
    return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8"><title>${langText[lang].title}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: system-ui,sans-serif; background: #f8f9fb; margin: 0; min-height: 100vh; display: flex; flex-direction: column; }
    .errorbox { max-width:560px;margin:0 auto;padding:32px 28px;background:#fff;border-radius:18px;box-shadow:0 2px 12px #0001;margin-top:10vh;}
    footer { width:100%;text-align:center;color:#aaa;margin-top:auto;padding:18px 0 12px 0;font-size:.98em;letter-spacing:0.04em;}
  </style>
</head>
<body>
  <div class="errorbox">
    <h1>${langText[lang].title}</h1>
    <p style="color:#f33;">${msg}</p>
    <p style="color:#888;">${langText[lang].powered}</p>
  </div>
  <footer>
    &copy; ${new Date().getFullYear()} OpenNav · OpenJSW
  </footer>
</body></html>`;
  }

  try {
    // D1 查询全部项目
    const { results } = await env.DB.prepare(
      "SELECT * FROM projects ORDER BY id DESC"
    ).all();

    function htmlEscape(str) {
      return (str||"").replace(/[&<>"']/g, t => ({
        '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
      }[t]));
    }

    const switchLang = lang === 'zh' ? 'en' : 'zh';
    const switchHref = url.pathname + '?lang=' + switchLang;

    const html = `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <title>${langText[lang].title}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: system-ui,sans-serif; background: #f8f9fb; margin: 0; min-height: 100vh; display: flex; flex-direction: column;}
    .container { max-width: 660px; margin: 0 auto; padding: 24px 12px; flex:1; }
    .header { display:flex;align-items:center;justify-content:space-between;}
    h1 { font-size: 2.2em; margin-bottom: 10px; }
    .desc { color: #888; margin-bottom: 30px; }
    .card {
      background: #fff; margin-bottom: 20px; border-radius: 16px;
      box-shadow: 0 2px 12px #0001; padding: 22px 24px; transition:.2s;
      border: 1px solid #f0f0f0;
      display: flex; flex-direction: column;
    }
    .card:hover { box-shadow: 0 4px 24px #0002; border-color: #d3e6ff; }
    .card a { font-weight: bold; color: #2563eb; font-size:1.25em; text-decoration:none;}
    .card a:hover { text-decoration: underline;}
    .tags { margin-top: 8px; }
    .tag {
      display: inline-block; background: #eef6ff;
      color: #2575ed; border-radius: 8px; font-size: .9em;
      padding: 2px 10px; margin-right: 7px;
    }
    .lang-switch {margin-left:8px;}
    @media (max-width:600px){
      .container{padding:10px;}
      .card{padding:13px 13px;}
    }
    footer { width:100%;text-align:center;color:#aaa;margin-top:auto;padding:18px 0 12px 0;font-size:.98em;letter-spacing:0.04em;}
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${langText[lang].title}</h1>
      <a class="lang-switch" href="${switchHref}">${langText[lang].switch}</a>
    </div>
    <div class="desc">${langText[lang].powered}</div>
    ${results.map(p=>`
      <div class="card">
        <a href="${htmlEscape(lang==='en'?p.name_en:p.name_zh)}" target="_blank">${htmlEscape(lang==='en'?p.name_en:p.name_zh)}</a>
        <div style="color:#666;margin:7px 0 0 2px;font-size:1em;">${htmlEscape(lang==='en'?p.desc_en:p.desc_zh)}</div>
        <div class="tags">${(p.tags||"").split(',').filter(x=>x.trim()).map(t=>`<span class="tag">${htmlEscape(t)}</span>`).join('')}</div>
      </div>
    `).join('')}
  </div>
  <footer>
    &copy; ${new Date().getFullYear()} OpenNav · OpenJSW
  </footer>
</body>
</html>`;

    return new Response(html, { headers: { "content-type": "text/html; charset=UTF-8" } });

  } catch (e) {
    // 友好提示
    return new Response(errorHtml(langText[lang].d1Error), {
      status: 500,
      headers: { "content-type": "text/html; charset=UTF-8" }
    });
  }
}
