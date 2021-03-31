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

const mongoose = require('mongoose');
let mongoosePaginate = require('mongoose-paginate');

let faction = new mongoose.Schema({
    id: { type: Number, unique: true, index: true },
    name: String,
    name_lower: { type: String, lowercase: true, index: true },
    updated_at: Date,
    government_id: Number,
    government: { type: String, lowercase: true, index: true },
    allegiance_id: Number,
    allegiance: { type: String, lowercase: true, index: true },
    home_system_id: Number,
    is_player_faction: { type: Boolean, index: true }
}, { runSettersOnQuery: true });

faction.pre('save', function (next) {
    lowerify(this);
    millisecondify(this);
    next();
});

faction.pre('findOneAndUpdate', function (next) {
    lowerify(this._update);
    millisecondify(this._update);
    next();
});

faction.plugin(mongoosePaginate);

let lowerify = ref => {
    ref.name_lower = ref.name;
}

let millisecondify = ref => {
    ref.updated_at *= 1000;
}

module.exports = mongoose.model('faction', faction);
