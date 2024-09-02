import { randomId } from "~/utils";
import classes from "./Slider.module.css";

interface SliderProps {
    name: string;
    value?: number;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    min?: number;
    max?: number;
}

export const Slider = ({ name, value, onChange, min = 0, max = 100 }: SliderProps) => {
    const id = randomId();

    return (
        <div className={classes.root}>
            <label className={classes.label} htmlFor={id}>
                {name}
            </label>
            <input type="range" min={min} max={max} value={value} id={id} onChange={onChange} />
        </div>
    );
};
