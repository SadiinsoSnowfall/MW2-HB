import './assets/stylesheets/styles.scss';

import { screen } from './screen';
import { Scene } from './engine/scene';
import { FPSMetter} from './game/prefabs/debugPrefabs';
import { Assets, sleep } from './utils';
import { InputManager } from './utils/inputManager';
import { wooden_ball_md, stone_ball_md, ice_ball_md, sand_ball_md, wooden_ball_md_2, stone_ball_md_2, ice_ball_md_2 } from './game/prefabs/blockPrefabs';
import { BlockBehaviour } from './game/components/blockComponents';
import { GameObject } from './engine/gameObject';

async function game() {
    InputManager.init();
    await Assets.load();

    const ctx = screen.getContext();
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, screen.width, screen.height);

    const scene = new Scene();

    scene.instantiate(FPSMetter, 600, 120);
    screen.setScene(scene);

    breakAnimation([
        scene.instantiate(wooden_ball_md, 400, 400),
        scene.instantiate(stone_ball_md, 500, 400),
        scene.instantiate(ice_ball_md, 600, 400),
        scene.instantiate(sand_ball_md, 700, 400),
        scene.instantiate(wooden_ball_md_2, 800, 400),
        scene.instantiate(stone_ball_md_2, 900, 400),
        scene.instantiate(ice_ball_md_2, 1000, 400),
    ]);

    
    async function breakAnimation(objs: GameObject[]) {
        let bhv: BlockBehaviour[] = objs.map(obj => obj.behaviourComponent() as BlockBehaviour);

        while (true) {
            await sleep(500);
            for (let i = 0; i < bhv.length; i++) {
                const cur = bhv[i];
                if (cur.getHealth() <= 0) {
                    // ressurect
                    cur.setHealth(cur.maxHealth);
                    objs[i].setEnabled(true);
                } else {
                    cur.applyDamage(10);
                }
            }
        }
    }
}
game();