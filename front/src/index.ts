import './assets/stylesheets/styles.scss';

import { screen } from './screen';
import { Scene } from './engine/scene';
import { FPSMetter} from './game/prefabs/debugPrefabs';
import { Assets, sleep, assert, range, forcePickOne } from './utils';
import { InputManager, MouseAction } from './utils/inputManager';
import * as BP from './game/prefabs/blockPrefabs';
import { BlockBehaviour } from './game/components/blockComponents';
import { GameObject } from './engine/gameObject';
import { square, wanderer } from './game/prefabs/debugPrefabs';
import { Vec2 } from './engine/utils';
import { ConvexPolygon, intersection, Circle } from './engine/shapes';
import { Collider } from './engine/components';
import { ShapeDisplay } from './game/components/debugComponents';
import { createGround } from './game/prefabs/basePrefabs';

async function game() {
    await Assets.load();

    const ctx = screen.getContext();
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, screen.width, screen.height);

    const scene = new Scene();

    scene.instantiate(FPSMetter, 600, 120);
    screen.setScene(scene);

    InputManager.subscribeMouse(MouseAction.LEFT_CLICK, (p: Vec2) => {
        let obj = scene.instantiate(forcePickOne([
            BP.wooden_cube_md,
            BP.stone_cube_md,
            BP.ice_cube_md,
            BP.sand_cube_md
        ]), p.x ,p.y);

       setInterval(() => {
            (obj.behaviourComponent() as BlockBehaviour).applyDamage(10);
            console.log("applied 10 damages");
       }, 250);
    });

    scene.addObject(createGround(675, 800, 1200, 50));

    // Polygon collision detection test
    /*
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
    */
}
game();