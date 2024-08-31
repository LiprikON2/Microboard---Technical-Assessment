import { useEffect, useRef } from "react";

type CanvasProps = {
    update: (ctx: CanvasRenderingContext2D, time: number, delta: number) => void;
    stop?: boolean;
} & React.HTMLProps<HTMLCanvasElement>;

/* 
ref:
- https://medium.com/@pdx.lucasm/canvas-with-react-js-32e133c05258
- https://stackoverflow.com/a/19772220
 */
export const Canvas = ({ update: draw, stop = false, ...rest }: CanvasProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas!.getContext("2d") as CanvasRenderingContext2D;
        let frameCount = 0;
        let animationFrameId: number;

        let startTime: number;

        const update = (timeStamp: number) => {
            if (startTime === undefined) startTime = timeStamp;
            const time = timeStamp - startTime;
            const delta = time / frameCount;
            const fps = 1000 / delta;

            frameCount++;
            if (stop) return;

            if (!Number.isNaN(delta)) draw(context, time, delta);
            animationFrameId = window.requestAnimationFrame(update);
        };
        window.requestAnimationFrame(update);

        return () => window.cancelAnimationFrame(animationFrameId);
    }, [stop, draw]);

    return (
        <>
            <canvas ref={canvasRef} {...rest}></canvas>
        </>
    );
};
