import { useRef, useEffect } from "react";
import { useViewportSize } from "~/hooks/useViewportSize";

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

/* 
    ref:
    - https://medium.com/@pdx.lucasm/canvas-with-react-js-32e133c05258
    - https://stackoverflow.com/a/19772220
 */
export const useCanvas = (
    update: (ctx: CanvasRenderingContext2D, time: number, delta: number) => void,
    stop?: boolean
) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { height, width } = useViewportSize();

    useEffect(() => {
        const canvas = canvasRef.current;
        resizeCanvas(canvas!);
    }, [height, width]);

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

            frameCount++;
            if (stop) return;

            if (!Number.isNaN(delta)) update(context, time, delta);
            else console.log("skipping update");
            animationFrameId = window.requestAnimationFrame(render);
        };
        window.requestAnimationFrame(render);

        return () => window.cancelAnimationFrame(animationFrameId);
    }, [stop, update]);

    return canvasRef;
};
