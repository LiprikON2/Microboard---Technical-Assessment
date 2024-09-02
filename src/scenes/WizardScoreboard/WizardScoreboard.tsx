import { useState } from "react";

import { useWindowEvent } from "~/hooks";
import { GameEventMap } from "~/scenes";
import classes from "./WizardScoreboard.module.css";

export const WizardScoreboard = () => {
    const [scoreboard, setScorebard] = useState<{ [wizardId: string]: number }>({});

    useWindowEvent<GameEventMap, "wizardHit">("wizardHit", (e) => {
        setScorebard((prevScoreboard) => ({
            ...prevScoreboard,
            [e.detail.assaliantId]: (prevScoreboard?.[e.detail.assaliantId] ?? 0) + 1,
        }));
    });

    return (
        <div className={classes.root}>
            {Object.entries(scoreboard).map(([id, score]) => (
                <div key={id}>
                    {id}: {score}
                </div>
            ))}
        </div>
    );
};
