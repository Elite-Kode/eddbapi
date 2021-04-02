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
const _ = require('lodash');

let router = express.Router();

/**
 * @swagger
 * /populatedsystems:
 *   get:
 *     description: Get the Populated Systems
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: eddbid
 *         description: EDDB ID.
 *         in: query
 *         type: integer
 *       - name: systemaddress
 *         description: FDev System Address.
 *         in: query
 *         type: string
 *       - name: name
 *         description: System name.
 *         in: query
 *         type: string
 *       - name: allegiancename
 *         description: Name of the allegiance.
 *         in: query
 *         type: string
 *       - name: governmentname
 *         description: Name of the government type.
 *         in: query
 *         type: string
 *       - name: statenames
 *         description: Comma seperated names of states.
 *         in: query
 *         type: string
 *       - name: primaryeconomyname
 *         description: The primary economy of the system.
 *         in: query
 *         type: string
 *       - name: power
 *         description: Comma seperated names of powers in influence in the system.
 *         in: query
 *         type: string
 *       - name: powerstatename
 *         description: Comma seperated states of the powers in influence in the system.
 *         in: query
 *         type: string
 *       - name: permit
 *         description: Whether the system is permit locked.
 *         in: query
 *         type: boolean
 *       - name: securityname
 *         description: The name of the security status in the system.
 *         in: query
 *         type: string
 *       - name: factionname
 *         description: Name of a faction present in the system.
 *         in: query
 *         type: string
 *       - name: presencetype
 *         description: Presence type of the faction.
 *         enum:
 *           - 'presence'
 *           - 'controlling'
 *         in: query
 *         type: string
 *       - name: page
 *         description: Page no of response.
 *         in: query
 *         type: integer
 *     responses:
 *       200:
 *         description: An array of populated systems in EDDB format
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/PopulatedSystemsPage'
 */
router.get('/', async (req, res, next) => {
    try {
        let populatedSystems = require('../../models/populated_systems');
        let query = {};
        let factionSearch;
        let page = 1;

        if (req.query.eddbid) {
            query.id = req.query.eddbid;
        }
        if (req.query.systemaddress) {
            query.ed_system_address = req.query.systemaddress;
        }
        if (req.query.name) {
            query.name_lower = req.query.name.toLowerCase();
        }
        if (req.query.allegiancename) {
            query.allegiance = req.query.allegiancename.toLowerCase();
        }
        if (req.query.governmentname) {
            query.government = req.query.governmentname.toLowerCase();
        }
        if (req.query.statenames) {
            let states = arrayfy(req.query.statenames);
            query['states.name_lower'] = { $in: states };
        }
        if (req.query.primaryeconomyname) {
            query.primary_economy = req.query.primaryeconomyname.toLowerCase();
        }
        if (req.query.power) {
            let powers = arrayfy(req.query.power);
            query.power = { $in: powers };
        }
        if (req.query.powerstatename) {
            let powerStates = arrayfy(req.query.powerstatename);
            query.power_state = { $in: powerStates };
        }
        if (req.query.permit) {
            query.needs_permit = boolify(req.query.permit);
        }
        if (req.query.securityname) {
            query.security = req.query.securityname.toLowerCase();
        }
        if (req.query.page) {
            page = req.query.page;
        }
        if (req.query.factionname) {
            let presencetype = 'presence';
            if (req.query.presencetype) {
                presencetype = req.query.presencetype.toLowerCase();
            }
            if (presencetype === 'controlling') {
                query.controlling_minor_faction = req.query.factionname.toLowerCase();
            } else if (presencetype === 'presence') {
                factionSearch = async () => {
                    let factions = require('../../models/factions');
                    let factionQuery = {};

                    factionQuery.name_lower = req.query.factionname.toLowerCase();

                    let factionProjection = {
                        _id: 0,
                        id: 1
                    }

                    let result = await factions.find(factionQuery, factionProjection).lean();
                    let ids = [];
                    result.forEach(doc => {
                        ids.push(doc.id);
                    }, this);
                    return ids;
                }
            }
        }

        let systemSearch = async () => {
            if (_.isEmpty(query)) {
                throw new Error("Add at least 1 query parameter to limit traffic");
            }
            let paginateOptions = {
                lean: true,
                page: page,
                limit: 10,
                leanWithId: false
            };
            let result = await populatedSystems.paginate(query, paginateOptions);
            res.status(200).json(result);
        }

        if (factionSearch) {
            let ids = await factionSearch();
            query["minor_faction_presences.minor_faction_id"] = { $in: ids };
            systemSearch();
        } else {
            systemSearch();
        }
    } catch (err) {
        next(err);
    }
});

let arrayfy = requestParam => {
    let regex = /\s*,\s*/;
    let mainArray = requestParam.split(regex);

    mainArray.forEach((element, index, allElements) => {
        allElements[index] = element.toLowerCase();
    }, this);

    return mainArray;
}

let boolify = requestParam => {
    if (requestParam.toLowerCase() === "true") {
        return true;
    } else if (requestParam.toLowerCase() === "false") {
        return false;
    } else {
        return false;
    }
}

module.exports = router;
