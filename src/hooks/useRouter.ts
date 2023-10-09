import { useState } from 'react'

type Routes = 'feed' | 'setting'
export const useRouter = () => {
  const state = useState<Routes>('feed')
  return state
}
