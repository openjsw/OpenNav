const COOKIE_NAME = "opennav_auth";

const langPack = {
  zh: {
    adminTitle: "OpenNav 管理后台",
    adminDesc: "请登录后管理项目列表",
    passwordPlaceholder: "请输入密码",
    loginBtn: "登录",
    logout: "退出",
    tableHeader: ["ID", "中文名", "EN Name", "URL", "操作"],
    addEdit: "新增/编辑项目",
    field: {
      id: "留空为新增",
      name_zh: "中文名",
      name_en: "English Name",
      desc_zh: "中文描述",
      desc_en: "English Desc",
      url: "网址",
      tags: "标签,用逗号分隔"
    },
    save: "保存",
    del: "删除",
    edit: "编辑",
    confirmDel: "确认删除？",
    loadFail: "加载失败，请重试！",
    loginError: "密码错误",
  },
  en: {
    adminTitle: "OpenNav Admin",
    adminDesc: "Please login to manage projects",
    passwordPlaceholder: "Enter password",
    loginBtn: "Login",
    logout: "Logout",
    tableHeader: ["ID", "ZH Name", "EN Name", "URL", "Actions"],
    addEdit: "Add/Edit Project",
    field: {
      id: "Blank for new",
      name_zh: "ZH Name",
      name_en: "English Name",
      desc_zh: "ZH Desc",
      desc_en: "English Desc",
      url: "URL",
      tags: "Tags, comma separated"
    },
    save: "Save",
    del: "Delete",
    edit: "Edit",
    confirmDel: "Confirm delete?",
    loadFail: "Load failed, try again!",
    loginError: "Wrong password",
  }
};

export async function onRequestGet({ request }) {
  const url = new URL(request.url);
  const lang = url.searchParams.get('lang') === 'en' ? 'en' : 'zh';
  const t = langPack[lang];

  const isAuthed = request.headers.get('cookie')?.includes(`${COOKIE_NAME}=1`);

  // 登录页
  if (!isAuthed) {
    return new Response(`<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <title>${t.adminTitle}</title>
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <style>
    body{background:#f7f8fa;margin:0;min-height:100vh;display:flex;flex-direction:column;}
    .topbar{height:60px;}
    .loginbox{background:#fff;max-width:340px;margin:16vh auto 0 auto;padding:38px 26px 30px 26px;border-radius:15px;box-shadow:0 4px 24px #0022.09;}
    h2{margin:0 0 18px 0;font-size:1.7em;}
    form{margin:0;}
    input[type=password]{width:100%;padding:12px 13px;font-size:1em;border:1px solid #e0e2ee;border-radius:8px;margin-bottom:20px;box-sizing:border-box;}
    button{width:100%;padding:12px;font-size:1.13em;background:#2563eb;color:#fff;border:none;border-radius:8px;cursor:pointer;}
    button:hover{background:#1e48c9;}
    .desc{color:#888;margin-top:16px;font-size:.98em;}
    .lang{position:absolute;right:32px;top:26px;font-size:.99em;color:#2563eb;text-decoration:none;}
    .lang:hover{text-decoration:underline;}
    .err{color:#f33;margin-bottom:8px;}
    @media (max-width:420px){.loginbox{margin-top:6vh;padding:22px 8px 16px 8px;}}
  </style>
</head>
<body>
  <div class="topbar"><a class="lang" href="?lang=${lang === "zh" ? "en" : "zh"}">${lang === "zh" ? "ENGLISH" : "简体中文"}</a></div>
  <div class="loginbox">
    <h2>${t.adminTitle}</h2>
    <form method="post">
      <input name="password" type="password" placeholder="${t.passwordPlaceholder}" required autocomplete="current-password">
      <button type="submit">${t.loginBtn}</button>
    </form>
    <div class="desc">${t.adminDesc}</div>
  </div>
</body>
</html>`, { headers: { "content-type": "text/html" } });
  }

  // 管理主页面
  return new Response(`<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <title>${t.adminTitle}</title>
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <style>
    body{font-family:system-ui,sans-serif;background:#f7f8fa;margin:0;min-height:100vh;display:flex;flex-direction:column;}
    .admin-topbar{
      width:100%;
      max-width:980px;
      margin:0 auto;
      padding:28px 22px 0 22px;
      display:flex;
      justify-content:space-between;
      align-items:center;
    }
    .admin-title {
      font-size:1.5em;font-weight:700;letter-spacing:.03em;
    }
    .admin-actions {
      font-size:1em;color:#2563eb;display:flex;align-items:center;gap:18px;
    }
    .admin-actions a {color:#2563eb;text-decoration:none;font-weight:500;}
    .admin-actions a:hover {color:#1348b6;text-decoration:underline;}
    .admin-maincard{
      background:#fff;
      border-radius:17px;
      box-shadow:0 4px 24px #0022.08;
      max-width:900px;
      width:96vw;
      margin:36px auto 0 auto;
      padding:34px 28px 28px 28px;
      display:flex;
      flex-direction:column;
      align-items:stretch;
    }
    form#addForm {
      display:flex; flex-wrap:wrap; gap:12px 12px;margin-bottom:28px;
    }
    form#addForm input {
      padding:10px 13px;
      border:1px solid #e2e6ef;
      border-radius:8px;
      font-size:1em;
      background:#f6f8fd;
      min-width:115px;
      flex:1 1 170px;
      margin-bottom:8px;
      transition:border-color .15s;
    }
    form#addForm input:focus {
      border-color:#2563eb;
      outline:none;
      background:#f0f6ff;
    }
    form#addForm input[type="submit"] {
      background:#2563eb;color:#fff;border:none;cursor:pointer;transition:.16s;min-width:86px;font-weight:600;margin-bottom:8px;
    }
    form#addForm input[type="submit"]:hover{background:#1748bb;}
    table{
      width:100%;
      border-collapse:separate;
      border-spacing:0 7px;
      margin-top:14px;
    }
    th,td{
      background:#fff;
      padding:11px 8px;
      border:none;
      border-radius:7px;
      text-align:left;
      font-size:1em;
    }
    th{background:#f3f6fa;}
    .actions button{
      margin-right:7px;padding:6px 17px;
      border:none;border-radius:7px;
      background:#f6f7fb;color:#1e48bb;cursor:pointer;transition:.16s;font-weight:500;
    }
    .actions button:hover{background:#dbeafe;color:#1348b6;}
    .actions button:active{background:#a7c7fd;}
    footer{
      width:100%;text-align:center;color:#bbb;
      margin-top:auto;padding:17px 0 10px 0;font-size:.99em;
      letter-spacing:0.04em;
    }
    @media (max-width:900px){
      .admin-maincard{padding:13px 2vw;}
      .admin-topbar{padding:14px 7px 0 7px;}
    }
    @media (max-width:700px){
      form#addForm input{min-width:88px;}
      .admin-maincard{padding:9px 3vw;}
    }
  </style>
</head>
<body>
  <div class="admin-topbar">
    <span class="admin-title">${t.adminTitle}</span>
    <span class="admin-actions">
      <a href="?lang=${lang === "zh" ? "en" : "zh"}">${lang === "zh" ? "ENGLISH" : "简体中文"}</a>
      <a href="/api/logout">${t.logout}</a>
    </span>
  </div>
  <div class="admin-maincard">
    <form id="addForm">
      <input name="id" placeholder="${t.field.id}">
      <input name="name_zh" placeholder="${t.field.name_zh}" required>
      <input name="name_en" placeholder="${t.field.name_en}" required>
      <input name="desc_zh" placeholder="${t.field.desc_zh}">
      <input name="desc_en" placeholder="${t.field.desc_en}">
      <input name="url" placeholder="${t.field.url}" required>
      <input name="tags" placeholder="${t.field.tags}">
      <input type="submit" value="${t.save}">
    </form>
    <table id="projectTable">
      <thead>
        <tr>
          <th>${t.tableHeader[0]}</th>
          <th>${t.tableHeader[1]}</th>
          <th>${t.tableHeader[2]}</th>
          <th>${t.tableHeader[3]}</th>
          <th>${t.tableHeader[4]}</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
  </div>
  <footer>
    &copy; ${new Date().getFullYear()} OpenNav · OpenJSW
  </footer>
  <script>
    const t = ${JSON.stringify(t)};
    async function loadProjects(){
      let res = await fetch('/api/list'); 
      if(!res.ok) return alert(t.loadFail);
      let data = await res.json();
      let tbody = document.querySelector("#projectTable tbody");
      tbody.innerHTML = "";
      for(let p of data){
        let tr = document.createElement("tr");
        tr.innerHTML = "<td>"+p.id+"</td><td>"+p.name_zh+"</td><td>"+p.name_en+"</td><td>"+p.url+"</td>"
          +'<td class="actions"><button onclick="del('+p.id+')">'+t.del+'</button>'
          +'<button onclick="edit('+JSON.stringify(p).replace(/"/g,'&quot;')+')">'+t.edit+'</button></td>';
        tbody.appendChild(tr);
      }
    }
    loadProjects();
    window.del = async function(id){
      if(!confirm(t.confirmDel))return;
      await fetch('/api/del', {method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({id})});
      loadProjects();
    };
    window.edit = function(p){
      for(let k in p){
        if(document.querySelector(\`[name="\${k}"]\`))document.querySelector(\`[name="\${k}"]\`).value = p[k];
      }
    };
    document.getElementById("addForm").onsubmit = async function(e){
      e.preventDefault();
      let f = e.target;
      let data = {};
      for(let x of f.elements)if(x.name)data[x.name]=x.value;
      await fetch('/api/save', {method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(data)});
      f.reset();
      loadProjects();
    }
  </script>
</body>
</html>`, { headers: { "content-type": "text/html" } });
}

// 登录 POST
export async function onRequestPost({ request, env }) {
  const url = new URL(request.url);
  const lang = url.searchParams.get('lang') === 'en' ? 'en' : 'zh';
  const t = langPack[lang];

  const form = await request.formData();
  const pwd = form.get('password');
  if (pwd === env.ADMIN_PASSWORD) {
    return new Response('', {
      status: 302,
      headers: {
        "Set-Cookie": `${COOKIE_NAME}=1; Path=/; HttpOnly; SameSite=Lax`,
        "Location": "/admin?lang=" + lang
      }
    });
  }
  // 密码错误简单回显
  return new Response(`<!DOCTYPE html>
<html lang="${lang}">
<head><meta charset="UTF-8"><title>${t.adminTitle}</title></head>
<body>
  <div class="err">${t.loginError}</div>
  <a href="/admin?lang=${lang}">返回</a>
</body>
</html>`, { status: 401, headers: { "content-type": "text/html" } });
}
