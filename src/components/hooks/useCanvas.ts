import { useRef, useEffect } from "react";

import { useViewportSize } from "~/hooks/useViewportSize";

export interface CanvasOptions {
    stop?: boolean;
    preUpdate?: UpdateFn;
    postUpdate?: UpdateFn;
}

const resizeCanvas = (canvas: HTMLCanvasElement) => {
    const { height, width } = canvas.getBoundingClientRect();

    if (canvas.width !== width || canvas.height !== height) {
        const { devicePixelRatio: ratio = 1 } = window;

        const context = canvas.getContext("2d");
        canvas.width = width * ratio;
        canvas.height = height * ratio;

        context!.scale(ratio, ratio);
        return true;
    }

    return false;
};

export type UpdateFn = (
    ctx: CanvasRenderingContext2D,
    time: number,
    delta: number,
    canvasSize: { width: number; height: number }
) => void;

/* 
    ref:
    - https://medium.com/@pdx.lucasm/canvas-with-react-js-32e133c05258
    - https://stackoverflow.com/a/19772220
 */
export const useCanvas = (update: UpdateFn, options: CanvasOptions) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas!.getContext("2d") as CanvasRenderingContext2D;

        let frameCount = 0;
        let animationFrameId: number;

        let startTime: number;

        const render = (timeStamp: number) => {
            if (startTime === undefined) startTime = timeStamp;
            const time = timeStamp - startTime;
            const delta = time / frameCount;
            const fps = 1000 / delta;

            const { devicePixelRatio: ratio = 1 } = window;
            const canvasSize = { height: canvas!.height / ratio, width: canvas!.width / ratio };

            frameCount++;
            if (options.stop) return;

            if (!Number.isNaN(delta)) {
                options.preUpdate?.(context, time, delta, canvasSize);
                update(context, time, delta, canvasSize);
                options.postUpdate?.(context, time, delta, canvasSize);
            }
            animationFrameId = window.requestAnimationFrame(render);
        };
        window.requestAnimationFrame(render);

        return () => window.cancelAnimationFrame(animationFrameId);
    }, [update, options]);

    const { height, width } = useViewportSize();

    useEffect(() => {
        const canvas = canvasRef.current;
        resizeCanvas(canvas!);
    }, [height, width]);

    return canvasRef;
};
