"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
function loadConfig() {
    try {
        exports.config = JSON.parse(fs_1.readFileSync('config.json', 'utf-8').trim());
    }
    catch (err) {
        console.error("Unable to parse the configuration file", err);
        process.exit();
    }
}
exports.loadConfig = loadConfig;
