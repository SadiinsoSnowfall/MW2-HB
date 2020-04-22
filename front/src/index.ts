import './assets/stylesheets/styles.scss';

import { Collider, Display } from './engine/components';
import { screen } from './engine/screen';
import { Scene } from './engine/scene';
import { FPSMetter} from './game/prefabs/debugPrefabs';
import { assert, Vec2, range } from './engine/utils';
import { GameObject } from './engine/gameObject';
import { ConvexPolygon, intersection, Circle, drawCross } from './engine/physics';
import { createGround } from './game/prefabs/basePrefabs';
import * as Menus from './game/ui/basemenus';
import { Levels, Assets, Img, Inputs, MouseAction } from './engine/res';
import { BlockPrefabs } from './game/prefabs/blockPrefabs';
import { ShapeDisplay, CollisionDisplay } from './game/components/debugComponents';
import { Prefab } from './engine/prefab';

async function game() {
    await Assets.load();// load assets
    BlockPrefabs.init();

    const ctx = screen.getContext();
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, screen.width, screen.height);

    const scene = new Scene();

    await Menus.init(scene);
    screen.setCursor(Assets.img(Img.CURSOR));
    screen.setUseCustomCursor(true); // set to true to enable custom cursor support

    scene.instantiate(FPSMetter, 600, 120);
    screen.setScene(scene);

    //Menus.main_menu.setVisible(true); // enable main menu

    Inputs.subscribeMouse(MouseAction.LEFT_CLICK, p => {
        scene.instantiate(BlockPrefabs.wooden_cube_hl_2, p.x, p.y);
    });


    Inputs.subscribeMouse(MouseAction.RIGHT_CLICK, p => {
        for (let x of range(5)) {
            for (let y of range(4)) {
                scene.instantiate(BlockPrefabs.wooden_ball_md_2, x * 120 + 600, y * 120 + 200);
            }
        }
    });

    Inputs.subscribe("a", () => {
        let tree = scene.getTree();
        console.log("A pressed");
        for (let c of tree) {
            console.log("Position: " + c.object.getPosition());

            for (let c2 of tree) {
                if (c != c2) {
                    let collision = intersection(c, c2);
                    if (collision != null) {
                        let o = new GameObject(0, 0);
                        o.setDisplay(new CollisionDisplay(o, collision));
                        scene.addObject(o);

                        let o2 = new GameObject(0, 0);
                        let shape1 = (c.getShape() as ConvexPolygon).transform(c.object.getTransform());
                        let shape2 = (c2.getShape() as ConvexPolygon).transform(c2.object.getTransform());
                        let shape = shape1.minkowskiDifference(shape2);
                        o2.setDisplay(new ShapeDisplay(o2, shape, "#000000"));
                        scene.addObject(o2);

                        let o3 = new GameObject(0, 0);
                        o3.setDisplay(new ShapeDisplay(o3, shape1, "#FF7777"));
                        scene.addObject(o3);

                        let o4 = new GameObject(0, 0);
                        o4.setDisplay(new ShapeDisplay(o4, shape2, "#7777FF"));
                        scene.addObject(o4);
                    }
                }
            }
        }
    });

    scene.addObject(createGround(675, 700, 1200, 50));

    // Polygon collision detection test
    const offset = 500;
    const scale = 100;

    function tr(x: number): number {
        return x * scale + offset;
    }

    function test(p1: any, p2: any, expected: boolean) {
        function intersect(a: any, b: any) {
            console.log(`${a.n} vs ${b.n}`);
            let c = intersection(a.obj.getCollider(), b.obj.getCollider());
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
        obj.scale(0.5, 0.5);
        obj.rotateDegrees(10);
        obj.move(100, 500);
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

    /*let p01 = makeCircle("p01", "#FF7777", 0, 0, 1);
    let p02 = makeSquare("p02", "#77FF77", 1, 0, 2);
    let p03 = makeSquare("p03", "#7777FF", 2.5, 0, 2);
    let p04 = makeTriangle("p04", "#FF77FF", -2, -1, -2, 1, 1, 0);

    test(p01, p02, true);
    test(p01, p03, false);
    test(p01, p04, true);
    test(p02, p03, true);
    test(p02, p04, true);
    test(p03, p04, false);*/

    /*function lolFromPrefab(p: Prefab, name: string, x: number, y: number) {
        let o = scene.instantiate(p, x, y);
        let r = {
            n: name,
            p: o.getCollider()?.getShape(),
            obj: o
        };
        test(r, r, true);
        return r;
    }

    let p05 = lolFromPrefab(BlockPrefabs.wooden_cube_hl_2, "p05", 100, 100);
    let p06 = lolFromPrefab(BlockPrefabs.wooden_cube_hl_2, "p06", 200, 200);
    test(p05, p06, false);*/

}
game();