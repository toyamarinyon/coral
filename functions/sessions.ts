import { getIronSession } from 'iron-session/edge'

export const onRequest: PagesFunction = async ({ request }) => {
  const response = new Response()
  // @ts-expect-error - hack for iron-session [link](https://github.com/vvo/iron-session/pull/510/commits/b9fc40839313ebe282b0dd1f7f621a403bfe07be#diff-a2a171449d862fe29692ce031981047d7ab755ae7f84c707aef80701b3ea0c80R161-R165)
  request.credentials = 'credentials'
  const session = await getIronSession(request, response, {
    cookieName: 'session',
    password: 'complex_password_at_least_32_characters_long',
    cookieOptions: {
      secure: true,
      httpOnly: true,
    },
  })
  if (session.user == null) {
    new Response('session is null', { status: 401 })
  }
  return new Response(`You're logged in as ${session.user.name}!`, {
    status: 200,
  })
}
