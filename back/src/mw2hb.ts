import express = require('express');

import helmet = require('helmet')
import compression = require('compression');

import { router as base_route } from './_controllers/base.controller';

import { globalErrorHandler } from './_helpers/error-handler';
import { config, loadConfig } from './_helpers/config-handler';

// load configuration
loadConfig();

// init app
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(helmet());
app.use(compression());

// add routes
app.use('/', base_route);
app.use(globalErrorHandler);

app.listen(config.server_port, () => console.log('Server listening on port ' + config.server_port));