import { useState } from "react";

import "./App.css";
import { randomId } from "./utils";
import { Game, WizardScoreboard, WizardTooltip } from "./scenes";

export interface WizardActivationEventDetail {
    wizardId: string | null;
    active: boolean;
}

export interface WizardProjectileColorEventDetail {
    wizardId: string | null;
    color: string;
}
export interface AppEventMap extends HTMLElementEventMap {
    wizardActivation: MouseEvent & { detail: WizardActivationEventDetail };
    wizardProjectileColor: MouseEvent & { detail: WizardProjectileColorEventDetail };
}

const App = () => {
    const [gameKey, setGameKey] = useState(randomId());
    const [scoreboardKey, setScoreboardKey] = useState(randomId());

    const resetGame = () => {
        setGameKey(randomId());
        setScoreboardKey(randomId());
    };

    return (
        <>
            <WizardScoreboard key={scoreboardKey} />
            <Game key={gameKey} />
            <button onClick={resetGame}>Reset</button>
            <WizardTooltip />
        </>
    );
};

export default App;
