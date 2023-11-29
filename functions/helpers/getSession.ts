import { getIronSession } from 'iron-session/edge'

type Args = {
  request: Request
  response?: Response
  password: string
}
export const getSession = ({
  request,
  response = new Response(),
  password,
}: Args) => {
  // @ts-expect-error - hack for iron-session [link](https://github.com/vvo/iron-session/pull/510/commits/b9fc40839313ebe282b0dd1f7f621a403bfe07be#diff-a2a171449d862fe29692ce031981047d7ab755ae7f84c707aef80701b3ea0c80R161-R165)
  request.credentials = 'credentials'
  return getIronSession(request, response, {
    cookieName: 'session',
    password,
    cookieOptions: {
      secure: true,
      httpOnly: true,
    },
  })
}
