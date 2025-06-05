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
    body{background:#f8f9fb;margin:0;display:flex;flex-direction:column;min-height:100vh;}
    .loginbox{background:#fff;max-width:340px;margin:12vh auto 0 auto;padding:34px 26px 30px 26px;border-radius:12px;box-shadow:0 2px 12px #0001;}
    h2{margin:0 0 18px 0;font-size:1.7em;}
    form{margin:0;}
    input[type=password]{width:100%;padding:10px 12px;font-size:1em;border:1px solid #e0e2ee;border-radius:8px;margin-bottom:16px;}
    button{width:100%;padding:10px;font-size:1.09em;background:#2563eb;color:#fff;border:none;border-radius:8px;cursor:pointer;}
    button:hover{background:#1e48c9;}
    .lang{position:absolute;right:22px;top:18px;font-size:.95em;}
    .err{color:#f33;margin-bottom:8px;}
    @media (max-width:420px){.loginbox{margin-top:3vh;padding:22px 8px 16px 8px;}}
  </style>
</head>
<body>
  <a class="lang" href="?lang=${lang === "zh" ? "en" : "zh"}">${lang === "zh" ? "ENGLISH" : "简体中文"}</a>
  <div class="loginbox">
    <h2>${t.adminTitle}</h2>
    <form method="post">
      <input name="password" type="password" placeholder="${t.passwordPlaceholder}" required autocomplete="current-password">
      <button type="submit">${t.loginBtn}</button>
    </form>
    <div class="desc" style="color:#888;margin-top:14px;">${t.adminDesc}</div>
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
    body{font-family:sans-serif;background:#f8f9fb;margin:0;display:flex;flex-direction:column;min-height:100vh;}
    .logout{position:absolute;right:20px;top:18px;}
    .container{max-width:720px;margin:0 auto;padding:34px 16px;flex:1;}
    h2{margin-top:0;}
    form[id="addForm"]{display:flex;flex-wrap:wrap;gap:7px;margin-bottom:20px;}
    form[id="addForm"] input{padding:6px 8px;border:1px solid #d3d7e2;border-radius:7px;font-size:.97em;}
    form[id="addForm"] input[name="id"]{width:52px;}
    form[id="addForm"] input[type="submit"]{background:#2563eb;color:#fff;border:none;border-radius:7px;cursor:pointer;padding:6px 20px;}
    form[id="addForm"] input[type="submit"]:hover{background:#1748bb;}
    table{width:100%;border-collapse:collapse;}
    th,td{border:1px solid #e7eaf2;padding:7px 4px;font-size:.98em;}
    th{background:#f3f6fa;}
    .actions button{margin-right:7px;padding:3px 11px;}
    .lang{position:absolute;right:90px;top:18px;}
    footer { width:100%;text-align:center;color:#aaa;margin-top:auto;padding:18px 0 12px 0;font-size:.98em;letter-spacing:0.04em;}
    @media (max-width:700px){
      .container{padding:10px 2px;}
      form[id="addForm"] input{width:98%;}
    }
  </style>
</head>
<body>
  <a href="/api/logout" class="logout">${t.logout}</a>
  <a class="lang" href="?lang=${lang === "zh" ? "en" : "zh"}">${lang === "zh" ? "ENGLISH" : "简体中文"}</a>
  <div class="container">
    <h2>${t.adminTitle}</h2>
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
