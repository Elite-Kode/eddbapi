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
 * /stations:
 *   get:
 *     description: Get the Stations
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: eddbid
 *         description: EDDB ID.
 *         in: query
 *         type: integer
 *       - name: marketid
 *         description: FDev Station market id.
 *         in: query
 *         type: string
 *       - name: name
 *         description: Station name.
 *         in: query
 *         type: string
 *       - name: ships
 *         description: Comma seperated names of ships sold.
 *         in: query
 *         type: string
 *       - name: moduleid
 *         description: Comma seperated ids of modules sold.
 *         in: query
 *         type: string
 *       - name: controllingfactionname
 *         description: Name of the controlling minor faction.
 *         in: query
 *         type: string
 *       - name: statenames
 *         description: Comma seperated names of states.
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
 *       - name: minlandingpad
 *         description: Minimum landing pad size available.
 *         enum:
 *           - 'l'
 *           - 'm'
 *           - 's'
 *         in: query
 *         type: string
 *       - name: distancestar
 *         description: Maximum distance from the star.
 *         in: query
 *         type: integer
 *       - name: facilities
 *         description: Comma seperated names of facilities available in the station.
 *         enum:
 *           - 'blackmarket'
 *           - 'market'
 *           - 'refuel'
 *           - 'repair'
 *           - 'restock'
 *           - 'outfitting'
 *           - 'shipyard'
 *         in: query
 *         type: boolean
 *       - name: commodities
 *         description: Comma seperated names of commodities available.
 *         in: query
 *         type: string
 *       - name: stationtypename
 *         description: Comma seperated types of station.
 *         in: query
 *         type: string
 *       - name: planetary
 *         description: Whether the station is planetary.
 *         in: query
 *         type: boolean
 *       - name: economyname
 *         description: The economy of the station.
 *         in: query
 *         type: string
 *       - name: permit
 *         description: Whether the system where the station exists is permit locked.
 *         in: query
 *         type: boolean
 *       - name: power
 *         description: Comma seperated names of powers in influence in the system the station is in.
 *         in: query
 *         type: string
 *       - name: powerstatename
 *         description: Comma seperated states of the powers in influence in the system the station is in.
 *         in: query
 *         type: string
 *       - name: systemname
 *         description: Name of the system the station is in.
 *         in: query
 *         type: string
 *       - name: page
 *         description: Page no of response.
 *         in: query
 *         type: integer
 *     responses:
 *       200:
 *         description: An array of stations in EDDB format
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/StationsPage'
 */
router.get('/', async (req, res, next) => {
    try {
        let stations = require('../../models/stations')
        let query = {};
        let factionSearch = null;
        let systemSearch = null;
        let page = 1;

        if (req.query.eddbid) {
            query.id = req.query.eddbid;
        }
        if (req.query.marketid) {
            query.ed_market_id = req.query.marketid;
        }
        if (req.query.name) {
            query.name_lower = req.query.name.toLowerCase();
        }
        if (req.query.ships) {
            let ships = arrayfy(req.query.ships);
            query['selling_ships.name_lower'] = { $all: ships };
        }
        if (req.query.moduleid) {
            let modules = arrayfy(req.query.moduleid);
            query.selling_modules = { $all: modules };
        }
        if (req.query.controllingfactionname) {
            factionSearch = async () => {
                let factions = require('../../models/factions');
                let factionQuery = {};

                factionQuery.name_lower = req.query.controllingfactionname.toLowerCase();

                let factionProjection = {
                    _id: 0,
                    id: 1
                }

                try {
                    let result = await factions.find(factionQuery, factionProjection).lean();
                    let ids = [];
                    result.forEach(doc => {
                        ids.push(doc.id);
                    }, this);
                    return ids;
                } catch (err) {
                    err.place = 'faction';
                    throw err;
                }
            }
        }
        if (req.query.statenames) {
            let states = arrayfy(req.query.statenames);
            query['states.name_lower'] = { $in: states };
        }
        if (req.query.allegiancename) {
            query.allegiance = req.query.allegiancename.toLowerCase();
        }
        if (req.query.governmentname) {
            query.government = req.query.governmentname.toLowerCase();
        }
        if (req.query.minlandingpad) {
            switch (req.query.minlandingpad.toLowerCase()) {
                case 'l':
                    query.max_landing_pad_size = 'l';
                    break;
                case 'm':
                    query.max_landing_pad_size = { $in: ['m', 'l'] };
                    break;
                case 's':
                    query.max_landing_pad_size = { $in: ['s', 'm', 'l'] };
                    break;
                default:
                    query.max_landing_pad_size = { $in: ['s', 'm', 'l'] };
            }
        }
        if (req.query.distancestar) {
            query.distance_to_star = { $lt: req.query.distancestar };
        }
        if (req.query.facilities) {
            let facilities = arrayfy(req.query.facilities);
            facilities.forEach((facility) => {
                switch (facility.toLowerCase()) {
                    case 'blackmarket':
                        query.has_blackmarket = true;
                        break;
                    case 'market':
                        query.has_market = true;
                        break;
                    case 'refuel':
                        query.has_refuel = true;
                        break;
                    case 'repair':
                        query.has_repair = true;
                        break;
                    case 'restock':
                        query.has_rearm = true;
                        break;
                    case 'outfitting':
                        query.has_outfitting = true;
                        break;
                    case 'shipyard':
                        query.has_shipyard = true;
                        break;
                }
            }, this);
        }
        if (req.query.commodities) {
            let commodities = arrayfy(req.query.commodities);
            query['export_commodities.name_lower'] = { $all: commodities };
        }
        if (req.query.stationtypename) {
            let types = arrayfy(req.query.stationtypename);
            query.type = { $in: types };
        }
        if (req.query.planetary) {
            query.is_planetary = boolify(req.query.planetary);
        }
        if (req.query.economyname) {
            query['economies.name_lower'] = req.query.economyname.toLowerCase();
        }
        if (req.query.page) {
            page = req.query.page;
        }
        if (req.query.permit || req.query.power || req.query.powerstatename || req.query.systemname) {
            systemSearch = async () => {
                let systems = require('../../models/systems');
                let systemQuery = {};

                if (req.query.permit) {
                    systemQuery.needs_permit = boolify(req.query.permit);
                }
                if (req.query.power) {
                    let powers = arrayfy(req.query.power);
                    systemQuery.power = { $in: powers };
                }
                if (req.query.powerstatename) {
                    let powerStates = arrayfy(req.query.powerstatename);
                    systemQuery.power_state = { $in: powerStates };
                }
                if (req.query.systemname) {
                    systemQuery.name_lower = req.query.systemname.toLowerCase();
                }
                let systemProjection = {
                    _id: 0,
                    id: 1
                }

                try {
                    let result = await systems.find(systemQuery, systemProjection).lean()
                    let ids = [];
                    result.forEach(doc => {
                        ids.push(doc.id);
                    }, this);
                    return ids;
                } catch (err) {
                    err.place = 'system';
                    throw err;
                }
            }
        }

        let stationSearch = async () => {
            if (_.isEmpty(query)) {
                throw new Error("Add at least 1 query parameter to limit traffic");
            }
            let paginateOptions = {
                lean: true,
                page: page,
                limit: 10,
                leanWithId: false
            };
            let result = await stations.paginate(query, paginateOptions);
            res.status(200).json(result);
        }

        if ((factionSearch instanceof Promise) && (systemSearch instanceof Promise)) {
            let results = await Promise.allSettled([factionSearch, systemSearch]);
            if (results[0].status === 'fulfilled') {
                query.controlling_minor_faction_id = { $in: results[0].value };
            } else {
                console.log(results[0].reason);
            }
            if (results[1].status === 'fulfilled') {
                query.system_id = { $in: results[1].value };
            } else {
                console.log(results[1].reason);
            }
            stationSearch();
        } else if (factionSearch instanceof Promise) {
            let ids = await factionSearch
            query.controlling_minor_faction_id = { $in: ids };
            stationSearch();
        } else if (systemSearch instanceof Promise) {
            let ids = await systemSearch
            query.system_id = { $in: ids };
            stationSearch();
        } else {
            stationSearch();
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
