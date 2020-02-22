import './assets/stylesheets/styles.scss';

import { screen } from './screen';
import { Scene } from './engine/scene';
import { FPSMetter} from './game/prefabs/debugPrefabs';
import { Assets } from './utils';
import { InputManager } from './utils/inputManager';
import { wooden_cube_md } from './game/prefabs/blockPrefabs';
import { BlockBehaviour } from './game/components/blockComponents';

async function game() {
    InputManager.init();
    await Assets.load();

    const ctx = screen.getContext();
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, screen.width, screen.height);

    const scene = new Scene();

    scene.instantiate(FPSMetter, 600, 120);

    let cube = scene.instantiate(wooden_cube_md, 600, 400);

    setTimeout(() => {
        let b = cube.behaviourComponent() as BlockBehaviour;
        console.log('applying');
        b.applyDamage(10);
    }, 1500);

    screen.setScene(scene);
}
game();