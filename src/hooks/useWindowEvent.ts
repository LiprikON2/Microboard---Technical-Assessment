import { useEffect } from "react";

// ref: https://github.com/mantinedev/mantine/blob/master/packages/@mantine/hooks/src/use-window-event/use-window-event.ts
export function useWindowEvent<T, K extends string>(
    type: K,
    listener: K extends keyof T
        ? (this: Window, ev: T[K]) => void
        : (this: Window, ev: CustomEvent) => void,
    options?: boolean | AddEventListenerOptions
) {
    useEffect(() => {
        window.addEventListener(type as any, listener, options);
        return () => window.removeEventListener(type as any, listener, options);
    }, [type, listener, options]);
}
