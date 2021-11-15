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

const path = require('path');
const fs = require('fs');
const populatedSystemsModel = require('../../models/populated_systems');
const utilities = require('../utilities');
const eventEmmiter = require('events').EventEmitter;
const inherits = require('util').inherits;

let fileSize = require('../utilities/file_size');

module.exports = PopulatedSystems;

const pathToFile = path.resolve(__dirname, '../../dumps/systems_populated.json');

function PopulatedSystems() {
    eventEmmiter.call(this);

    this.update = function () {
        let recordsUpdated = 0;
        let stream = utilities.jsonParse(pathToFile);
        stream
            .on('start', () => {
                console.log(`EDDB populated system dump update reported`);
                this.emit('started', {
                    statusCode: 200,
                    update: "started",
                    type: 'populated system'
                });
            })
            .on('data', async json => {
                stream.pause();
                json = modify(json);
                try {
                    await populatedSystemsModel.findOneAndUpdate(
                        {
                            id: json.id,
                            updated_at: { $ne: json.updated_at }
                        },
                        json,
                        {
                            upsert: true,
                            runValidators: true
                        })
                    recordsUpdated++;
                } catch (err) {
                    this.emit('error', err);
                } finally {
                    stream.resume();
                }
            })
            .on('end', () => {
                console.log(`${recordsUpdated} records updated`);
                fs.unlink(pathToFile, () => {
                    console.log('Populated System Dump deleted');
                });
                this.emit('done', recordsUpdated);
            })
            .on('error', err => {
                this.emit('error', err);
            })
    };

    this.import = function () {
        let recordsInserted = 0;
        let stream = utilities.jsonParse(pathToFile);
        stream
            .on('start', () => {
                console.log(`EDDB populated system dump insertion reported`);
                this.emit('started', {
                    statusCode: 200,
                    insertion: "started",
                    type: 'populated system'
                });
            })
            .on('data', async json => {
                stream.pause();
                json = modify(json);
                try {
                    let document = new populatedSystemsModel(json);
                    await document.save()
                    recordsInserted++;
                } catch (err) {
                    this.emit('error', err);
                } finally {
                    stream.resume();
                }
            })
            .on('end', () => {
                console.log(`${recordsInserted} records inserted`);
                fs.unlink(pathToFile, () => {
                    console.log('Populated System Dump deleted');
                });
                this.emit('done', recordsInserted);
            })
            .on('error', err => {
                this.emit('error', err);
            })
    };

    this.download = function () {
        utilities.download('https://eddb.io/archive/v6/systems_populated.json', pathToFile)
            .on('start', response => {
                console.log(`EDDB populated system dump reported with status code ${response.statusCode}`);
                this.emit('started', {
                    response: response,
                    insertion: "started",
                    type: 'populated system'
                });
            })
            .on('end', () => {
                console.log(`EDDB populated system dump saved successfully with file size ${fileSize.withPath(pathToFile)}`)
                this.emit('done');
            })
            .on('error', err => {
                this.emit('error', err);
            })
    };

    const bulkUpdateCallback = function(err, result){
          if (err) {
             console.log(`Errors: ${err.result.getWriteErrorCount()}, example: ${err.message}`);
             result = err.result;
          }
          if (result) {
             console.log(`${result.insertedCount} inserted, ${result.matchedCount} matched, ${result.modifiedCount} modified, ${result.upsertedCount} upserted`);
          }
    }

    this.downloadUpdate = function () {
        let recordsFound = 0;
        let operations = [];
        let stream = utilities.downloadUpdate('https://eddb.io/archive/v6/systems_populated.json', 'json');
        stream
            .on('start', response => {
                console.log(`EDDB populated system dump started with status code ${response.statusCode}`);
                console.time('populatedSystems')
                this.emit('started', {
                    response: response,
                    insertion: "started",
                    type: 'populated system'
                });
            })
            .on('data', async json => {
                stream.pause();
                json = modify(json);
                json.updated_at = json.updated_at * 1000;
                operations.push({
                                  updateOne: {
                                    filter: {
                                      id: json.id,
//                                      updated_at: { $ne: json.updated_at }
                                    },
                                    update: { $set: json },
                                    upsert: true
                                  }
                                });
                recordsFound++;
                if (operations.length % 1000 === 0 ) {
                  try {
                       await populatedSystemsModel.bulkWrite(
                         operations,
                         { ordered: false },
                         bulkUpdateCallback
                       );
                  } catch (err) {
                    this.emit('error', err);
                  }
                  operations = [];
                }
                stream.resume();
            })
            .on('end', () => {
                populatedSystemsModel.bulkWrite(
                  operations,
                  { ordered: false },
                  bulkUpdateCallback
                );
                console.timeEnd('populatedSystems');
                console.log(`${recordsFound} records processed.`);                                                                                                           
                this.emit('done', recordsFound);                                                                                                                             
            })
            .on('error', err => {
                this.emit('error', err);
            })
    }

    let modify = json => {
        let statify = utilities.modify.statify;
        json.states = statify(json.states);
        json.minor_faction_presences.forEach((minor_faction_presence, index, minor_faction_presences) => {
            minor_faction_presences[index].active_states = statify(minor_faction_presence.active_states);
            minor_faction_presences[index].pending_states = statify(minor_faction_presence.pending_states);
            minor_faction_presences[index].recovering_states = statify(minor_faction_presence.recovering_states);
        });
        return json;
    }
}

inherits(PopulatedSystems, eventEmmiter);
