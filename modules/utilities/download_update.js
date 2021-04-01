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
const ndjson = require('ndjson');
const jsonStream = require('JSONStream');
const csvtojson = require('csvtojson/v1');
const eventEmmiter = require('events').EventEmitter;
const inherits = require('util').inherits;

module.exports = DownloadUpdate;

function DownloadUpdate(pathFrom, type) {
    eventEmmiter.call(this);
    let stream;
    let pipedStream;
    if (type === 'jsonl') {
        stream = got.stream(pathFrom, { headers: { 'Accept-Encoding': 'gzip, deflate, sdch' }, gzip: true });
        pipedStream = stream.pipe(ndjson.parse());
        stream.on('response', response => {
            response.statusCode = 200;
            pipedStream.emit('start', response);
        }).on('error', error => {
            pipedStream.emit('error', error);
        });
        return pipedStream;
    } else if (type === 'json') {
        stream = got.stream(pathFrom, { headers: { 'Accept-Encoding': 'gzip, deflate, sdch' }, gzip: true });
        pipedStream = stream.pipe(jsonStream.parse('*'));
        stream.on('response', response => {
            response.statusCode = 200;
            pipedStream.emit('start', response);
        }).on('error', error => {
            pipedStream.emit('error', error);
        });
        return pipedStream;
    } else if (type === 'csv') {
        stream = got.stream(pathFrom, { headers: { 'Accept-Encoding': 'gzip, deflate, sdch' }, gzip: true });
        pipedStream = stream.pipe(csvtojson(null, { objectMode: true }))
        stream.on('response', response => {
            response.statusCode = 200;
            pipedStream.emit('start', response);
        }).on('error', error => {
            pipedStream.emit('error', error);
        })
        pipedStream.on('done', (error) => {
            if (error) {
                pipedStream.emit('error', error);
            } else {
                pipedStream.emit('end');
            }
        });
        return pipedStream;
    }
    return null;
}

inherits(DownloadUpdate, eventEmmiter);
