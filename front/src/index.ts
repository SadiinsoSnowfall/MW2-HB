import './assets/stylesheets/styles.scss';

import { screen } from './screen';
import { Transform } from './engine/utils/transform';
import { Scene } from './engine/scene';
import { wigglyThingy, spinnyThingy, FPSMetter, funnyFPSMetter, hilariousFPSMetter, image, sprite, createWiggly } from './game/prefabs/debugPrefabs';
import { Assets } from './utils';

async function game() {
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
    scene.instantiate(FPSMetter, 800, 100);
    scene.instantiate(funnyFPSMetter, 800, 400);
    scene.instantiate(hilariousFPSMetter, 300, 500);
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

    await Assets.load();
    scene.instantiate(image, 250, 800);
    scene.instantiate(sprite, 600, 800);
}
game();