import { useState } from "react";

import { Game } from "./scenes";
import { useWindowEvent } from "./hooks";
import { GameEventMap } from "./scenes/Game/utils";
import { Tooltip } from "./components";
import "./App.css";

const App = () => {
    const [wizardTooltip, setWizardTooltip] = useState<{ x: number; y: number; show: boolean }>({
        x: 0,
        y: 0,
        show: false,
    });

    useWindowEvent<GameEventMap, "wizardClick">("wizardClick", (e) => {
        setWizardTooltip({ ...e.detail.coords, show: true });
    });
    return (
        <>
            <Game />
            <Tooltip
                x={wizardTooltip.x}
                y={wizardTooltip.y}
                visible={wizardTooltip.show}
                onClose={() => setWizardTooltip({ x: 0, y: 0, show: false })}
            >
                {/* <button onClick={() => setKey(randomId())}>Test</button> */}
                test
            </Tooltip>
        </>
    );
};

export default App;
