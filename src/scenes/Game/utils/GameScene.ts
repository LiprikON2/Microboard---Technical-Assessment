import { AppEventMap } from "~/App";
import { Wizard } from "./Wizard";
import { getRelativeCoordinates, isPointInCircle } from "./helpers";

export interface WizardClickEventDetail {
    wizardId: string;
    coords: { x: number; y: number };
    content: { color: string; active: boolean }[];
}
export interface WizardHitEventDetail {
    assaliantId: string;
    victimId: string;
}

export interface GameEventMap extends HTMLElementEventMap {
    wizardClick: MouseEvent & { detail: WizardClickEventDetail };
    wizardHit: MouseEvent & { detail: WizardHitEventDetail };
}

export class GameScene {
    private _projectileColors: string[] | null = null;
    private canvas: HTMLCanvasElement | null = null;
    private toDispose: (() => void)[] = [];
    wizards: Wizard[] = [];
    mouseCoords = { x: 0, y: 0 };

    constructor() {}

    get projectileColors() {
        if (this._projectileColors !== null) return this._projectileColors;
        const additionalColors = ["wheat", "orange"];
        const colors = [
            ...this.wizards.map((wizard) => wizard.projectileColor),
            ...additionalColors,
        ];
        const uniqueColors = [...new Set(colors)];

        this._projectileColors = uniqueColors;
        return this._projectileColors;
    }

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

        wizard.setActive(false);

        const wizardClickEvent = new CustomEvent<WizardClickEventDetail>("wizardClick", {
            bubbles: true,
            cancelable: false,
            composed: true,
            detail: {
                wizardId: wizard.id,
                coords,
                content: this.projectileColors.map((color) => ({
                    color,
                    active: wizard.projectileColor === color,
                })),
            },
        });
        dispatchEvent(wizardClickEvent);
    };

    handleWizardActivation = (e: AppEventMap["wizardActivation"]) => {
        const wizard = this.getWizardById(e.detail.wizardId);
        if (!wizard) return;

        wizard.setActive(e.detail.active);
    };

    handleWizardProjectileColorChange = (e: AppEventMap["wizardProjectileColor"]) => {
        const wizard = this.getWizardById(e.detail.wizardId);
        if (!wizard) return;

        wizard.setProjectileColor(e.detail.color);
    };

    getWizardById(id: string | null) {
        return this.wizards.find((wizard) => wizard.id === id) ?? null;
    }

    getClickedWizard() {
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
            id: "Pink Wizard",
            x: 10,
            y: 10,
            speed: 25,
            direction: Math.PI / 2,
            color: "pink",
            shootingDirection: 0,
        });
        const cyanWizard = new Wizard({
            id: "Cyan Wizard",
            x: 90,
            y: 40,
            speed: 20,
            direction: -(Math.PI / 2),
            color: "cyan",
            shootingDirection: Math.PI,
            projectileColor: "blue",
        });

        cyanWizard.addEnemy(pinkWizard);
        pinkWizard.addEnemy(cyanWizard);

        this.wizards.push(pinkWizard);
        this.wizards.push(cyanWizard);

        window.addEventListener("mousemove", this.handleMouseMove);
        window.addEventListener("click", this.handleClick);
        window.addEventListener<any>("wizardActivation", this.handleWizardActivation);
        window.addEventListener<any>(
            "wizardProjectileColor",
            this.handleWizardProjectileColorChange
        );

        const dispose = () => window.removeEventListener("mousemove", this.handleMouseMove);
        const dispose2 = () => window.removeEventListener("click", this.handleClick);
        const dispose3 = () =>
            window.removeEventListener<any>("wizardActivation", this.handleWizardActivation);
        const dispose4 = () =>
            window.removeEventListener<any>(
                "wizardProjectileColor",
                this.handleWizardProjectileColorChange
            );
        this.toDispose.push(dispose, dispose2, dispose3, dispose4);
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
