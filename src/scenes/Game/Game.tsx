import React, { useState } from "react";

import { Canvas } from "~/components/Canvas";
import { Circle } from "./utils";
import classes from "./Game.module.css";

const preUpdate = (ctx: CanvasRenderingContext2D) => {
    // ctx.save();
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
};

const makeUpdate = () => {
    const circle = new Circle({
        x: 10,
        y: 10,
        speed: 20,
        direction: Math.PI + 1,
        bounce: true,
    });

    const update = (
        ctx: CanvasRenderingContext2D,
        time: number,
        delta: number,
        canvasSize: { width: number; height: number }
    ) => {
        circle.draw(ctx, time, delta, canvasSize);
    };

    return update;
};

export const Game = () => {
    const [stopped, setStopped] = useState(false);

    const update = makeUpdate();
    return (
        <>
            <button onClick={() => setStopped(!stopped)}>Stop</button>
            <Canvas update={update} options={{ preUpdate, stop: stopped }} />
        </>
    );
};
