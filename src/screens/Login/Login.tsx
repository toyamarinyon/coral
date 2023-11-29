import confetti from 'canvas-confetti'
import { useCallback, useEffect } from 'react'

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
  const seasonedUser = localStorage.getItem('authToken') != null
  const execConfetti = useCallback(() => {
    confetti({
      particleCount: 150,
      spread: 180,
    })
  }, [])
  useEffect(() => {
    if (!seasonedUser) {
      return
    }
    execConfetti()
  }, [seasonedUser, execConfetti])

  return (
    <main className="mx-auto flex h-screen items-center justify-center">
      <div className="w-[500px] space-y-8">
        {seasonedUser ? (
          <div className="space-y-4">
            <p className="text-3xl font-bold">
              GitHub ログインに対応しました！
            </p>
            <p>
              いつもご利用いただきありがとうございます🫰🫰🫰
              <br />
              ついに、GitHubのアカウントでログインできるようになりました！
              <br />
              もうアクセストークンをコピーする必要はありません
              <button onClick={execConfetti} className="px-1">
                🎉
              </button>
              <span className="text-sm text-rosePineDawn-muted">
                ←押すと...
              </span>
            </p>
            <p>
              それに伴い、お手数ですが以下のボタンをクリックしてGitHubログインを行なってください。
            </p>
            <p>今後とも、よろしくお願いいたします🫰🫰🫰</p>
          </div>
        ) : (
          <>
            <p className="text-3xl font-bold">
              Thank you for running this app!
            </p>
            <p className="text-xl">
              Please login with your GitHub account to get started.
            </p>
          </>
        )}
        <button
          className="mt-[10px] box-border inline-flex h-[35px] w-full items-center justify-center space-x-2 rounded-[4px] bg-rosePineDawn-text px-[15px] font-medium leading-none text-rosePineDawn-base focus:outline-none disabled:cursor-not-allowed disabled:bg-rosePineDawn-muted"
          onClick={goToGitHubLoginPage}
        >
          <svg
            fill="currentColor"
            viewBox="0 0 16 16"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            className="h-6 w-6"
          >
            <path
              fill-rule="evenodd"
              d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
              className="jsx-2529474241"
            ></path>
          </svg>
          <p>Login with GitHub</p>
        </button>
      </div>
    </main>
  )
}
