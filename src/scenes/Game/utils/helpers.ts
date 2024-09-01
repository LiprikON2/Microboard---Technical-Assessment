export const clamp = (number: number, min: number, max: number) =>
    Math.max(min, Math.min(number, max));

export const isPointInCircle = (
    point: { x: number; y: number },
    circle: { x: number; y: number; r: number }
) => {
    const { x, y } = point;
    const { x: circleX, y: circleY, r: radius } = circle;

    return (x - circleX) ** 2 + (y - circleY) ** 2 <= radius ** 2;
};
