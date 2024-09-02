import { randomId } from "~/utils";
import classes from "./Checkbox.module.css";

interface CheckboxProps {
    name: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    checked?: boolean;
}

export const Checkbox = ({ name, checked, onChange = () => {}, ...rest }: CheckboxProps) => {
    const id = randomId();

    return (
        <div className={classes.root}>
            <input
                checked={checked}
                type="checkbox"
                id={id}
                name={name}
                onChange={onChange}
                {...rest}
            />
            <label htmlFor={id}>{name}</label>
        </div>
    );
};
