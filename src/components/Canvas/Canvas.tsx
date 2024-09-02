import { CanvasOptions, InitFn, UpdateFn, useCanvas } from "./hooks";
import classes from "./Canvas.module.css";
import { memo } from "react";

type CanvasProps = {
    init: InitFn;
    update: UpdateFn;
    options: CanvasOptions;
} & React.HTMLProps<HTMLCanvasElement>;

export const Canvas = ({ init, update, options, ...rest }: CanvasProps) => {
    const canvasRef = useCanvas(init, update, options);

    return <canvas className={classes.canvas} ref={canvasRef} {...rest} />;
};
