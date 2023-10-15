interface Env {
  GITHUB_OAUTH_CLIENT_ID: string
}

export const onRequest: PagesFunction<Env> = async ({ env }) => {
  const url = new URL('https://github.com/login/oauth/authorize')
  url.searchParams.set('client_id', env.GITHUB_OAUTH_CLIENT_ID)
  url.searchParams.set('scope', 'user repo')
  return new Response(
    `<html><head><meta http-equiv="refresh" content="0;URL=${url}"></head><body></body></html>`,
  )
}
