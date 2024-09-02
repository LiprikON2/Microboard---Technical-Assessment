import { useState } from "react";

import { Game } from "./scenes";
import { useWindowEvent } from "./hooks";
import { GameEventMap } from "./scenes/Game/utils";
import { Radio, Tooltip } from "./components";
import "./App.css";

interface WizardActivationEventDetail {
    wizardId: string | null;
    active: boolean;
}

interface WizardProjectileColorEventDetail {
    wizardId: string | null;
    color: string;
}
export interface AppEventMap extends HTMLElementEventMap {
    wizardActivation: MouseEvent & { detail: WizardActivationEventDetail };
    wizardProjectileColor: MouseEvent & { detail: WizardProjectileColorEventDetail };
}

const App = () => {
    const [wizardTooltip, setWizardTooltip] = useState<{
        x: number;
        y: number;
        show: boolean;
        wizardId: string | null;
        content: { color: string; active: boolean }[];
    }>({
        x: 0,
        y: 0,
        wizardId: null,
        content: [],
        show: false,
    });

    useWindowEvent<GameEventMap, "wizardClick">("wizardClick", (e) => {
        setWizardTooltip({
            ...e.detail.coords,
            content: e.detail.content,
            wizardId: e.detail.wizardId,
            show: true,
        });
    });

    const handleChangeWizardProjectileColor = (color: string) => {
        const content = [...wizardTooltip.content.map((item) => ({ ...item, active: false }))];
        const itemIndex = content.findIndex((item) => item.color === color);
        const item = { ...content[itemIndex] };
        item.active = true;
        content[itemIndex] = item;

        setWizardTooltip({
            ...wizardTooltip,
            content,
        });

        // change wizard projectile color
        const wizardActivationEvent = new CustomEvent<WizardProjectileColorEventDetail>(
            "wizardProjectileColor",
            {
                bubbles: true,
                cancelable: false,
                composed: true,
                detail: {
                    wizardId: wizardTooltip.wizardId,
                    color,
                },
            }
        );
        dispatchEvent(wizardActivationEvent);

        // dismissTooltip();
    };

    const dismissTooltip = () => {
        const wizardActivationEvent = new CustomEvent<WizardActivationEventDetail>(
            "wizardActivation",
            {
                bubbles: true,
                cancelable: false,
                composed: true,
                detail: {
                    wizardId: wizardTooltip.wizardId,
                    active: true,
                },
            }
        );
        dispatchEvent(wizardActivationEvent);
        setWizardTooltip({ x: 0, y: 0, content: [], wizardId: null, show: false });
    };

    return (
        <>
            <Game />
            <Tooltip
                x={wizardTooltip.x}
                y={wizardTooltip.y}
                visible={wizardTooltip.show}
                onClose={dismissTooltip}
            >
                {wizardTooltip.content.map((item) => (
                    <Radio
                        key={item.color}
                        name={item.color}
                        checked={item.active}
                        onChange={() => handleChangeWizardProjectileColor(item.color)}
                    />
                ))}
            </Tooltip>
        </>
    );
};

export default App;
