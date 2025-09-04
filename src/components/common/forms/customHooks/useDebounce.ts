"use client";
import { useMemo, useEffect, useCallback } from "react";
import debounce from "lodash.debounce";

export function useDebouncedCallback<F extends (...a: any[]) => any>(
  fn: F,
  delay = 300,
  deps: any[] = []
) {
  // fn estable para no cerrar sobre valores obsoletos:
  const stableFn = useCallback(fn, deps);

  const debounced = useMemo(
    () => debounce((...args: Parameters<F>) => stableFn(...args), delay),
    [stableFn, delay]
  );

  useEffect(() => () => debounced.cancel(), [debounced]);
  return debounced; // incluye .cancel() y .flush()
}