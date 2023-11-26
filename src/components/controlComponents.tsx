import { useSignIn } from '../hooks'
import { PropsWithChildren } from 'react'

export const SignedIn: React.FC<PropsWithChildren> = ({ children }) => {
  const { loading, isSignedIn } = useSignIn()
  if (loading) {
    return null
  }
  if (isSignedIn) {
    return <>{children}</>
  } else {
    return null
  }
}

export const SignedOut: React.FC<PropsWithChildren> = ({ children }) => {
  const { loading, isSignedIn } = useSignIn()
  if (loading) {
    return null
  }
  if (!isSignedIn) {
    return <>{children}</>
  } else {
    return null
  }
}
