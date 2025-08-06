import { useEffect, DependencyList } from 'react'

export function useDebounceEffect(
  fn: () => void,
  waitTime: number,
  deps?: DependencyList | any,
) {
  useEffect(() => {
    const t = setTimeout(() => {
      // eslint-disable-next-line prefer-spread
      fn.apply(undefined, deps)
    }, waitTime)

    return () => {
      clearTimeout(t)
    }
  }, [deps, fn, waitTime])
}
