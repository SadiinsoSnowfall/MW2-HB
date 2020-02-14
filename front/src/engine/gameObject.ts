import { Transform } from './utils';
import { ObjectComponent } from './components';

export class GameObject {
    transform: Transform;
    components: ObjectComponent[];

    constructor(transform: Transform = Transform.Neutral, components: ObjectComponent[] = []) {
        this.transform = transform;
        this.components = components;
    }

    public tick(): void {
        
    }

}