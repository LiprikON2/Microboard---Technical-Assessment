export const randomId = () => Math.random().toString(36).substr(2, 9);

export const clamp = (number: number, min: number, max: number) =>
    Math.max(min, Math.min(number, max));
