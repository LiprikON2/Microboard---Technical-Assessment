export const isPointInCircle = (
    point: { x: number; y: number },
    circle: { x: number; y: number; r: number }
) => {
    const { x, y } = point;
    const { x: circleX, y: circleY, r: radius } = circle;

    return (x - circleX) ** 2 + (y - circleY) ** 2 <= radius ** 2;
};

export const getRelativeCoordinates = (event: MouseEvent, element: HTMLCanvasElement) => {
    const rect = element.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    return { x, y };
};
