const COOKIE_NAME = "opennav_auth";
export async function onRequestGet() {
  return new Response('', {
    status: 302,
    headers: {
      "Set-Cookie": `${COOKIE_NAME}=0; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`,
      "Location": "/admin"
    }
  });
}
