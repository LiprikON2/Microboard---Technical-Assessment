import { useState } from "react";

import { WizardControlChangeEventDetail } from "~/App";
import { Checkbox, Slider } from "~/components";
import { useWindowEvent } from "~/hooks";
import { GameEventMap, WizardControls } from "../Game";
import classes from "./ControlPanel.module.css";

interface ControlPanelProps {
    onReset?: () => void;
}

export const ControlPanel = ({ onReset = () => {} }: ControlPanelProps) => {
    const [wizardControls, setWizardControls] = useState<{
        [wizardId: string]: WizardControls;
    }>({});

    useWindowEvent<GameEventMap, "wizardControls">(
        "wizardControls",
        (e) => {
            if (Object.keys(wizardControls).length) return;
            setWizardControls(e.detail);
        },
        { once: true }
    );

    const handleWizardControlChange = (
        wizardId: string,
        key: keyof WizardControls,
        value: number | boolean
    ) => {
        setWizardControls((prevWizardControls) => {
            const nextWizardControls = {
                ...prevWizardControls,
                [wizardId]: { ...prevWizardControls[wizardId], [key]: value },
            };
            const wizardControlChangeEvent = new CustomEvent<WizardControlChangeEventDetail>(
                "wizardControlChange",
                {
                    bubbles: true,
                    cancelable: false,
                    composed: true,
                    detail: { wizardId, controls: nextWizardControls[wizardId] },
                }
            );
            dispatchEvent(wizardControlChangeEvent);

            return nextWizardControls;
        });
    };

    return (
        <div className={[classes.root, classes.stack].join(" ")}>
            <div className={classes.group}>
                {Object.entries(wizardControls).map(([id, controls]) => (
                    <div className={classes.stack} key={id}>
                        <Slider
                            name="Speed"
                            min={1}
                            value={controls.speed}
                            onChange={(e) =>
                                handleWizardControlChange(id, "speed", Number(e.target.value))
                            }
                        />
                        <Slider
                            name="Shooting Speed"
                            min={1}
                            max={20}
                            value={controls.shootingSpeed}
                            onChange={(e) =>
                                handleWizardControlChange(
                                    id,
                                    "shootingSpeed",
                                    Number(e.target.value)
                                )
                            }
                        />
                        <Slider
                            name="Projectile Limit"
                            min={1}
                            max={200}
                            value={controls.projectileLimit}
                            onChange={(e) =>
                                handleWizardControlChange(
                                    id,
                                    "projectileLimit",
                                    Number(e.target.value)
                                )
                            }
                        />
                        <Checkbox
                            name="Projectile Bounce"
                            checked={controls.projectileBounce}
                            onChange={(e) =>
                                handleWizardControlChange(id, "projectileBounce", e.target.checked)
                            }
                        />
                    </div>
                ))}
            </div>
            <button className={classes.reset} onClick={onReset}>
                Reset
            </button>
        </div>
    );
};
