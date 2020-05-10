import './assets/stylesheets/styles.scss';

import { Collider } from './engine/components/collider';
import { screen } from './engine/screen';
import { Scene } from './engine/scene';
import { FPSMetter} from './game/prefabs/debugPrefabs';
import { GameObject } from './engine/gameObject';
import { createGround } from './game/prefabs/basePrefabs';
import * as Menus from './game/ui/basemenus';
import { BlockPrefabs } from './game/prefabs/blockPrefabs';
import { ShapeDisplay, CollisionDisplay } from './game/components/debugComponents';
import { slingshot } from './game/prefabs/miscPrefabs';
import { BirdPrefabs } from './game/prefabs/birdPrefabs';
import { PigPrefabs } from './game/prefabs/pigPrefabs';
import { BackgroundPrefabs } from './game/prefabs/backgroundPrefabs';
import { Assets, Img } from './engine/res/assetsManager';
import { AudioManager } from './engine/res/audioManager';
import { Inputs, MouseAction } from './engine/res/inputManager';
import { intersection } from './engine/physics/collision';
import { ConvexPolygon } from './engine/physics/convexPolygon';
import { Circle } from './engine/physics/circle';
import { forcePickOne, range, assert } from './engine/utils/utils';
import { Vec2 } from './engine/utils/vec2';

async function game() {
    await Assets.load();// load assets
    await AudioManager.init(); // init sound

    // prefabs list
    BlockPrefabs.init();
    BirdPrefabs.init();
    PigPrefabs.init();

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
    Menus.ig_menu.setVisible(true); // enable IG menu manually (testing only);

    scene.instantiateBackground(BackgroundPrefabs.back_test, 0, 0);

    Inputs.subscribeMouse(MouseAction.LEFT_CLICK, p => {
        //scene.instantiate(BlockPrefabs.wooden_tris_md_2, p.x, p.y);
        //scene.instantiate(BirdPrefabs.BIRD_BIG, p.x, p.y);
    });

    
    Inputs.subscribeMouse(MouseAction.FORWARD, p => {
        scene.instantiate(forcePickOne([
            BirdPrefabs.BIRD_RED,
            BirdPrefabs.BIRD_YELLOW,
            BirdPrefabs.BIRD_BLUE,
            BirdPrefabs.BIRD_BLACK,
            BirdPrefabs.BIRD_WHITE,
            BirdPrefabs.BIRD_GREEN,
            BirdPrefabs.BIRD_BIG,
        ]), p.x, p.y);
    });

    Inputs.subscribeMouse(MouseAction.BACKWARD, p => {
        scene.instantiate(forcePickOne([
            PigPrefabs.pig_king,
            PigPrefabs.pig_mustache,
            PigPrefabs.pig_helmet,
            PigPrefabs.pig_lg,
            PigPrefabs.pig_md,
            PigPrefabs.pig_sm,
        ]), p.x, p.y);
    });

    Inputs.subscribeMouse(MouseAction.RIGHT_CLICK, p => {
        for (let x of range(5)) {
            for (let y of range(4)) {
                scene.instantiate(forcePickOne([
                    //BlockPrefabs.ice_tris_hl_2,
                    BlockPrefabs.wooden_cube_hl_2,
                    //BlockPrefabs.sand_ball_md
                ]), x * 120 + 600, y + 460);
                //console.log("[" + BlockPrefabs.wooden_cube_hl_2.id + ", " + (x * 120 + 600) + ", " + (y * 120 + 360) + "]")
            }
        }
    });

    Inputs.subscribe("a", () => {
        console.log("A pressed");
        for (let c of scene.getTree()) {
            console.log(c.object.id);
        }
    });
    

    scene.instantiate(slingshot, 300, 675);
    scene.addObject(createGround(1000, 825, 2000, 100, "#696969F0"));

    //obj = createGround(675, 300, 1200, 50);
    //scene.addObject(obj);

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