import React from 'react'

/**
 * To get window height and width
 * @example 
  `function App () {
    const {width, height} = useWindowSize()

    return (
      <div>
        {width}px / {height}px
      </div>
    )
  }`
 * @returns {height, width}
 */

export const useWindowSize = () => {
  const isClient = typeof window === 'object'

  const getSize = () => {
    return {
      width: isClient ? window.innerWidth : 0,
      height: isClient ? window.innerHeight : 0
    }
  }

  const [windowSize, setWindowSize] = React.useState(getSize)

  React.useEffect(() => {
    function handleResize() {
      setWindowSize(getSize())
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClient]) // Empty array ensures that effect is only run on mount and unmount

  return windowSize
}


