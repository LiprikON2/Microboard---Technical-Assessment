import { useState } from "react";

import { useClickOutside, useElementSize, useMergedRef, useViewportSize } from "~/hooks";
import { clamp } from "~/utils";
import classes from "./Tooltip.module.css";

interface TooltipProps {
    x: number;
    y: number;
    visible?: boolean;
    onClose?: () => void;
    children?: React.ReactNode;
}

export const Tooltip = ({ x, y, visible = false, onClose = () => {}, children }: TooltipProps) => {
    const { height: viewportHeight, width: viewportWidth } = useViewportSize();
    const { ref: sizeRef, width } = useElementSize();
    const clickOutsideRef = useClickOutside(onClose);
    const ref = useMergedRef(sizeRef, clickOutsideRef);

    const getTooltipPosStyle = (
        x: number,
        y: number,
        viewportWidth: number,
        viewportHeight: number
    ) => {
        const bottomRightStyle = {
            left: clamp(x, 0, viewportWidth),
            top: clamp(y, 0, viewportHeight),
        };
        const topRightStyle = {
            left: clamp(x, 0, viewportWidth),
            bottom: clamp(viewportHeight - y, 0, viewportHeight),
        };
        const topLeftStyle = {
            right: clamp(viewportWidth - x, 0, viewportWidth),
            bottom: clamp(viewportHeight - y, 0, viewportHeight),
        };
        const bottomLeftStyle = {
            right: clamp(viewportWidth - x, 0, viewportWidth),
            top: clamp(y, 0, viewportHeight),
        };

        if (y > viewportHeight / 2) {
            if (x + width > viewportWidth) return topLeftStyle;
            else return topRightStyle;
        } else {
            if (x + width > viewportWidth) return bottomLeftStyle;
            else return bottomRightStyle;
        }
    };

    return (
        <div
            ref={ref}
            style={{
                visibility: visible ? "visible" : "hidden",
                ...getTooltipPosStyle(x, y, viewportWidth, viewportHeight),
            }}
            className={classes.tooltip}
        >
            {children}
        </div>
    );
};
