import { Wizard } from "./Wizard";
import { getRelativeCoordinates, isPointInCircle } from "./helpers";

export class GameScene {
    canvas: HTMLCanvasElement | null = null;
    wizards: Wizard[] = [];
    mouseCoords = { x: 0, y: 0 };

    toDispose: (() => void)[] = [];

    constructor() {}

    handleMouseEvent = (e: MouseEvent) => {
        const coords = getRelativeCoordinates(e, this.canvas!);
        this.checkMouseWizardCollision(coords);
        // console.log(`X: ${coords.x}, Y: ${coords.y}`);
    };

    init = (canvas: HTMLCanvasElement) => {
        this.canvas = canvas;
        this.create();
    };

    create() {
        const pinkWizard = new Wizard({
            x: 10,
            y: 10,
            speed: 25,
            direction: Math.PI / 2,
            color: "pink",
            shootingDirection: 0,
        });
        const cyanWizard = new Wizard({
            x: 90,
            y: 40,
            speed: 20,
            direction: -(Math.PI / 2),
            color: "cyan",
            shootingDirection: Math.PI,
        });

        cyanWizard.addEnemy(pinkWizard);
        pinkWizard.addEnemy(cyanWizard);

        this.wizards.push(pinkWizard);
        this.wizards.push(cyanWizard);

        window.addEventListener("mousemove", this.handleMouseEvent);

        const dispose = () => window.removeEventListener("mousemove", this.handleMouseEvent);
        this.toDispose.push(dispose);
    }

    preUpdate = (ctx: CanvasRenderingContext2D) => {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    };

    update = (
        ctx: CanvasRenderingContext2D,
        time: number,
        delta: number,
        canvasSize: { width: number; height: number }
    ) => {
        this.wizards.forEach((wizard) => {
            if (isPointInCircle(this.mouseCoords, { x: wizard.x, y: wizard.y, r: wizard.radius })) {
                wizard.setDirection(-wizard.direction);
                console.log("this.mouseCoords", this.mouseCoords, {
                    x: wizard.x,
                    y: wizard.y,
                    r: wizard.radius,
                });
            }

            wizard.draw(ctx, time, delta, canvasSize);
        });
    };

    dispose = () => {
        console.log("disposing", this.toDispose.length);
        this.toDispose.forEach((dispose) => dispose());
        this.toDispose = [];
    };

    checkMouseWizardCollision(mousePixelCoords: { x: number; y: number }) {
        const { devicePixelRatio: ratio = 1 } = window;
        const canvasSize = {
            height: this.canvas!.height / ratio,
            width: this.canvas!.width / ratio,
        };

        const mouseCoords = {
            x: (mousePixelCoords.x / canvasSize.width) * 100,
            y: (mousePixelCoords.y / canvasSize.height) * 100,
        };

        this.mouseCoords = mouseCoords;
    }
}
