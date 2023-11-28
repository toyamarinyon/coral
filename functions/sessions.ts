import { getSession } from './helpers/getSession.js'
import { getIronSession } from 'iron-session/edge'

export const onRequest: PagesFunction = async ({ request }) => {
  // request.credentials = 'credentials'
  // const session = await getIronSession(request, response, {
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
  if (session.user == null) {
    return new Response('session is null', { status: 401 })
  }
  return new Response(`You're logged in as ${session.user.name}!`, {
    status: 200,
  })
}
