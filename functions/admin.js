const COOKIE_NAME = "opennav_auth";

export async function onRequestGet({ request, env }) {
  const isAuthed = request.headers.get('cookie')?.includes(`${COOKIE_NAME}=1`);

  if (!isAuthed) {
    // 登录页面
    return new Response(`<!DOCTYPE html>
<html><body>
  <h2>OpenNav 管理后台</h2>
  <form method="post">
    <input name="password" type="password" placeholder="密码" required>
    <button type="submit">登录</button>
  </form>
</body></html>`, { headers: { "content-type": "text/html" } });
  }

  // 管理页面
  return new Response(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"><title>OpenNav 管理后台</title>
  <style>
    body{font-family:sans-serif;background:#f6f7fb;padding:20px;}
    .logout{position:absolute;right:20px;top:20px;}
    textarea{width:100%;height:120px;}
    input[type="submit"]{margin-top:10px;}
    .table{width:100%;border-collapse:collapse;}
    .table th,.table td{border:1px solid #eee;padding:8px;}
  </style>
</head>
<body>
  <a href="/api/logout" class="logout">退出</a>
  <h2>OpenNav 管理后台</h2>
  <form id="addForm">
    <label>新增/编辑项目：</label><br>
    <input name="id" placeholder="留空为新增" style="width:80px;">
    <input name="name_zh" placeholder="中文名" required>
    <input name="name_en" placeholder="English Name" required>
    <input name="desc_zh" placeholder="中文描述">
    <input name="desc_en" placeholder="English Desc">
    <input name="url" placeholder="https://example.com" required>
    <input name="tags" placeholder="标签,用逗号分隔">
    <input type="submit" value="保存">
  </form>
  <br>
  <table class="table" id="projectTable">
    <thead>
      <tr>
        <th>ID</th><th>中文名</th><th>EN Name</th><th>URL</th><th>操作</th>
      </tr>
    </thead>
    <tbody></tbody>
  </table>
  <script>
    async function loadProjects(){
      let res = await fetch('/api/list'); let data = await res.json();
      let tbody = document.querySelector("#projectTable tbody");
      tbody.innerHTML = "";
      for(let p of data){
        let tr = document.createElement("tr");
        tr.innerHTML = "<td>"+p.id+"</td><td>"+p.name_zh+"</td><td>"+p.name_en+"</td><td>"+p.url+"</td>"
          +'<td><button onclick="del('+p.id+')">删除</button><button onclick="edit('+JSON.stringify(p).replace(/"/g,'&quot;')+')">编辑</button></td>';
        tbody.appendChild(tr);
      }
    }
    loadProjects();
    window.del = async function(id){
      if(!confirm('确认删除？'))return;
      await fetch('/api/del', {method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({id})});
      loadProjects();
    };
    window.edit = function(p){
      for(let k in p){
        if(document.querySelector(`[name="${k}"]`))document.querySelector(`[name="${k}"]`).value = p[k];
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
  const pwd = (await request.formData()).get('password');
  if (pwd === env.ADMIN_PASSWORD) {
    return new Response('', {
      status: 302,
      headers: {
        "Set-Cookie": `${COOKIE_NAME}=1; Path=/; HttpOnly; SameSite=Lax`,
        "Location": "/admin"
      }
    });
  }
  return new Response('密码错误', { status: 401 });
}
