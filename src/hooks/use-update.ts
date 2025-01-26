import { useState } from 'react'

const useUpdate = <T>({
  route,
  method = 'POST',
  onSuccess,
  onError 
}: {
  route: string
  method?: string
  onSuccess?: () => void
  onError?: () => void
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const update = async (payload: T) => {
    setIsLoading(true)
    const response = await fetch(route, {
      method,
      body: JSON.stringify(payload)
    })
    setIsLoading(false)
    if (response.ok) {
      onSuccess?.()
    } else {
      onError?.()
    }
  }

  return { isLoading, update }
}

export default useUpdate