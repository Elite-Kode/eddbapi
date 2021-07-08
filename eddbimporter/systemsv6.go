package main

import (
	"go.mongodb.org/mongo-driver/mongo"
)

func CheckAndInsertSystemsV6Schema(client *mongo.Client) bool {
	return false
}

// /*
//  * KodeBlox Copyright 2018 Sayak Mukhopadhyay
//  *
//  * Licensed under the Apache License, Version 2.0 (the "License");
//  * you may not use this file except in compliance with the License.
//  * You may obtain a copy of the License at
//  *
//  * http: //www.apache.org/licenses/LICENSE-2.0
//  *
//  * Unless required by applicable law or agreed to in writing, software
//  * distributed under the License is distributed on an "AS IS" BASIS,
//  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  * See the License for the specific language governing permissions and
//  * limitations under the License.
//  */

//  "use strict";

//  const systemsModel = require('../../../models/v6/systems');
//  const utilities = require('../../utilities');
//  const eventEmmiter = require('events').EventEmitter;
//  const inherits = require('util').inherits;

//  module.exports = Systems;

//  function Systems() {
// 	 eventEmmiter.call(this);

// 	 this.downloadUpdate = function () {
// 		 let recordsUpdated = 0;
// 		 new utilities.downloadUpdate('https://eddb.io/archive/v6/systems.csv', 'csv')
// 			 .on('start', response => {
// 				 console.log(`EDDB system dump started with status code ${response.statusCode}`);
// 				 this.emit('started', {
// 					 response: response,
// 					 insertion: "started",
// 					 type: 'station'
// 				 });
// 			 })
// 			 .on('json', json => {
// 				 systemsModel
// 					 .then(model => {
// 						 model.findOneAndUpdate(
// 							 {
// 								 id: json.id,
// 								 updated_at: { $ne: json.updated_at }
// 							 },
// 							 json,
// 							 {
// 								 upsert: true,
// 								 runValidators: true
// 							 })
// 							 .then(() => {
// 								 recordsUpdated++;
// 							 })
// 							 .catch((err) => {
// 								 this.emit('error', err);
// 							 });
// 					 })
// 					 .catch(err => {
// 						 this.emit('error', err);
// 					 });
// 			 })
// 			 .on('end', () => {
// 				 console.log(`${recordsUpdated} records updated`);
// 				 this.emit('done', recordsUpdated);
// 			 })
// 			 .on('error', err => {
// 				 this.emit('error', err);
// 			 })
// 	 }
//  }

//  inherits(Systems, eventEmmiter);
