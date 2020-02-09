
import { readFileSync } from 'fs';

export var config: any;

export function loadConfig(): void {
    try {
        config = JSON.parse(readFileSync('config.json', 'utf-8').trim());
    } catch (err) {
        console.error("Unable to parse the configuration file", err);
        process.exit();
    }
}