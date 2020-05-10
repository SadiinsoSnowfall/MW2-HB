"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const base_controller_1 = require("./_controllers/base.controller");
const error_handler_1 = require("./_helpers/error-handler");
const config_handler_1 = require("./_helpers/config-handler");
config_handler_1.loadConfig();
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(helmet());
app.use(compression());
app.use(cors({
    origin: '*'
}));
app.use('/', base_controller_1.router);
app.use(error_handler_1.globalErrorHandler);
app.listen(config_handler_1.config.server_port, () => console.log('Server listening on port ' + config_handler_1.config.server_port));
