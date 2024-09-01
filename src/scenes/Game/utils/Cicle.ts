export interface CircleOptions {
    /** Initial horizontal position of the center of the circle in percentage of the canvas width */
    x?: number;
    /** Initial vertical position of the center of the circle in percentage of the canvas height */
    y?: number;

    /** radius of the circle in percentange of the canvas height */
    radius?: number;
    /** Movement speed of the circle */
    speed?: number;
    /** Direction of movement of the circle, in radians */
    direction?: number;
    color?: string;
    bounce?: boolean;
}

const clamp = (number: number, min: number, max: number) => Math.max(min, Math.min(number, max));

export class Circle {
    private x: number;
    private y: number;
    private speed: number;
    private direction: number;
    private radius: number;
    private color: string;
    private bounce: boolean;

    constructor({
        x = 0,
        y = 0,
        speed = 0,
        direction = 0,
        radius = 5,
        color = "pink",
        bounce = false,
    }: CircleOptions) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.direction = direction;
        this.radius = radius;
        this.color = color;
        this.bounce = bounce;
    }

    get speedX() {
        const speedX = this.speed * Math.cos(this.direction) * 0.001;
        return speedX;
    }
    get speedY() {
        const speedY = this.speed * Math.sin(this.direction) * 0.001;
        return speedY;
    }

    /**
     *
     * @param ctx Canvas context
     * @param time
     * @param delta Time between previous and current frame
     * @param canvasSize Width and height of the canvas
     * @param options
     */
    draw(
        ctx: CanvasRenderingContext2D,
        time: number,
        delta: number,
        canvasSize: { width: number; height: number }
    ) {
        this.update(time, delta, canvasSize);
        ctx.fillStyle = this.color;
        ctx.beginPath();

        // ctx.arc(
        //     canvasSize.width * Math.sin(time * this.speedX * 0.001) ** 2,
        //     canvasSize.height * Math.sin(time * this.speedY * 0.01) ** 2,
        //     (this.radius + this.radius * 0.2 * Math.sin(time * 0.001) ** 2) *
        //         canvasSize.height *
        //         0.01,
        //     0,
        //     2 * Math.PI
        // );

        ctx.arc(
            canvasSize.width * this.x * 0.01,
            canvasSize.height * this.y * 0.01,
            this.radius * canvasSize.height * 0.01,
            0,
            2 * Math.PI
        );

        ctx.fill();
    }

    update(time: number, delta: number, canvasSize: { width: number; height: number }) {
        const minX = (this.radius * canvasSize.height) / canvasSize.width;
        const maxX = 100 - minX;
        const x = clamp(this.x + this.speedX * delta, minX, maxX);

        const minY = this.radius;
        const maxY = 100 - minY;
        const y = clamp(this.y + this.speedY * delta, minY, maxY);

        if (this.bounce) {
            if (x <= minX || x >= maxX) {
                // Reverse direction horizontally
                this.direction = Math.PI - this.direction;
            }

            if (y <= minY || y >= maxY) {
                // Reverse direction vertically
                this.direction = -this.direction;
            }
        }

        this.x = x;
        this.y = y;
    }
}
