import './assets/stylesheets/styles.scss';

import { screen } from './screen';
import { Vec2 } from './utils/Vec2';

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
