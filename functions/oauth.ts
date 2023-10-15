interface Env {
  GITHUB_OAUTH_CLIENT_ID: string
  GITHUB_OAUTH_CLIENT_SECRET: string
}

export const onRequest: PagesFunction<Env> = async ({ env, request }) => {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  return new Response(
    `a ${env.GITHUB_OAUTH_CLIENT_ID} ${env.GITHUB_OAUTH_CLIENT_SECRET}`,
  )
}
