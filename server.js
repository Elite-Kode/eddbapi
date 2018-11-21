/*
 * KodeBlox Copyright 2018 Sayak Mukhopadhyay
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

// EDDB API V1 and V2 have been deprecated and logically removed

// const bodiesV1 = require('./routes/v1/bodies');
// const commoditiesV1 = require('./routes/v1/commodities');
// const factionsV1 = require('./routes/v1/factions');
// const populatedSystemsV1 = require('./routes/v1/populated_systems');
// const stationsV1 = require('./routes/v1/stations');
// const systemsV1 = require('./routes/v1/systems');

// const downloadDumpsV1 = require('./routes/v1/download_dumps');
// const insertDumpsV1 = require('./routes/v1/insert_dumps');
// const updateDumpsV1 = require('./routes/v1/update_dumps');
// const downloadInsertV1 = require('./routes/v1/download_insert');
// const downloadUpdateV1 = require('./routes/v1/download_update');

// const bodiesV2 = require('./routes/v2/bodies');
// const factionsV2 = require('./routes/v2/factions');
// const populatedSystemsV2 = require('./routes/v2/populated_systems');
// const stationsV2 = require('./routes/v2/stations');
// const systemsV2 = require('./routes/v2/systems');
// const downloadUpdateV2 = require('./routes/v2/download_update');

const bodiesV3 = require('./routes/v3/bodies');
const factionsV3 = require('./routes/v3/factions');
const populatedSystemsV3 = require('./routes/v3/populated_systems');
const stationsV3 = require('./routes/v3/stations');
const systemsV3 = require('./routes/v3/systems');
// const downloadUpdateV3 = require('./routes/v3/download_update'); // Internal cronjob being used instead of system cronjob API call

const app = express();

// Bugsnag disabled. Uncomment to enable
// app.use(bugsnag.requestHandler);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'dist')));
app.use(cors());

// Older API docs should be available

app.use('/api/v1/api-docs.json', (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swagger.EDDBAPIv1);
});

app.use('/api/v2/api-docs.json', (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swagger.EDDBAPIv2);
});

app.use('/api/v3/api-docs.json', (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swagger.EDDBAPIv3);
});

// app.use('/api/v1/bodies', bodiesV1);
// app.use('/api/v1/commodities', commoditiesV1);
// app.use('/api/v1/factions', factionsV1);
// app.use('/api/v1/populatedsystems', populatedSystemsV1);
// app.use('/api/v1/stations', stationsV1);
// app.use('/api/v1/systems', systemsV1);
// app.use('/api/v1/downloaddumps', downloadDumpsV1);
// app.use('/api/v1/insertdumps', insertDumpsV1);
// app.use('/api/v1/updatedumps', updateDumpsV1);
// app.use('/api/v1/downloadinsert', downloadInsertV1);
// app.use('/api/v1/downloadupdate', downloadUpdateV1);

// app.use('/api/v2/bodies', bodiesV2);
// app.use('/api/v2/factions', factionsV2);
// app.use('/api/v2/populatedsystems', populatedSystemsV2);
// app.use('/api/v2/stations', stationsV2);
// app.use('/api/v2/systems', systemsV2);
// app.use('/api/v2/downloadupdate', downloadUpdateV2);

app.use('/api/v3/bodies', bodiesV3);
app.use('/api/v3/factions', factionsV3);
app.use('/api/v3/populatedsystems', populatedSystemsV3);
app.use('/api/v3/stations', stationsV3);
app.use('/api/v3/systems', systemsV3);
// app.use('/api/v3/downloadupdate', downloadUpdateV3);

app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swagger.EDDBAPIv1));
app.use('/api/v2/docs', swaggerUi.serve, swaggerUi.setup(swagger.EDDBAPIv2));
app.use('/api/v3/docs', swaggerUi.serve, swaggerUi.setup(swagger.EDDBAPIv3));

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
    // Bugsnag disabled. Uncomment to enable
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
