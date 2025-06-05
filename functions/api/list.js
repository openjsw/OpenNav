const COOKIE_NAME = "opennav_auth";
export async function onRequestGet({ env, request }) {
  if (!request.headers.get('cookie')?.includes(`${COOKIE_NAME}=1`))
    return new Response('未授权', { status: 401 });
  const { results } = await env.DB.prepare("SELECT * FROM projects ORDER BY id DESC").all();
  return new Response(JSON.stringify(results), { headers: { "content-type": "application/json" } });
}
