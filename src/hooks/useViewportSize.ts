import { useCallback, useEffect, useState } from "react";
import { useWindowEvent } from "./useWindowEvent";

const eventListerOptions = {
    passive: true,
};

// ref: https://github.com/mantinedev/mantine/blob/master/packages/@mantine/hooks/src/use-viewport-size/use-viewport-size.ts
export function useViewportSize() {
    const [windowSize, setWindowSize] = useState({
        width: 0,
        height: 0,
    });

    const setSize = useCallback(() => {
        setWindowSize({ width: window.innerWidth || 0, height: window.innerHeight || 0 });
    }, []);

    useWindowEvent("resize", setSize, eventListerOptions);
    useWindowEvent("orientationchange", setSize, eventListerOptions);
    useEffect(setSize, [setSize]);

    return windowSize;
}
