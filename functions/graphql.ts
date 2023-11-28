import { Env } from './env.js'
import { getSession } from './helpers/getSession.js'

export const onRequest: PagesFunction<Env> = async ({ env, request }) => {
  const session = await getSession({
    request,
    password: env.SESSION_SECRET,
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
