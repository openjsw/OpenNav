export async function onRequestGet({ env, request }) {
  const url = new URL(request.url);
  const lang = url.searchParams.get('lang') === 'en' ? 'en' : 'zh';

  // D1 查询全部项目
  const { results } = await env.DB.prepare(
    "SELECT * FROM projects ORDER BY id DESC"
  ).all();

  const langText = {
    zh: {
      title: '开源项目导航',
      powered: '由 OpenJSW 开放技术支持',
      switch: 'ENGLISH',
    },
    en: {
      title: 'Open Source Project Navigator',
      powered: 'Powered by OpenJSW',
      switch: '简体中文',
    }
  };

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
    body { font-family: system-ui,sans-serif; background: #f8f9fb; margin: 0; }
    .container { max-width: 660px; margin: 0 auto; padding: 24px 12px; }
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
        <a href="${htmlEscape(p.url)}" target="_blank">${htmlEscape(lang==='en'?p.name_en:p.name_zh)}</a>
        <div style="color:#666;margin:7px 0 0 2px;font-size:1em;">${htmlEscape(lang==='en'?p.desc_en:p.desc_zh)}</div>
        <div class="tags">${(p.tags||"").split(',').filter(x=>x.trim()).map(t=>`<span class="tag">${htmlEscape(t)}</span>`).join('')}</div>
      </div>
    `).join('')}
    <div style="text-align:center;color:#bbb;margin:40px 0 6px 0;font-size:.98em;">&copy; ${new Date().getFullYear()} OpenNav · OpenJSW</div>
  </div>
</body>
</html>`;

  return new Response(html, { headers: { "content-type": "text/html; charset=UTF-8" } });
}
