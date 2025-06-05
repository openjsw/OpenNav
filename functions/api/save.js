const COOKIE_NAME = "opennav_auth";
export async function onRequestPost({ env, request }) {
  if (!request.headers.get('cookie')?.includes(`${COOKIE_NAME}=1`))
    return new Response('未授权', { status: 401 });

  let data = await request.json();
  const { id, name_zh, name_en, desc_zh, desc_en, url, tags } = data;
  if (!name_zh || !name_en || !url) return new Response('必填项缺失', { status: 400 });

  if (id) {
    // 编辑
    await env.DB.prepare(
      `UPDATE projects SET name_zh=?,name_en=?,desc_zh=?,desc_en=?,url=?,tags=? WHERE id=?`
    ).bind(name_zh, name_en, desc_zh||'', desc_en||'', url, tags||'', id).run();
  } else {
    // 新增
    await env.DB.prepare(
      `INSERT INTO projects (name_zh,name_en,desc_zh,desc_en,url,tags) VALUES (?,?,?,?,?,?)`
    ).bind(name_zh, name_en, desc_zh||'', desc_en||'', url, tags||'').run();
  }
  return new Response('OK');
}
