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

const populatedSystemsModel = require('../../../models/v6/populated_systems');
const utilities = require('../../utilities');
const eventEmmiter = require('events').EventEmitter;
const inherits = require('util').inherits;

module.exports = PopulatedSystems;

function PopulatedSystems() {
    eventEmmiter.call(this);

    this.downloadUpdate = function () {
        let recordsUpdated = 0;
        new utilities.downloadUpdate('https://eddb.io/archive/v6/systems_populated.json', 'json')
            .on('start', response => {
                console.log(`EDDB populated system dump started with status code ${response.statusCode}`);
                this.emit('started', {
                    response: response,
                    insertion: "started",
                    type: 'populated system'
                });
            })
            .on('json', json => {
                json.states = statify(json.states);
                json.minor_faction_presences.forEach((minor_faction_presence, index, minor_faction_presences) => {
                    minor_faction_presences[index].active_states = statify(minor_faction_presence.active_states);
                    minor_faction_presences[index].pending_states = statify(minor_faction_presence.pending_states);
                    minor_faction_presences[index].recovering_states = statify(minor_faction_presence.recovering_states);
                });
                populatedSystemsModel
                    .then(model => {
                        model.findOneAndUpdate(
                            {
                                id: json.id,
                                updated_at: { $ne: json.updated_at }
                            },
                            json,
                            {
                                upsert: true,
                                runValidators: true
                            })
                            .then(() => {
                                recordsUpdated++;
                            })
                            .catch((err) => {
                                this.emit('error', err);
                            });
                    })
                    .catch(err => {
                        this.emit('error', err);
                    });
            })
            .on('end', () => {
                console.log(`${recordsUpdated} records updated`);
                this.emit('done', recordsUpdated);
            })
            .on('error', err => {
                this.emit('error', err);
            })
    }

    let statify = ref => {
        let entities = ref;
        ref = [];
        entities.forEach((entity, index, allEntities) => {
            ref.push({
                id: entity.id,
                name: entity.name,
                name_lower: entity.name.toLowerCase()
            });
        }, this);
        return ref;
    }
}

inherits(PopulatedSystems, eventEmmiter);
