import React, { useState } from "react";

import { Canvas } from "~/components/Canvas";
import { GameScene } from "./utils";
import classes from "./Game.module.css";

const randomId = () => Math.random().toString(36).substr(2, 9);
export const Game = () => {
    const [stopped, setStopped] = useState(false);
    const [key, setKey] = useState(randomId());

    const gameScene = new GameScene();

    return (
        <>
            {/* <button onClick={() => setStopped(!stopped)}>Stop</button> */}
            <button onClick={() => setKey(randomId())}>Restart</button>
            <Canvas
                key={key}
                init={gameScene.init}
                update={gameScene.update}
                options={{
                    preUpdate: gameScene.preUpdate,
                    dispose: gameScene.dispose,
                    stop: stopped,
                }}
            />
        </>
    );
};
