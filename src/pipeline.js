import {map} from "bluebird";
import {contains, isEmpty} from "ramda";

import log from "./services/logger";
import {ALLOWED_SOURCE} from "config";

import {saveReadingRealtime} from "./steps/save-db";
import {splitMeasurements} from "./steps/split-measurements";

export async function pipeline (event) {
    
    log.info(event, "event");
    /*
     * Workaround: some events have been incorrectly generated and thus don't
     * have an `element` property. When processing said events, just return and
     * move on without failing, as failures can block the kinesis stream.
     */
    const measurementsEvent = event.data.element;
    if (!measurementsEvent
        || !measurementsEvent.sensorId
        || !measurementsEvent.measurements
        || isEmpty(measurementsEvent.measurements)
        || !contains(ALLOWED_SOURCE, [measurementsEvent.source, measurementsEvent.measurements[0].source])) {
        return null;
    }

    const mappedReadings = splitMeasurements(measurementsEvent);
    log.info({mappedReadings}, "realtime");

    await map(mappedReadings, async (reading) => {
        await saveReadingRealtime(reading);
    });
}
