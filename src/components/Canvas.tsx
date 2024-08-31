import { useCanvas } from "./hooks";
import classes from "./Canvas.module.css";

type CanvasProps = {
    update: (ctx: CanvasRenderingContext2D, time: number, delta: number) => void;
    stop?: boolean;
} & React.HTMLProps<HTMLCanvasElement>;

export const Canvas = ({ update, stop = false, ...rest }: CanvasProps) => {
    const canvasRef = useCanvas(update, stop);

    return (
        <>
            <canvas className={classes.canvas} ref={canvasRef} {...rest}></canvas>
        </>
    );
};
