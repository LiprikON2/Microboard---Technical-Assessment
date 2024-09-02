import { Wizard } from "./Wizard";
import { getRelativeCoordinates, isPointInCircle } from "./helpers";

interface WizardClickEventDetail {
    coords: { x: number; y: number };
}
export interface GameEventMap extends HTMLElementEventMap {
    wizardClick: MouseEvent & { detail: WizardClickEventDetail };
}

export class GameScene {
    private canvas: HTMLCanvasElement | null = null;
    private toDispose: (() => void)[] = [];
    wizards: Wizard[] = [];
    mouseCoords = { x: 0, y: 0 };

    constructor() {}

    handleMouseMove = (e: MouseEvent) => {
        const coords = getRelativeCoordinates(e, this.canvas!);
        this.updateMouseCoords(coords);

        // console.log(`X: ${coords.x}, Y: ${coords.y}`);
    };
    handleClick = (e: MouseEvent) => {
        const coords = getRelativeCoordinates(e, this.canvas!);
        this.updateMouseCoords(coords);

        const wizard = this.getClickedWizard();
        if (!wizard) return;

        const wizardClickEvent = new CustomEvent<WizardClickEventDetail>("wizardClick", {
            bubbles: true,
            cancelable: false,
            composed: true,
            detail: {
                coords,
            },
        });
        dispatchEvent(wizardClickEvent);
    };

    getClickedWizard() {
        // this.mouseCoords
        for (const wizard of this.wizards) {
            if (isPointInCircle(this.mouseCoords, { x: wizard.x, y: wizard.y, r: wizard.radius })) {
                return wizard;
            }
        }

        return null;
    }

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

        window.addEventListener("mousemove", this.handleMouseMove);
        window.addEventListener("click", this.handleClick);

        const dispose = () => window.removeEventListener("mousemove", this.handleMouseMove);
        const dispose2 = () => window.removeEventListener("click", this.handleClick);
        this.toDispose.push(dispose, dispose2);
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
            }

            wizard.draw(ctx, time, delta, canvasSize);
        });
    };

    dispose = () => {
        console.log("disposing", this.toDispose.length);
        this.toDispose.forEach((dispose) => dispose());
        this.toDispose = [];
    };

    updateMouseCoords(mousePixelCoords: { x: number; y: number }) {
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
