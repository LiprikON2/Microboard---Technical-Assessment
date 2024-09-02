import { useState } from "react";

import { Canvas, Tooltip } from "~/components";
import { randomId } from "~/utils";
import { GameScene } from "./utils";
import classes from "./Game.module.css";

export const Game = () => {
    const [stopped, setStopped] = useState(false);
    const [visible, setVisible] = useState(true);
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
            <Tooltip x={9999} y={0} visible={visible}>
                <button onClick={() => setKey(randomId())}>Test</button>
            </Tooltip>
        </>
    );
};
