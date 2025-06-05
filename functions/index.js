// index.js
const PROJECTS = [
  {
    name: "OpenGraphPic |开放图像",
    desc: "由 Telegraph 和 Cloudflare Pages 提供支持的轻量级、无服务器图像托管工具。",
    url: "https://picbed.openjsw.net",
    tags: ["图床"]
  },
  {
    name: "openposta |开放邮局",
    desc: "OpenPosta-Page 是 OpenPosta 轻量级网络邮件系统的前端演示，由 Cloudflare Workers 和 Resend 提供支持。",
    url: "https://email.openjsw.net",
    tags: ["电子邮箱"]
  },
  // 你可以继续添加更多项目
];

function htmlEscape(str) {
  return str.replace(/[&<>"']/g, t => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[t]));
}

function renderPage(projects) {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>开源项目导航</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: system-ui,sans-serif; background: #f8f9fb; margin: 0; }
    .container { max-width: 660px; margin: 0 auto; padding: 24px 12px; }
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
    @media (max-width:600px){
      .container{padding:10px;}
      .card{padding:13px 13px;}
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>开源项目导航</h1>
    <div class="desc">优质项目推荐，开源工具集，持续更新中。</div>
    ${projects.map(p=>`
      <div class="card">
        <a href="${htmlEscape(p.url)}" target="_blank">${htmlEscape(p.name)}</a>
        <div style="color:#666;margin:7px 0 0 2px;font-size:1em;">${htmlEscape(p.desc)}</div>
        <div class="tags">${(p.tags||[]).map(t=>`<span class="tag">${htmlEscape(t)}</span>`).join('')}</div>
      </div>
    `).join('')}
    <div style="text-align:center;color:#bbb;margin:40px 0 6px 0;font-size:.98em;">&copy; ${new Date().getFullYear()} 开源项目导航</div>
  </div>
</body>
</html>`;
}

export default {
  async fetch(request, env, ctx) {
    return new Response(
      renderPage(PROJECTS),
      { headers: { "content-type": "text/html; charset=UTF-8" } }
    );
  }
};
