import { AuthContext } from '../../contexts'
import { useContext } from 'react'

export const useAuthContext = () => {
  const authContext = useContext(AuthContext)
  if (authContext == null) {
    throw new Error('useAuthContext must be used within AuthProvider')
  }
  return authContext
}
