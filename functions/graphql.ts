import { getSession } from './helpers/getSession.js'

export const onRequest: PagesFunction = async ({ request }) => {
  // request.credentials = 'credentials'
  // const session = await getIronSession(request, new Response(), {
  //   cookieName: 'session',
  //   password: 'complex_password_at_least_32_characters_long',
  //   cookieOptions: {
  //     secure: true,
  //     httpOnly: true,
  //   },
  // })
  const session = await getSession({
    request,
    password: 'complex_password_at_least_32_characters_long',
  })
  if (session.accessToken == null) {
    return new Response('accessToken is null', { status: 401 })
  }
  const headers = request.headers
  headers.set('authorization', `Bearer ${session.accessToken}`)
  return await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers,
    body: request.body,
  })
}
