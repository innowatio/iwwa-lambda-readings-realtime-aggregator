import {resolve} from "bluebird";
import {merge} from "ramda";

import * as config from "./services/config";
import log from "./services/logger";
import * as mongodb from "./services/mongodb";

export function findSiteBySensorId (sensorId) {
    return resolve(sensorId)
        .then(sensorId => mongodb.findOne({
            url: config.MONGODB_URL,
            collectionName: config.SITES,
            query: {
                sensorsIds: {
                    $in: [sensorId]
                }
            }
        }));
}

function getSetters (measurements, sensorId) {
    const path = `sensors.${sensorId}`;
    return merge(
    measurements.reduce((acc, measurement) => ({
        ...acc,
        [`${path}.measurements.${measurement.type}`]: measurement.value
    }), {}),
    {[`${path}.lastUpdated`]: new Date().toISOString()});
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
            $set: getSetters(element.measurements, element.sensorId)
        }
    };
    log.info({params}, "Upserting");
    return mongodb.upsert(params);
}
