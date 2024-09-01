import { CanvasOptions, UpdateFn, useCanvas } from "./hooks";
import classes from "./Canvas.module.css";

type CanvasProps = {
    update: UpdateFn;
    options: CanvasOptions;
} & React.HTMLProps<HTMLCanvasElement>;

export const Canvas = ({ update, options, ...rest }: CanvasProps) => {
    const canvasRef = useCanvas(update, options);

    return <canvas className={classes.canvas} ref={canvasRef} {...rest} />;
};
