import { PropsWithChildren, createContext, useEffect, useState } from 'react'

type CheckingAuth = {
  loading: true
  isSignedIn: null
}
type CheckedAuth = {
  loading: false
  isSignedIn: boolean
}
export type AuthContextType = CheckingAuth | CheckedAuth
export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [loading, setLoading] = useState<boolean>(true)
  const [isSignedIn, setIsSignedIn] = useState<boolean | null>(null)
  useEffect(() => {
    fetch('/sessions')
      .then((res) => {
        console.log(res)
        console.log({ resStatus: res.status })
        setIsSignedIn(res.status === 200)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])
  return (
    <AuthContext.Provider
      value={{ isSignedIn, loading } as CheckingAuth | CheckedAuth}
    >
      {children}
    </AuthContext.Provider>
  )
}
