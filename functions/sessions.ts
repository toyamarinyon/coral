import { Env } from './env.js'
import { getSession } from './helpers/getSession.js'

export const onRequest: PagesFunction<Env> = async ({ env, request }) => {
  const session = await getSession({
    request,
    password: env.SESSION_SECRET,
  })
  if (session.user == null) {
    return new Response('session is null', { status: 401 })
  }
  return new Response(`You're logged in as ${session.user.name}!`, {
    status: 200,
  })
}
