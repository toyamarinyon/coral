import { AuthContextType } from '../../contexts'
import { useAuthContext } from './useAuthContext'

export const useSignIn = (): AuthContextType => {
  const { loading, isSignedIn } = useAuthContext()
  return {
    loading,
    signIn: isSignedIn,
  } as unknown as AuthContextType
}
