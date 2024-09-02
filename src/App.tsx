import { Game, WizardTooltip } from "./scenes";
import "./App.css";

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
    return (
        <>
            <Game />
            <WizardTooltip />
        </>
    );
};

export default App;
