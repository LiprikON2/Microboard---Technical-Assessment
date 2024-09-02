export const isPointInCircle = (
    point: { x: number; y: number },
    circle: { x: number; y: number; r: number }
) => {
    const { x, y } = point;
    const { x: circleX, y: circleY, r: radius } = circle;

    return (x - circleX) ** 2 + (y - circleY) ** 2 <= radius ** 2;
};

export const isPointInEllipse = (
    point: { x: number; y: number },
    ellipse: { x: number; y: number; width: number; height: number }
) => {
    const { x, y } = point;
    const { x: ellipseX, y: ellipseY, width, height } = ellipse;

    const a = width / 2;
    const b = height / 2;

    return (x - ellipseX) ** 2 / a ** 2 + (y - ellipseY) ** 2 / b ** 2 <= 1;
};

export const getRelativeCoordinates = (event: MouseEvent, element: HTMLCanvasElement) => {
    const rect = element.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    return { x, y };
};
