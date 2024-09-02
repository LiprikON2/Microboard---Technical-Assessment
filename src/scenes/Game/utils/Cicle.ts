import { dir } from "console";
import { clamp, randomId } from "~/utils";

export interface CircleOptions {
    id?: string;
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
    visible?: boolean;
    active?: boolean;
}

export class Circle {
    id: string;
    x: number;
    y: number;
    radius: number;
    speed: number;
    direction: number;
    color: string;
    bounce: boolean;
    visible: boolean;
    active: boolean;

    constructor({
        x = 0,
        y = 0,
        speed = 0,
        direction = 0,
        radius = 5,
        color = "pink",
        bounce = false,
        visible = true,
        active = true,
        id = randomId(),
    }: CircleOptions) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.direction = direction;
        this.radius = radius;
        this.color = color;
        this.bounce = bounce;
        this.visible = visible;
        this.active = active;
        this.id = id;
    }

    get speedX() {
        const speedX = this.speed * Math.cos(this.direction) * 0.001;
        return speedX;
    }
    get speedY() {
        const speedY = this.speed * Math.sin(this.direction) * 0.001;
        return speedY;
    }

    setVisible(visible: boolean) {
        this.visible = visible;
        return this;
    }
    setActive(active: boolean) {
        this.active = active;
        return this;
    }

    setDirection(direction: number) {
        this.direction = direction;
        return this;
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
        if (!this.visible) return;

        ctx.fillStyle = this.color;
        ctx.beginPath();

        ctx.arc(
            canvasSize.width * this.x * 0.01,
            canvasSize.height * this.y * 0.01,
            this.radius * canvasSize.height * canvasSize.width * 0.000008,
            0,
            2 * Math.PI
        );

        ctx.fill();
    }

    update(time: number, delta: number, canvasSize: { width: number; height: number }) {
        if (!this.active) return;

        let x = this.x + this.speedX * delta;
        let y = this.y + this.speedY * delta;

        if (!this.bounce) {
            this.x = x;
            this.y = y;
            return;
        }

        const minX = (this.radius * canvasSize.height) / canvasSize.width;
        const maxX = 100 - minX;
        x = clamp(x, minX, maxX);

        const minY = this.radius;
        const maxY = 100 - minY;
        y = clamp(y, minY, maxY);

        if (x <= minX || x >= maxX) {
            // Reverse direction horizontally
            this.direction = Math.PI - this.direction;
        }

        if (y <= minY || y >= maxY) {
            // Reverse direction vertically
            this.direction = -this.direction;
        }

        this.x = x;
        this.y = y;
    }
}
