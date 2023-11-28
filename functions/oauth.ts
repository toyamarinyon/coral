import { Env } from './env.js'
import { getSession } from './helpers/getSession.js'
import { getIronSession } from 'iron-session/edge'
import { object, string, parse, number } from 'valibot'

const callbackParamsSchema = object({
  code: string(),
})

declare module 'iron-session' {
  interface IronSessionData {
    user: { name: string }
    accessToken: string
  }
}

/**
 * [link](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps#2-users-are-redirected-back-to-your-site-by-github)
 */
const accessTokenSchema = object({
  access_token: string(),
  token_type: string(),
  scope: string(),
})

const getAccessToken = async ({
  code,
  clientId,
  clientSecret,
}: {
  code: string
  clientId: string
  clientSecret: string
}) => {
  const response = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'user-agent': 'cloudflare-worker',
      accept: 'application/json',
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
    }),
  })
  return parse(accessTokenSchema, await response.json()).access_token
}

/**
 * [link](https://docs.github.com/en/rest/users/users?apiVersion=2022-11-28#get-the-authenticated-user)
 */

export const userScheme = object({
  login: string(),
  id: number(),
  avatar_url: string(),
})

export const getUser = async (accessToken: string) => {
  const response = await fetch('https://api.github.com/user', {
    headers: {
      'content-type': 'application/json',
      'user-agent': 'cloudflare-worker',
      accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return parse(userScheme, await response.json())
}

export const onRequest: PagesFunction<Env> = async ({ env, request }) => {
  const url = new URL(request.url)
  const unsafeParams = Object.fromEntries(url.searchParams.entries())
  const params = parse(callbackParamsSchema, unsafeParams)
  const accessToken = await getAccessToken({
    code: params.code,
    clientId: env.GITHUB_OAUTH_CLIENT_ID,
    clientSecret: env.GITHUB_OAUTH_CLIENT_SECRET,
  })
  const user = await getUser(accessToken)

  const response = new Response(
    `<html><head><meta http-equiv="refresh" content="1;URL=${url.protocol}//${url.host}"></head><body></body></html>`,
    {
      headers: {
        'Content-Type': 'text/html; charset=UTF-8',
      },
    },
  )

  const session = await getSession({
    request,
    response,
    password: 'complex_password_at_least_32_characters_long',
  })
  // const session = await getIronSession(request, response, {
  //   cookieName: 'session',
  //   password: 'complex_password_at_least_32_characters_long',
  //   cookieOptions: {
  //     secure: true,
  //     httpOnly: true,
  //   },
  // })
  session.user = { name: user.login }
  session.accessToken = accessToken
  await session.save()

  return response
}
