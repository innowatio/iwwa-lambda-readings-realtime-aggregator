import "babel/polyfill";
import {all} from "bluebird";
import router from "kinesis-router";

import log from "./services/logger";
import {
    findSiteBySensorId,
    updateReadingsRealTimeAggregate
} from "./pipeline-steps";

function pipeline (event) {
    log.info({event}, "Received event");
    const {data: {element}} = event;
    return all([findSiteBySensorId(element.sensorId), element])
        .spread(updateReadingsRealTimeAggregate);
}

export const handler = router()
    .on("element inserted in collection readings", pipeline);
