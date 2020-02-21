import './assets/stylesheets/styles.scss';

import { screen } from './screen';
import { Transform, Vec2 } from './engine/utils/transform';
import { Scene } from './engine/scene';
import { wigglyThingy, spinnyThingy, FPSMetter, funnyFPSMetter, hilariousFPSMetter, image, sprite, createWiggly, yoloSprite, dicedice } from './game/prefabs/debugPrefabs';
import { Assets, sleep, Sound } from './utils';
import { GameObject } from './engine/gameObject';
import { SpinnyDisplay } from './game/components/debugComponents';
import { AudioManager } from './engine/AudioManager';

async function game() {
    await Assets.load();
    console.log(screen.width + " " + screen.height);

    const ctx = screen.getContext();
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, screen.width, screen.height);

    let gradient = ctx.createLinearGradient(0, 0, screen.width, screen.height);
    gradient.addColorStop(0, 'purple');
    gradient.addColorStop(0.10, 'blue');
    gradient.addColorStop(0.25, 'cyan');
    gradient.addColorStop(0.5, 'green');
    gradient.addColorStop(0.75, 'orange');
    gradient.addColorStop(1, 'red');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, screen.width, screen.height);

    let scene = new Scene();
    scene.instantiate(wigglyThingy, 100, 100);
    createWiggly(scene, 200, 200, "#800000", 0.05, 100, 25);
    createWiggly(scene, 500, 200, "#000080", 0.005, 100, 75);
    scene.instantiate(spinnyThingy, 300, 350);
    scene.instantiate(FPSMetter, 800, 120);
    scene.instantiate(funnyFPSMetter, 800, 400);
    scene.instantiate(hilariousFPSMetter, 300, 500);

    scene.instantiate(yoloSprite, 500, 500);
    scene.instantiate(yoloSprite, 550, 550);
    scene.instantiate(yoloSprite, 600, 600);
    scene.instantiate(yoloSprite, 650, 650);

    for (let i = 0; i < 6; i++) {
        scene.instantiate(dicedice, 600 + i * 50, 600 + i * 50);
    }

    scene.instantiate(image, 250, 800);
    scene.instantiate(sprite, 600, 800);

    screen.setScene(scene);

    let m = Transform.Identity;
    let angle = Math.PI / 2;
    console.log("expected rotation: " + angle);
    m = m.rotateRadians(angle);
    console.log(m.toString());
    console.log("angle: " + m.getRotation());
    console.log("scale: " + m.getScale());
    m = m.scale(2, 0.5);
    console.log(m.toString());
    console.log("angle: " + m.getRotation());
    console.log("scale: " + m.getScale());
    m = m.translate(100, Math.PI);
    console.log(m.toString());
    console.log("angle: " + m.getRotation());
    console.log("scale: " + m.getScale());

    m = Transform.Identity;
    let scale = new Vec2(2, 0.5);
    console.log(`expected scale: ${scale}`);
    m = m.scale(scale.x, scale.y);
    console.log(`scale: ${m.getScale()}`);
    m = m.rotateRadians(Math.PI / 2);
    console.log(`scale after pi/2 rotation: ${m.getScale()} (norm: ${m.getScale().magnitude()})`);
    m = m.rotateRadians(0.05);
    console.log(`scale after 0.05 rotation: ${m.getScale()} (norm: ${m.getScale().magnitude()})`);

    let rect1 = new GameObject(1000, 250);
    rect1.scale(2, 0.5);
    rect1.setDisplayComponent(new SpinnyDisplay(rect1, "#000000", 50));
    scene.addObject(rect1);

    let rect2 = new GameObject(1000, 350);
    rect2.rotateRadians(Math.PI / 2);
    console.log(rect2.getTransform());
    console.log(rect2.getScale());
    rect2.scale(2, 0.5);
    //rect2.shear(0.25, 0);
    console.log(rect2.getTransform());
    console.log(rect2.getScale());
    rect2.setDisplayComponent(new SpinnyDisplay(rect2, "#000000", 50));
    scene.addObject(rect2);

    // decomment this line
    //const music = AudioManager.loop(Sound.MAIN_REMIX, 0.1, 50, 70);
}
game();