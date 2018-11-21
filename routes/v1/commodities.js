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
const passport = require('passport');
const _ = require('lodash');

let router = express.Router();

router.get('/', passport.authenticate('basic', { session: false }), (req, res, next) => {
    require('../../models/commodities')
        .then(commodities => {
            commodities.find({}).lean()
                .then(result => {
                    res.status(200).json(result);
                })
                .catch(next)
        })
        .catch(next);
});

router.get('/id/:commodityid', (req, res, next) => {
    require('../../../models/commodities')
        .then(commodities => {
            let id = req.params.commodityid;
            commodities.find({ commodity_id: id }).lean()
                .then(result => {
                    res.status(200).json(result);
                })
                .catch(next)
        })
        .catch(next);
});

module.exports = router;
