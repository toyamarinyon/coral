export const Login: React.FC = () => {
  const goToGitHubLoginPage = () => {
    const url = new URL('https://github.com/login/oauth/authorize')
    url.searchParams.set(
      'client_id',
      import.meta.env.VITE_GITHUB_OAUTH_CLIENT_ID,
    )
    url.searchParams.set('scope', 'user repo')

    window.location.href = url.toString()
  }
  return (
    <div>
      <h1>Login</h1>
      <button
        className="mt-[10px] box-border inline-flex h-[35px] w-full items-center justify-center rounded-[4px] bg-rosePineDawn-text px-[15px] font-medium leading-none text-rosePineDawn-base focus:outline-none disabled:cursor-not-allowed disabled:bg-rosePineDawn-muted"
        onClick={goToGitHubLoginPage}
      >
        Login
      </button>
    </div>
  )
}
