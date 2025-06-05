export async function onRequestGet(context) {
  const PROJECTS = [
    {
      name: "JSW 技术网",
      desc: "专注云原生/Serverless/前端等技术，极简工具与知识导航。",
      url: "https://jsw.ac.cn",
      tags: ["云原生", "Serverless"]
    },
    {
      name: "Hexo",
      desc: "快速、简洁且高效的博客框架",
      url: "https://hexo.io/",
      tags: ["博客", "静态"]
    },
    {
      name: "Cloudflare Pages",
      desc: "无服务器静态站点托管，支持自动部署。",
      url: "https://pages.cloudflare.com/",
      tags: ["Serverless", "CDN"]
    },
    // 可以继续扩展项目
  ];

  function htmlEscape(str) {
    return str.replace(/[&<>"']/g, t => ({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
    }[t]));
  }

  const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>OpenNav · 开源项目导航</title>
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
    <h1>OpenNav</h1>
    <div class="desc">优质开源项目导航 · 由 OpenJSW 开放技术支持</div>
    ${PROJECTS.map(p=>`
      <div class="card">
        <a href="${htmlEscape(p.url)}" target="_blank">${htmlEscape(p.name)}</a>
        <div style="color:#666;margin:7px 0 0 2px;font-size:1em;">${htmlEscape(p.desc)}</div>
        <div class="tags">${(p.tags||[]).map(t=>`<span class="tag">${htmlEscape(t)}</span>`).join('')}</div>
      </div>
    `).join('')}
    <div style="text-align:center;color:#bbb;margin:40px 0 6px 0;font-size:.98em;">&copy; ${new Date().getFullYear()} OpenNav · Powered by OpenJSW</div>
  </div>
</body>
</html>`;

  return new Response(html, {
    headers: { "content-type": "text/html; charset=UTF-8" }
  });
}
