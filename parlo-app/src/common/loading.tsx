import React from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import { useIsMounted } from '../lib/hooks'


interface Props {
  /**
   * Determines if pre-loading is required
   * @defaultValue optional
   * */
  preloading?: boolean
  /**
   * Determines if fixed loading is required
   * @defaultValue optional
   * */
  fixed?: boolean
  /**
   * Todo - if required handle this in future
   * @deprecated right now no issues regarding jwt
   * */
  jwtError?: boolean
}

/**
 * @returns React JSXElement -> Spinner | preloader | freeze loader
 * */

export const Loading = (props: Props) => {
  const { preloading, fixed, jwtError } = props

  const mounted = useIsMounted()

  return (
    <div
      className={`${preloading ? 'h-screen' : 'min-h-[200px]'} ${
        fixed ? 'fixed' : ''
      } flex justify-center items-center `}
    >
      <div className="text-center">
        {preloading && (
          <div className="mb-5">
            <h2>
              Track
            </h2>
          </div>
        )}
        {jwtError && <p>Fetching data please wait for a min!</p>}
        {mounted && <CircularProgress />}
      </div>
    </div>
  )
}
