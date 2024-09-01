import { Circle, CircleOptions } from "./Cicle";
import { ProjectileBuffer } from "./ProjectileBuffer";
import { isPointInCircle } from "./helpers";

export type WizardOptions = Omit<CircleOptions, "bounce"> & {
    shootingSpeed?: number;
    shootingDirection?: number;
    projectileSpeed?: number;
    /** The limit of the maximum amount of projectiles spawned by this wizard */
    projectileLimit?: number;
};

export class Wizard extends Circle {
    private shootingIntervalId: NodeJS.Timeout | null = null;
    private projectiles: ProjectileBuffer<Circle>;
    private lastShotTime: number = -Infinity;

    private shootingSpeed: number;
    private shootingDirection: number;
    private projectileSpeed: number;
    private enemies: Wizard[] = [];

    constructor(options: WizardOptions) {
        super({ ...options, bounce: true });

        const {
            shootingSpeed = 10,
            shootingDirection = 0,
            projectileSpeed = 40,
            projectileLimit = 50,
        } = options;

        this.shootingSpeed = shootingSpeed;
        this.shootingDirection = shootingDirection;
        this.projectileSpeed = projectileSpeed;
        this.projectiles = new ProjectileBuffer(projectileLimit);
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
            color: "red",
            radius: this.radius * 0.2,
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
                if (
                    isPointInCircle(
                        { x: projectile.x, y: projectile.y },
                        { x: enemy.x, y: enemy.y, r: enemy.radius }
                    )
                ) {
                    projectile.setVisible(false);
                }
            });

            projectile.draw(ctx, time, delta, canvasSize);
        });
        super.draw(ctx, time, delta, canvasSize);
    }
}
