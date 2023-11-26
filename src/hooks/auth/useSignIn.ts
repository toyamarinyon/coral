import { AuthContextType } from '../../contexts'
import { useAuthContext } from './useAuthContext'

export const useSignIn = (): AuthContextType => {
  const { loading, isSignedIn } = useAuthContext()
  return {
    loading,
    isSignedIn,
  } as AuthContextType
}
