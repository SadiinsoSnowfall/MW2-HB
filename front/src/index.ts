import './assets/stylesheets/styles.scss';

import { screen } from './screen';
import { range } from './utils';

import * as http from './XHRHelper';

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

ctx.fillStyle = 'black';

for (const x of range(screen.width)) {
    for (const y of range(screen.height)) {
        if (Math.cos(x) > Math.cos(y)) {
            ctx.fillRect(x, y, 1, 1);
        }
    }
}

test();
async function test() {
    console.log('sending query...');
    let res = await http.get('https://jsonplaceholder.typicode.com/posts/1');
    console.log(res);
}
