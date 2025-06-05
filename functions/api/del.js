const COOKIE_NAME = "opennav_auth";
export async function onRequestPost({ env, request }) {
  if (!request.headers.get('cookie')?.includes(`${COOKIE_NAME}=1`))
    return new Response('未授权', { status: 401 });
  const { id } = await request.json();
  if (!id) return new Response('参数缺失', { status: 400 });
  await env.DB.prepare("DELETE FROM projects WHERE id=?").bind(id).run();
  return new Response('OK');
}
