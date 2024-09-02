import { memo, useState } from "react";

import { Canvas } from "~/components";
import { randomId } from "~/utils";
import { GameScene } from "./utils";

export const Game = memo(() => {
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
});
