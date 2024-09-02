import React, { useState } from "react";

import classes from "./WizardScoreboard.module.css";
import { useWindowEvent } from "~/hooks";
import { GameEventMap } from "~/scenes";

// interface WizardScoreboardProps {
// }

export const WizardScoreboard = () => {
    const [scoreboard, setScorebard] = useState<{ [wizardId: string]: number }>({});

    useWindowEvent<GameEventMap, "wizardHit">("wizardHit", (e) => {
        setScorebard({ ...scoreboard });

        setScorebard((prevScoreboard) => ({
            ...prevScoreboard,
            [e.detail.assaliantId]: (prevScoreboard?.[e.detail.assaliantId] ?? 0) + 1,
        }));
    });

    return (
        <div className={classes.root}>
            {Object.entries(scoreboard).map(([id, score]) => (
                <div>
                    {id}: {score}
                </div>
            ))}
        </div>
    );
};
