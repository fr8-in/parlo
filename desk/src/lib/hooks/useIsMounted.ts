import React from 'react'

/**
 * The "ismounted" custom hook in React is used to check whether a component is mounted.
 * 
 * This hook helps to prevent memory leaks and performance issues.
 * @returns Boolean value
 */

export const useIsMounted = () => {
  const [mounted, setMounted] = React.useState<boolean>(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  return mounted
}
