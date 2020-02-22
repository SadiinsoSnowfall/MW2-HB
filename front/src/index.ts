import './assets/stylesheets/styles.scss';

import { screen } from './screen';
import { Scene } from './engine/scene';
import { FPSMetter} from './game/prefabs/debugPrefabs';
import { Assets, sleep } from './utils';
import { InputManager } from './utils/inputManager';
import * as BP from './game/prefabs/blockPrefabs';
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
        scene.instantiate(BP.wooden_ball_md, 100, 300),
        scene.instantiate(BP.stone_ball_md, 200, 300),
        scene.instantiate(BP.ice_ball_md, 300, 300),
        scene.instantiate(BP.sand_ball_md, 400, 300),
        scene.instantiate(BP.wooden_ball_md_2, 500, 300),
        scene.instantiate(BP.stone_ball_md_2, 600, 300),
        scene.instantiate(BP.ice_ball_md_2, 700, 300),

        scene.instantiate(BP.wooden_ball_sm, 100, 400),
        scene.instantiate(BP.stone_ball_sm, 200, 400),
        scene.instantiate(BP.ice_ball_sm, 300, 400),
        scene.instantiate(BP.wooden_ball_sm_2, 500, 400),
        scene.instantiate(BP.stone_ball_sm_2, 600, 400),
        scene.instantiate(BP.ice_ball_sm_2, 700, 400),



        scene.instantiate(BP.wooden_cube_md, 100, 500),
        scene.instantiate(BP.stone_cube_md, 200, 500),
        scene.instantiate(BP.ice_cube_md, 300, 500),
        scene.instantiate(BP.sand_cube_md, 400, 500),

        scene.instantiate(BP.wooden_cube_sm, 100, 600),
        scene.instantiate(BP.stone_cube_sm, 200, 600),
        scene.instantiate(BP.ice_cube_sm, 300, 600),
        scene.instantiate(BP.wooden_cube_sm_2, 500, 600),
        scene.instantiate(BP.stone_cube_sm_2, 600, 600),
        scene.instantiate(BP.ice_cube_sm_2, 700, 600),

        scene.instantiate(BP.wooden_cube_xs, 100, 700),
        scene.instantiate(BP.stone_cube_xs, 200, 700),
        scene.instantiate(BP.ice_cube_xs, 300, 700),
        scene.instantiate(BP.wooden_cube_xs_2, 500, 700),
        scene.instantiate(BP.stone_cube_xs_2, 600, 700),
        scene.instantiate(BP.ice_cube_xs_2, 700, 700),

        scene.instantiate(BP.wooden_cube_hl, 100, 800),
        scene.instantiate(BP.stone_cube_hl, 200, 800),
        scene.instantiate(BP.ice_cube_hl, 300, 800),
        scene.instantiate(BP.wooden_cube_hl_2, 500, 800),
        scene.instantiate(BP.stone_cube_hl_2, 600, 800),
        scene.instantiate(BP.ice_cube_hl_2, 700, 800),



        scene.instantiate(BP.wooden_tris_md, 800, 300),
        scene.instantiate(BP.stone_tris_md, 900, 300),
        scene.instantiate(BP.ice_tris_md, 1000, 300),
        scene.instantiate(BP.sand_tris_md, 1100, 300),
        scene.instantiate(BP.wooden_tris_md_2, 1200, 300),
        scene.instantiate(BP.stone_tris_md_2, 1300, 300),
        scene.instantiate(BP.ice_tris_md_2, 1400, 300),

        scene.instantiate(BP.wooden_tris_sm, 800, 400),
        scene.instantiate(BP.stone_tris_sm, 900, 400),
        scene.instantiate(BP.ice_tris_sm, 1000, 400),
        scene.instantiate(BP.sand_tris_sm, 1100, 400),

        scene.instantiate(BP.wooden_tris_hl, 800, 500),
        scene.instantiate(BP.stone_tris_hl, 900, 500),
        scene.instantiate(BP.ice_tris_hl, 1000, 500),
        scene.instantiate(BP.wooden_tris_hl_2, 1200, 500),
        scene.instantiate(BP.stone_tris_hl_2, 1300, 500),
        scene.instantiate(BP.ice_tris_hl_2, 1400, 500),
    ]);

    
    async function breakAnimation(objs: GameObject[]) {
        let bhv: BlockBehaviour[] = objs.map(obj => obj.behaviourComponent() as BlockBehaviour);

        while (true) {
            await sleep(400);
            for (let i = 0; i < bhv.length; i++) {
                const cur = bhv[i];
                if (cur.getHealth() <= 0) {
                    // ressurect
                    objs[i].setEnabled(true);
                    cur.setHealth(cur.maxHealth);
                } else {
                    cur.applyDamage(10);
                }
            }
        }
    }
}
game();