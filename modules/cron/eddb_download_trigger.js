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

const cron = require('cron');
const eddbTime = require('../../cronTimes').eddb_trigger_time;
const eddb = require('../eddb');

module.exports = Trigger;

function Trigger() {
    let cronPattern = `${eddbTime.split(':')[2]} ${eddbTime.split(':')[1]} ${eddbTime.split(':')[0]} * * *`;
    let cronJob = new cron.CronJob(cronPattern, async () => {
        console.log('EDDB CRONjob execute');

        let bodiesDownloadUpdate = () => {
            return new Promise((resolve, reject) => {
                let bodies = new eddb.bodies();
                bodies.downloadUpdate();
                bodies
                    .on('done', () => {
                        resolve();
                    })
                    .on('error', err => {
                        reject(err);
                    });
            });
        }

        let bodiesDownload = () => {
            return new Promise((resolve, reject) => {
                let bodies = new eddb.bodies();
                bodies.download();
                bodies
                    .on('done', () => {
                        resolve();
                    })
                    .on('error', err => {
                        reject(err);
                    });
            });
        }

        let bodiesUpdate = () => {
            return new Promise((resolve, reject) => {
                let bodies = new eddb.bodies();
                bodies.update();
                bodies
                    .on('done', () => {
                        resolve();
                    })
                    .on('error', err => {
                        reject(err);
                    });
            });
        }

        let commoditiesDownloadUpdate = () => {
            return new Promise((resolve, reject) => {
                let commodities = new eddb.commodities();
                commodities.downloadUpdate();
                commodities
                    .on('done', () => {
                        resolve();
                    })
                    .on('error', err => {
                        reject(err);
                    });
            });
        }

        let commoditiesDownload = () => {
            return new Promise((resolve, reject) => {
                let commodities = new eddb.commodities();
                commodities.download();
                commodities
                    .on('done', () => {
                        resolve();
                    })
                    .on('error', err => {
                        reject(err);
                    });
            });
        }

        let commoditiesUpdate = () => {
            return new Promise((resolve, reject) => {
                let commodities = new eddb.commodities();
                commodities.update();
                commodities
                    .on('done', () => {
                        resolve();
                    })
                    .on('error', err => {
                        reject(err);
                    });
            });
        }

        let factionsDownloadUpdate = () => {
            return new Promise((resolve, reject) => {
                let factions = new eddb.factions();
                factions.downloadUpdate();
                factions
                    .on('done', () => {
                        resolve();
                    })
                    .on('error', err => {
                        reject(err);
                    });
            });
        }

        let factionsDownload = () => {
            return new Promise((resolve, reject) => {
                let factions = new eddb.factions();
                factions.download();
                factions
                    .on('done', () => {
                        resolve();
                    })
                    .on('error', err => {
                        reject(err);
                    });
            });
        }

        let factionsUpdate = () => {
            return new Promise((resolve, reject) => {
                let factions = new eddb.factions();
                factions.update();
                factions
                    .on('done', () => {
                        resolve();
                    })
                    .on('error', err => {
                        reject(err);
                    });
            });
        }

        let stationsDownloadUpdate = () => {
            return new Promise((resolve, reject) => {
                let stations = new eddb.stations();
                stations.downloadUpdate();
                stations
                    .on('done', () => {
                        resolve();
                    })
                    .on('error', err => {
                        reject(err);
                    });
            });
        }

        let stationsDownload = () => {
            return new Promise((resolve, reject) => {
                let stations = new eddb.stations();
                stations.download();
                stations
                    .on('done', () => {
                        resolve();
                    })
                    .on('error', err => {
                        reject(err);
                    });
            });
        }

        let stationsUpdate = () => {
            return new Promise((resolve, reject) => {
                let stations = new eddb.stations();
                stations.update();
                stations
                    .on('done', () => {
                        resolve();
                    })
                    .on('error', err => {
                        reject(err);
                    });
            });
        }

        let populatedSystemsDownloadUpdate = () => {
            return new Promise((resolve, reject) => {
                let populatedSystems = new eddb.populatedSystems();
                populatedSystems.downloadUpdate();
                populatedSystems
                    .on('done', () => {
                        resolve();
                    })
                    .on('error', err => {
                        reject(err);
                    });
            });
        }

        let populatedSystemsDownload = () => {
            return new Promise((resolve, reject) => {
                let populatedSystems = new eddb.populatedSystems();
                populatedSystems.download();
                populatedSystems
                    .on('done', () => {
                        resolve();
                    })
                    .on('error', err => {
                        reject(err);
                    });
            });
        }

        let populatedSystemsUpdate = () => {
            return new Promise((resolve, reject) => {
                let populatedSystems = new eddb.populatedSystems();
                populatedSystems.update();
                populatedSystems
                    .on('done', () => {
                        resolve();
                    })
                    .on('error', err => {
                        reject(err);
                    });
            });
        }

        let systemsDownloadUpdate = () => {
            return new Promise((resolve, reject) => {
                let systems = new eddb.systems();
                systems.downloadUpdate();
                systems
                    .on('done', () => {
                        resolve();
                    })
                    .on('error', err => {
                        reject(err);
                    });
            });
        }

        let systemsDownload = () => {
            return new Promise((resolve, reject) => {
                let systems = new eddb.systems();
                systems.download();
                systems
                    .on('done', () => {
                        resolve();
                    })
                    .on('error', err => {
                        reject(err);
                    });
            });
        }

        let systemsUpdate = () => {
            return new Promise((resolve, reject) => {
                let systems = new eddb.systems();
                systems.update();
                systems
                    .on('done', () => {
                        resolve();
                    })
                    .on('error', err => {
                        reject(err);
                    });
            });
        }

        try {
            // await bodiesDownloadUpdate();
            // await commoditiesDownloadUpdate();
            // await factionsDownloadUpdate();
            // await stationsDownloadUpdate();
            // await populatedSystemsDownloadUpdate();
            // await systemsDownloadUpdate();
            await Promise.all([
                commoditiesDownload(),
                factionsDownload(),
                stationsDownload(),
                populatedSystemsDownload(),
                systemsDownload()
            ]);
            commoditiesUpdate();
            factionsUpdate();
            stationsUpdate();
            populatedSystemsUpdate();
            systemsUpdate();
        } catch (err) {
            console.log(err)
        }
    });
    cronJob.start();
}
