import "babel/polyfill";
import {all} from "bluebird";
import {contains} from "ramda";
import router from "kinesis-router";

import log from "./services/logger";
import{ALLOWED_SOURCE} from "./services/config";
import {
    findSiteBySensorId,
    updateReadingsRealTimeAggregate
} from "./pipeline-steps";

function pipeline (event) {
    log.info({event}, "Received event");
    const {data: {element}} = event;
    if (!!element && contains(ALLOWED_SOURCE, [element.source, element.measurements[0].source])) {
        return all([findSiteBySensorId(element.sensorId), element])
            .spread(updateReadingsRealTimeAggregate);
    }
    return null;
}

export const handler = router()
    .on("element inserted in collection readings", pipeline);
