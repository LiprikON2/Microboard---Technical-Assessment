import { useState } from "react";

import { ControlPanel, Game, WizardControls, WizardScoreboard, WizardTooltip } from "./scenes";
import { randomId } from "./utils";
import "./App.css";

export interface WizardActivationEventDetail {
    wizardId: string | null;
    active: boolean;
}

export interface WizardProjectileColorEventDetail {
    wizardId: string | null;
    color: string;
}

export interface WizardControlChangeEventDetail {
    wizardId: string;
    controls: WizardControls;
}

export interface AppEventMap extends HTMLElementEventMap {
    wizardActivation: CustomEvent & { detail: WizardActivationEventDetail };
    wizardProjectileColor: CustomEvent & { detail: WizardProjectileColorEventDetail };
    wizardControlChange: CustomEvent & { detail: WizardControlChangeEventDetail };
}

const App = () => {
    const [gameKey, setGameKey] = useState(randomId());
    const [scoreboardKey, setScoreboardKey] = useState(randomId());
    const [controlPanelKey, setControlPanelKey] = useState(randomId());

    const resetGame = () => {
        setGameKey(randomId());
        setScoreboardKey(randomId());
        setControlPanelKey(randomId());
    };

    return (
        <>
            <WizardScoreboard key={scoreboardKey} />
            <Game key={gameKey} />
            <ControlPanel key={controlPanelKey} onReset={resetGame} />
            <WizardTooltip />
        </>
    );
};

export default App;
