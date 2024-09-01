import React, { useState } from "react";

import { Canvas } from "~/components/Canvas";
import { Wizard } from "./utils";
import classes from "./Game.module.css";

const preUpdate = (ctx: CanvasRenderingContext2D) => {
    // ctx.save();
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
};

const makeUpdate = () => {
    const pinkWizard = new Wizard({
        x: 10,
        y: 10,
        speed: 25,
        direction: Math.PI / 2,
        shootingDirection: 0,
    });
    const cyanWizard = new Wizard({
        x: 90,
        y: 40,
        speed: 20,
        direction: -(Math.PI / 2),
        color: "cyan",
        shootingDirection: Math.PI,
    });

    const update = (
        ctx: CanvasRenderingContext2D,
        time: number,
        delta: number,
        canvasSize: { width: number; height: number }
    ) => {
        pinkWizard.draw(ctx, time, delta, canvasSize);
        cyanWizard.draw(ctx, time, delta, canvasSize);
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
