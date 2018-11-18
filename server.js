/*
 * KodeBlox Copyright 2017 Sayak Mukhopadhyay
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http: //www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

"use strict";

const express = require('express');
const swaggerUi = require('swagger-ui-express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
var cors = require('cors')

// Bugsnag disabled. Uncomment to enable
// const bugsnag = require('./bugsnag');
const swagger = require('./swagger');

require('./modules/cron').EDDBDownloadTrigger();

const bodiesV1 = require('./routes/v1/bodies');
const factionsV1 = require('./routes/v1/factions');
const populatedSystemsV1 = require('./routes/v1/populated_systems');
const stationsV1 = require('./routes/v1/stations');
const systemsV1 = require('./routes/v1/systems');

const app = express();

// app.use(bugsnag.requestHandler);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'dist')));
app.use(cors());

app.use('/api/v1/api-docs.json', (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swagger.EDDBAPIv1);
});

app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swagger.EDDBAPIv1));

app.use('/api/v1/bodies', bodiesV1);
app.use('/api/v1/factions', factionsV1);
app.use('/api/v1/populatedsystems', populatedSystemsV1);
app.use('/api/v1/stations', stationsV1);
app.use('/api/v1/systems', systemsV1);

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.send({
            message: err.message,
            error: err
        });
        console.log(err);
    });
}

// production error handler
// no stacktraces leaked to user
if (app.get('env') === 'production') {
    // app.use(bugsnag.errorHandler);
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.send({
            message: err.message,
            error: {}
        });
    });
}

module.exports = app;
