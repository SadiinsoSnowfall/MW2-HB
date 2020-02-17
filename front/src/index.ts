import './assets/stylesheets/styles.scss';

import { screen } from './screen';
import { Transform } from './engine/utils/transform';
import { DullScene } from './engine/scene';
import { Assets } from './utils';

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

let scene = new DullScene();
scene.addWigglyThingy(100, 100);
scene.addWigglyThingy(200, 200, "#800000", 0.05, 100, 25);
scene.addWigglyThingy(500, 200, "#000080", 0.005, 100, 75);
scene.addSpinnyThingy(300, 350, "#008080", 0.01, 75);
scene.addFPSMetter(800, 100);
scene.addFunnyFPSMetter(800, 400);
scene.addHilariousFPSMetter(300, 500);
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

test();
async function test() {
    await Assets.load();
    await Assets.load();
    ctx.drawImage(Assets.get(Assets.LEVELS_ICON), 0, 0);
}