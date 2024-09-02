import { Circle, CircleOptions } from "./Circle";
import { WizardHitEventDetail } from "./GameScene";
import { ProjectileBuffer } from "./ProjectileBuffer";
import { isPointInEllipse } from "./helpers";

export type WizardOptions = Omit<CircleOptions, "bounce"> & {
    shootingSpeed?: number;
    shootingDirection?: number;
    projectileSpeed?: number;
    /** The limit of the maximum amount of projectiles spawned by this wizard */
    projectileLimit?: number;
    projectileColor?: string;
    projectileBounce?: boolean;
};

export class Wizard extends Circle {
    private projectiles: ProjectileBuffer<Circle>;
    private lastShotTime: number = -Infinity;

    shootingSpeed: number;
    shootingDirection: number;
    projectileSpeed: number;
    projectileColor: string;
    projectileBounce: boolean;
    enemies: Wizard[] = [];

    constructor(options: WizardOptions) {
        super({ ...options, bounce: true });

        const {
            shootingSpeed = 10,
            shootingDirection = 0,
            projectileSpeed = 40,
            projectileLimit = 50,
            projectileColor = "red",
            projectileBounce = false,
        } = options;

        this.shootingSpeed = shootingSpeed;
        this.shootingDirection = shootingDirection;
        this.projectileSpeed = projectileSpeed;
        this.projectileColor = projectileColor;
        this.projectileBounce = projectileBounce;
        this.projectiles = new ProjectileBuffer(projectileLimit);
    }

    setProjectileColor(projectileColor: string) {
        this.projectileColor = projectileColor;
        return this;
    }

    setProjectileBounce(projectileBounce: boolean) {
        this.projectileBounce = projectileBounce;
        return this;
    }
    setShootingSpeed(shootingSpeed: number) {
        this.shootingSpeed = shootingSpeed;
        return this;
    }
    get projectileLimit() {
        return this.projectiles.bufferLength;
    }
    setProjectileLimit(projectileLimit: number) {
        this.projectiles.setBufferLength(projectileLimit);
        return this;
    }

    addEnemy(enemy: Wizard) {
        this.enemies.push(enemy);
        return this;
    }

    shoot() {
        const projectile = new Circle({
            x: this.x,
            y: this.y,
            direction: this.shootingDirection,
            speed: this.projectileSpeed,
            color: this.projectileColor,
            radius: this.radius * 0.2,
            bounce: this.projectileBounce,
        });
        this.projectiles.push(projectile);
    }

    update(time: number, delta: number, canvasSize: { width: number; height: number }) {
        super.update(time, delta, canvasSize);

        const cooldownTime = 1000 / this.shootingSpeed;
        if (time - this.lastShotTime > cooldownTime) {
            this.shoot();
            this.lastShotTime = time;
        }
    }

    draw(
        ctx: CanvasRenderingContext2D,
        time: number,
        delta: number,
        canvasSize: { width: number; height: number }
    ) {
        this.projectiles.forEach((projectile) => {
            this.enemies.forEach((enemy) => {
                const aspectRatio = canvasSize.width / canvasSize.height;

                if (
                    isPointInEllipse(
                        { x: projectile.x, y: projectile.y },
                        {
                            x: enemy.x,
                            y: enemy.y,
                            width: (enemy.radius * 2) / aspectRatio,
                            height: enemy.radius * 2,
                        }
                    )
                ) {
                    if (!projectile.active) return;
                    projectile.setVisible(false).setActive(false);
                    const wizardHitEvent = new CustomEvent<WizardHitEventDetail>("wizardHit", {
                        bubbles: true,
                        cancelable: false,
                        composed: true,
                        detail: {
                            assaliantId: this.id,
                            victimId: enemy.id,
                        },
                    });
                    dispatchEvent(wizardHitEvent);
                }
            });

            projectile.draw(ctx, time, delta, canvasSize);
        });
        super.draw(ctx, time, delta, canvasSize);
    }
}
