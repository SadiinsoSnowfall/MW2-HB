import './assets/stylesheets/styles.scss';

import { screen } from './screen';
import { Scene } from './engine/scene';
import { FPSMetter} from './game/prefabs/debugPrefabs';
import { Assets, sleep, assert } from './utils';
import { InputManager, MouseAction } from './utils/inputManager';
import * as BP from './game/prefabs/blockPrefabs';
import { BlockBehaviour } from './game/components/blockComponents';
import { GameObject } from './engine/gameObject';
import { square, wanderer } from './game/prefabs/debugPrefabs';
import { Vec2 } from './engine/utils';
import { ConvexPolygon, intersection, Circle } from './engine/shapes';
import { Collider } from './engine/components';
import { ShapeDisplay } from './game/components/debugComponents';

async function game() {
    await Assets.load();

    const ctx = screen.getContext();
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, screen.width, screen.height);

    const scene = new Scene();

    scene.instantiate(FPSMetter, 600, 120);
    screen.setScene(scene);

    // Resistance test
    /*breakAnimation([
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
            await sleep(500);
            for (let i = 0; i < bhv.length; i++) {
                const cur = bhv[i];
                if (cur.getHealth() <= 0) {
                    // ressurect
                    objs[i].setEnabled(true);
                    cur.setHealth(cur.maxHealth);
                    scene.addObject(objs[i]);
                } else {
                    cur.applyDamage(10);
                }
            }
        }
    }*/

    // AABB tree test
    /*scene.instantiate(square, 100, 200);
    scene.instantiate(square, 200, 225);
    scene.instantiate(square, 400, 400);
    scene.instantiate(square, 500, 425);
    scene.instantiate(square, 300, 312);
    scene.instantiate(wanderer, 300, 350);

    const nb = 10;
    for (let i = 0; i < nb; i++) {
        for (let j = 0; j < nb; j++) {
            scene.instantiate(wanderer, 100 + i * 50, 300 + j * 50);
        }
    }*/

    let xw = 50;
    let yw = 50;
    InputManager.subscribe("w", () => {
        scene.instantiate(wanderer, xw, yw);
        xw += 10;
        yw += 10;
    });
    InputManager.subscribeMouse(MouseAction.LEFT_CLICK, (p: Vec2) => {
        console.log("click");
        scene.instantiate(wanderer, p.x, p.y);
    });

    // Polygon collision detection test
    //scene.instantiate(wanderer, 500, 500); // Just so something is displayed
    const offset = 500;
    const scale = 100;

    function tr(x: number): number {
        return x * scale + offset;
    }

    function test(p1: any, p2: any, expected: boolean) {
        assert(
            (intersection(p1.p, p2.p) == null) != expected,
            `${p1.n} vs ${p2.n} failed`
        );
    }

    function lol(p: any, color: string) {
        test(p, p, true);
        let obj = new GameObject(0, 0);
        obj.setColliderComponent(new Collider(obj, p.p));
        obj.setDisplayComponent(new ShapeDisplay(obj, p.p, color));
        scene.addObject(obj);
        return p;
    }

    function makeSquare(name: string, color: string, x: number, y: number, side: number) {
        side = (side * scale) /2;
        x = tr(x);
        y = tr(y);
        let maxX = x + side;
        let minX = x - side;
        let maxY = y + side;
        let minY = y - side;
        let r = {
            n: name,
            p: new ConvexPolygon(Vec2.Zero, [
                new Vec2(minX, maxY),
                new Vec2(maxX, maxY),
                new Vec2(maxX, minY),
                new Vec2(minX, minY)
            ])
        };
        assert(r.p.pointIn(new Vec2(x, y)), `${name} does not contain its own center`);
        return lol(r, color);
    }

    function makeTriangle(name: string, color: string, x1: number, y1: number, x2: number, y2: number, x3: number, y3: number) {
        let r = {
            n: name,
            p: new ConvexPolygon(Vec2.Zero, [
                new Vec2(tr(x1), tr(y1)),
                new Vec2(tr(x2), tr(y2)),
                new Vec2(tr(x3), tr(y3))
            ])
        };
        return lol(r, color);
    }

    function makeCircle(name: string, color: string, x: number, y: number, radius: number) {
        let center = new Vec2(tr(x), tr(y));
        let r = {
            n: name,
            p: new Circle(center, radius * scale)
        };
        assert(r.p.pointIn(center), `${name} does not contain its own center`);
        return lol(r, color);
    }

    let a = new Vec2(5, -10);
    let b = Vec2.normalVector(a);
    assert(b.x == 10 && b.y == 5, "Vec2#normal failed");

    let p01 = makeSquare("p01", "#FF7777", -2, 2, 2);
    let p02 = makeSquare("p02", "#FF77FF", 2, 2, 2);
    let p03 = makeSquare("p03", "#7777FF", 0, 0, 2);
    let p04 = makeTriangle("p04", "#FFFF77", 1, 2, -1, 0, -2, 2);
    let p05 = makeTriangle("p05", "#77FFFF", 0.82, 1.29, -0.24, -0.51, 4.26, 1.01);
    let p06 = makeCircle("p06", "#FF7733", 0, 2, 1);

    test(p01, p02, false);
    test(p01, p03, true);
    test(p02, p03, true);
    test(p04, p05, false);
    test(p01, p04, true);
    test(p01, p05, false);
    test(p02, p04, true);
    test(p02, p05, true);
    test(p03, p04, true);
    test(p03, p05, true);

    test(p01, p06, true);
    test(p02, p06, true);
    test(p03, p06, true);
    test(p04, p06, true);
    test(p05, p06, false);
}
game();