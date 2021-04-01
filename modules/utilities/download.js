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

const got = require('got');
const fs = require('fs');
const eventEmmiter = require('events').EventEmitter;
const inherits = require('util').inherits;

module.exports = Download;

function Download(pathFrom, pathTo) {
    eventEmmiter.call(this);
    let stream = got.stream(pathFrom, { headers: { 'Accept-Encoding': 'gzip, deflate, sdch' }, gzip: true });
    let pipedStream = stream.pipe(fs.createWriteStream(pathTo));
    stream.on('response', response => {
        response.statusCode = 200;
        pipedStream.emit('start', response);
    }).on('error', err => {
        pipedStream.emit('error', err);
    });
    pipedStream.on('finish', () => {
        pipedStream.emit('end');
    });
    return pipedStream;
}

inherits(Download, eventEmmiter);
