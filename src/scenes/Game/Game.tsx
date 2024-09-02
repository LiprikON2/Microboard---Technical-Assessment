import { memo, useState } from "react";

import { Canvas } from "~/components";
import { randomId } from "~/utils";
import { GameScene } from "./utils";

export const Game = memo(() => {
    const gameScene = new GameScene();

    return (
        <Canvas
            init={gameScene.init}
            update={gameScene.update}
            options={{
                preUpdate: gameScene.preUpdate,
                dispose: gameScene.dispose,
            }}
        />
    );
});
