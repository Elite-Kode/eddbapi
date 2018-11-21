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

let swaggerJsDoc = require('swagger-jsdoc');

let swaggerDefinitions = require('./swaggerDefinitions');
const processVars = require('./processVars');

let makeSwaggerSpec = (params, security) => {
    let swaggerDefinition = {
        info: params.info,
        host: processVars.host,
        basePath: params.basePath,
        definitions: params.definitions,
        schemes: processVars.protocol
    };

    if (security) {
        swaggerDefinition.securityDefinitions = {
            http: {
                type: "basic"
            }
        };
    }

    let options = {
        swaggerDefinition: swaggerDefinition,
        apis: params.apis
    };

    return swaggerJsDoc(options);
}

let paramsEDDBAPIv1 = {
    info: {
        title: 'EDDB API',
        version: '1.0.0',
        description: 'An API for EDDB Data',
    },
    basePath: '/api/v1',
    definitions: {
        AtmosphereComposition: { properties: swaggerDefinitions.atmosphereComposition },
        Bodies: { properties: swaggerDefinitions.bodies },
        Commodities: { properties: swaggerDefinitions.commodities },
        Factions: { properties: swaggerDefinitions.factions },
        Materials: { properties: swaggerDefinitions.materials },
        PopulatedSystemPresence: { properties: swaggerDefinitions.populatedSystemPresence },
        PopulatedSystems: { properties: swaggerDefinitions.populatedSystems },
        Rings: { properties: swaggerDefinitions.rings },
        SolidComposition: { properties: swaggerDefinitions.solidComposition },
        StationItems: { properties: swaggerDefinitions.stationItems },
        Stations: { properties: swaggerDefinitions.stations },
        Systems: { properties: swaggerDefinitions.systems }
    },
    apis: ['./routes/v1/*.js']
};

let swaggerSpecEDDBAPIv1 = makeSwaggerSpec(paramsEDDBAPIv1, true);

let paramsEDDBAPIv2 = {
    info: {
        title: 'EDDB API',
        version: '2.0.0',
        description: 'An API for EDDB Data',
    },
    basePath: '/api/v2',
    definitions: {
        AtmosphereComposition: { properties: swaggerDefinitions.atmosphereComposition },
        Bodies: { properties: swaggerDefinitions.bodies },
        Commodities: { properties: swaggerDefinitions.commodities },
        Factions: { properties: swaggerDefinitions.factions },
        Materials: { properties: swaggerDefinitions.materials },
        PopulatedSystemPresence: { properties: swaggerDefinitions.populatedSystemPresence },
        PopulatedSystems: { properties: swaggerDefinitions.populatedSystems },
        Rings: { properties: swaggerDefinitions.rings },
        SolidComposition: { properties: swaggerDefinitions.solidComposition },
        StationItems: { properties: swaggerDefinitions.stationItems },
        Stations: { properties: swaggerDefinitions.stations },
        Systems: { properties: swaggerDefinitions.systems },
        BodiesPage: { properties: swaggerDefinitions.pagination('Bodies') },
        FactionsPage: { properties: swaggerDefinitions.pagination('Factions') },
        PopulatedSystemsPage: { properties: swaggerDefinitions.pagination('PopulatedSystems') },
        StationsPage: { properties: swaggerDefinitions.pagination('Stations') },
        SystemsPage: { properties: swaggerDefinitions.pagination('Systems') }
    },
    apis: ['./routes/v2/*.js']
};

let swaggerSpecEDDBAPIv2 = makeSwaggerSpec(paramsEDDBAPIv2, true);

let paramsEDDBAPIv3 = {
    info: {
        title: 'EDDB API',
        version: '3.0.0',
        description: 'An API for EDDB Data',
    },
    basePath: '/api/v3',
    definitions: {
        AtmosphereComposition: { properties: swaggerDefinitions.atmosphereComposition },
        Bodies: { properties: swaggerDefinitions.bodies },
        Commodities: { properties: swaggerDefinitions.commodities },
        Factions: { properties: swaggerDefinitions.factions },
        Materials: { properties: swaggerDefinitions.materials },
        PopulatedSystemPresence: { properties: swaggerDefinitions.populatedSystemPresence },
        PopulatedSystems: { properties: swaggerDefinitions.populatedSystems },
        Rings: { properties: swaggerDefinitions.rings },
        SolidComposition: { properties: swaggerDefinitions.solidComposition },
        StationItems: { properties: swaggerDefinitions.stationItems },
        Stations: { properties: swaggerDefinitions.stations },
        Systems: { properties: swaggerDefinitions.systems },
        BodiesPage: { properties: swaggerDefinitions.pagination('Bodies') },
        FactionsPage: { properties: swaggerDefinitions.pagination('Factions') },
        PopulatedSystemsPage: { properties: swaggerDefinitions.pagination('PopulatedSystems') },
        StationsPage: { properties: swaggerDefinitions.pagination('Stations') },
        SystemsPage: { properties: swaggerDefinitions.pagination('Systems') }
    },
    apis: ['./routes/v3/*.js']
};

let swaggerSpecEDDBAPIv3 = makeSwaggerSpec(paramsEDDBAPIv3, false);

module.exports.EDDBAPIv1 = swaggerSpecEDDBAPIv1;
module.exports.EDDBAPIv2 = swaggerSpecEDDBAPIv2;
module.exports.EDDBAPIv3 = swaggerSpecEDDBAPIv3;
