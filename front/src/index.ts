import './assets/stylesheets/styles.scss';

import { screen } from './screen';
import { Scene } from './engine/scene';
import { FPSMetter} from './game/prefabs/debugPrefabs';
import { Assets, sleep, assert, range, forcePickOne, loadLevel } from './utils';
import { InputManager, MouseAction } from './utils/inputManager';
import * as BP from './game/prefabs/blockPrefabs';
import * as LL from './utils/levelsManager'
import { BlockBehaviour } from './game/components/blockComponents';
import { GameObject } from './engine/gameObject';
import { square, wanderer } from './game/prefabs/debugPrefabs';
import { Vec2 } from './engine/utils';
import { ConvexPolygon, intersection, Circle } from './engine/physics';
import { Collider } from './engine/components';
import { ShapeDisplay, CollisionDisplay } from './game/components/debugComponents';
import { createGround } from './game/prefabs/basePrefabs';

async function game() {
    await Assets.load();

    const ctx = screen.getContext();
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, screen.width, screen.height);

    const scene = new Scene();

    scene.instantiate(FPSMetter, 600, 120);
    screen.setScene(scene);

    let objs: GameObject[] = []

    let index = -1;
    let particle = [
        BP.wood_particle,
        BP.stone_particle,
        BP.ice_particle,
    ];

    // await loadLevel(0, scene); // need to spin up the server

    InputManager.subscribeMouse(MouseAction.MIDDLE_CLICK, (p: Vec2) => {
        for (const x of range(15)) {
            for (const y of range(8)) {
                objs.push(scene.instantiate(forcePickOne([
                    BP.stone_tris_md_2,
                ]), x * 60 , y * 60 + 200));
            }
        }
    });

    InputManager.subscribeMouse(MouseAction.RIGHT_CLICK, (p: Vec2) => {
        if (++index >= particle.length) index = 0;
        scene.addObject(particle[index](p.x, p.y, 1000, 3, 10));
    });

    InputManager.subscribeMouse(MouseAction.LEFT_CLICK, (p: Vec2) => {
        objs.push(scene.instantiate(forcePickOne([
            BP.wooden_cube_hl_2,
            //BP.stone_cube_hl_2,
            //BP.ice_cube_hl_2
        ]), p.x ,p.y));

    });

    // ugly af, only for demonstration purpose
    /*
    setInterval(() => {
        for (const obj of objs) {
            if (obj.isEnabled()) {
                (obj.getBehaviour() as BlockBehaviour).applyDamage(10);
            }
        }
   }, 250);
   */

    //scene.addObject(createGround(675, 800, 1200, 50));

    // Polygon collision detection test
    const offset = 500;
    const scale = 100;

    function tr(x: number): number {
        return x * scale + offset;
    }

    function test(p1: any, p2: any, expected: boolean) {
        function intersect(a: any, b: any) {
            let c = intersection(a.obj.getCollider(), a.p, b.obj.getCollider(), b.p);
            assert((c == null) != expected, `${a.n} vs ${b.n} failed`);
            if (c != null && a != b) {
                console.log(`${a.n} vs ${b.n} displayed`);
                let o = new GameObject(0, 0);
                o.setDisplay(new CollisionDisplay(o, c));
                scene.addObject(o);
            }
        }

        intersect(p1, p2);
        intersect(p2, p1);
    }

    function lol(p: any, color: string) {
        let obj = new GameObject(0, 0);
        obj.setCollider(new Collider(obj, p.p));
        obj.setDisplay(new ShapeDisplay(obj, p.p, color));
        scene.addObject(obj);
        p.obj = obj;
        test(p, p, true);
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

    //let p01 = makeSquare("p01", "#FF7777", -2, 2, 2);
    //let p02 = makeSquare("p02", "#FF77FF", 2, 2, 2);
    //let p03 = makeSquare("p03", "#7777FF", 0, 0, 2);
    let p04 = makeTriangle("p04", "#FFFF77", 1, 2, -1, 0, -2, 2);
    //let p05 = makeTriangle("p05", "#77FFFF", 0.82, 1.29, -0.24, -0.51, 4.26, 1.01);
    let p06 = makeCircle("p06", "#FF7733", 0, 2, 1);

    /*test(p01, p02, false);
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
    */test(p04, p06, true);/*
    test(p05, p06, false);*/
}
game();