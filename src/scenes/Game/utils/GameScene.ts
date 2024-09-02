import { AppEventMap } from "~/App";
import { Wizard } from "./Wizard";
import { getRelativeCoordinates, isPointInEllipse } from "./helpers";

export interface WizardClickEventDetail {
    wizardId: string;
    coords: { x: number; y: number };
    content: { color: string; active: boolean }[];
}
export interface WizardHitEventDetail {
    assaliantId: string;
    victimId: string;
}

export interface WizardControls {
    shootingSpeed: number;
    projectileLimit: number;
    projectileBounce: boolean;
    speed: number;
}
export type WizardControlsEventDetail = {
    [wizardId: string]: WizardControls;
};

export interface GameEventMap extends HTMLElementEventMap {
    wizardClick: CustomEvent & { detail: WizardClickEventDetail };
    wizardHit: CustomEvent & { detail: WizardHitEventDetail };
    wizardControls: CustomEvent & { detail: WizardControlsEventDetail };
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
    handleWizardControlChange = (e: AppEventMap["wizardControlChange"]) => {
        const wizard = this.getWizardById(e.detail.wizardId);
        if (!wizard) return;

        const { speed, shootingSpeed, projectileLimit, projectileBounce } = e.detail.controls;

        wizard
            .setSpeed(speed)
            .setShootingSpeed(shootingSpeed)
            .setProjectileLimit(projectileLimit)
            .setProjectileBounce(projectileBounce);
    };

    dispatchWizardControls() {
        const wizardControlsEntries = this.wizards.map((wizard) => [
            wizard.id,
            {
                shootingSpeed: wizard.shootingSpeed,
                projectileLimit: wizard.projectileLimit,
                projectileBounce: wizard.projectileBounce,
                speed: wizard.speed,
            },
        ]);

        const wizardControlsEvent = new CustomEvent<WizardControlsEventDetail>("wizardControls", {
            bubbles: true,
            cancelable: false,
            composed: true,
            detail: Object.fromEntries(wizardControlsEntries),
        });
        dispatchEvent(wizardControlsEvent);
    }

    getWizardById(id: string | null) {
        return this.wizards.find((wizard) => wizard.id === id) ?? null;
    }

    getClickedWizard() {
        for (const wizard of this.wizards) {
            const aspectRatio = this.canvasSize.width / this.canvasSize.height;

            if (
                isPointInEllipse(
                    { x: this.mouseCoords.x, y: this.mouseCoords.y },
                    {
                        x: wizard.x,
                        y: wizard.y,
                        width: (wizard.radius * 2) / aspectRatio,
                        height: wizard.radius * 2,
                    }
                )
            ) {
                return wizard;
            }
        }

        return null;
    }

    init = (canvas: HTMLCanvasElement) => {
        this.canvas = canvas;
        this.create();
    };

    addEventListener<K extends keyof AppEventMap>(
        type: K,
        listener: (event: AppEventMap[K]) => void
    ) {
        const wrappedListener = listener.bind(this);
        window.addEventListener(type, wrappedListener as EventListener);

        this.toDispose.push(() => {
            window.removeEventListener(type, wrappedListener as EventListener);
        });
    }

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

        this.addEventListener("mousemove", this.handleMouseMove);
        this.addEventListener("click", this.handleClick);
        this.addEventListener("wizardActivation", this.handleWizardActivation);
        this.addEventListener("wizardProjectileColor", this.handleWizardProjectileColorChange);
        this.addEventListener("wizardControlChange", this.handleWizardControlChange);
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
            const aspectRatio = canvasSize.width / canvasSize.height;

            if (
                isPointInEllipse(
                    { x: this.mouseCoords.x, y: this.mouseCoords.y },
                    {
                        x: wizard.x,
                        y: wizard.y,
                        width: (wizard.radius * 2) / aspectRatio,
                        height: wizard.radius * 2,
                    }
                )
            ) {
                wizard.setDirection(-wizard.direction);
            }

            wizard.draw(ctx, time, delta, canvasSize);
        });
        this.dispatchWizardControls();
    };

    dispose = () => {
        this.toDispose.forEach((dispose) => dispose());
        this.toDispose = [];
    };

    get canvasSize() {
        const { devicePixelRatio: ratio = 1 } = window;
        const canvasSize = {
            height: this.canvas!.height / ratio,
            width: this.canvas!.width / ratio,
        };

        return canvasSize;
    }

    updateMouseCoords(mousePixelCoords: { x: number; y: number }) {
        const mouseCoords = {
            x: (mousePixelCoords.x / this.canvasSize.width) * 100,
            y: (mousePixelCoords.y / this.canvasSize.height) * 100,
        };
        this.mouseCoords = mouseCoords;
    }
}
