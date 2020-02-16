import './assets/stylesheets/styles.scss';

import { screen } from './screen';
import { Transform, Vec2 } from './engine/utils/transform';

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

let v = new Vec2(5, 5);
v.mul(2);
console.log(v);

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
