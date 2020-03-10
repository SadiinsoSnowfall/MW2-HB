import { Behaviour } from "../../engine/components";
import { GameObject } from "../../engine/gameObject";

export abstract class Damagable extends Behaviour  {
    protected readonly maxHealth: number;
    protected health: number;

    constructor(o: GameObject, health: number) {
        super(o);
        this.maxHealth = this.health = health;
    }

    public getHealth() {
        return this.health;
    }

    public getMaxHealth() {
        return this.maxHealth;
    }

    public setHealth(health: number) {
        this.health = health;
    }

    public applyDamage(damage: number) {
        this.health -= damage;
    }

    public restoreHealth() {
        this.health = this.maxHealth;
    }

}