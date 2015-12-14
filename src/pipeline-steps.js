import {resolve} from "bluebird";

import * as config from "./services/config";
import log from "./services/logger";
import * as mongodb from "./services/mongodb";

export function findSiteBySensorId (sensorId) {
    return resolve(sensorId)
        .then(sensorId => mongodb.findOne({
            url: config.MONGODB_URL,
            collectionName: config.SITES,
            query: {
                sensorIds: {
                    $in: [sensorId]
                }
            }
        }));
}

function getSensor (measurements) {
    return {
        measurements: measurements.reduce((acc, measurement) => ({
            ...acc,
            [measurement.type]: measurement.value
        }), {}),
        lastUpdated: new Date().toISOString()
    };
}
export function updateReadingsRealTimeAggregate (site, element) {
    if (!site) {
        log.info("Site not found");
        return null;
    }
    log.info({site}, "Found site");
    const params = {
        url: config.MONGODB_URL,
        collectionName: config.READINGS_REAL_TIME_AGGREGATES,
        query: {
            _id: site._id,
            siteId: site._id
        },
        modifier: {
            $set: {
                [`sensors.${element.sensorId}`]: getSensor(element.measurements)
                // TODO update virtual sensors
            }
        }
    };
    log.info({params}, "Upserting");
    return mongodb.upsert(params);
}
