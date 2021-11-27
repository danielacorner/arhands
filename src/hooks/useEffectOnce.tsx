import { useEffect, useRef } from "react";

/**
 * Run an effect, only once, when a condition is met
 * @param callback callback to fire when shouldRun = true
 * @param shouldRun whether we should fire the callback
 * @param dependencies when these change, check again if shouldRun = true
 */

export function useEffectOnce({
  callback,
  shouldRun,
  dependencies,
}: {
  // eslint-disable-next-line @typescript-eslint/ban-types
  callback: Function;
  shouldRun: boolean;
  dependencies: any[];
}) {
  const didRun = useRef(false);
  let dependenciesToUse = dependencies;

  useEffect(() => {
    if (shouldRun && !didRun.current) {
      // once we fire, cancel the useEffect
      callback();
      didRun.current = true;
      // eslint-disable-next-line
      dependenciesToUse = []; // this line cancels the effect
    }
  }, dependenciesToUse);
}
