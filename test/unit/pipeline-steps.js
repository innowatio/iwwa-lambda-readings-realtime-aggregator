import {expect} from "chai";
import {identity} from "ramda";
import sinon from "sinon";

import * as pipelineSteps from "../../src/pipeline-steps";

describe("updateReadingsRealTimeAggregate", () => {

    const config = {
        MONGODB_URL: "MONGODB_URL",
        READINGS_REAL_TIME_AGGREGATES: "READINGS_REAL_TIME_AGGREGATES"
    };
    const mongodb = {
        upsert: identity
    };
    var clock;

    before(() => {
        clock = sinon.useFakeTimers();
        pipelineSteps.__Rewire__("config", config);
        pipelineSteps.__Rewire__("mongodb", mongodb);
    });
    after(() => {
        clock.restore();
        pipelineSteps.__ResetDependency__("config");
        pipelineSteps.__ResetDependency__("mongodb");
    });

    it("updates with the correct modifier", () => {
        const site = {_id: "siteId"};
        const element = {
            sensorId: "sensorId",
            measurements: [
                {
                    type: "activeEnergy",
                    value: 100
                },
                {
                    type: "reactiveEnergy",
                    value: 200
                }
            ]
        };
        const ret = pipelineSteps.updateReadingsRealTimeAggregate(site, element);
        expect(ret).to.deep.equal({
            url: "MONGODB_URL",
            collectionName: "READINGS_REAL_TIME_AGGREGATES",
            query: {
                _id: "siteId",
                siteId: "siteId"
            },
            modifier: {
                $set: {
                    "sensors.sensorId.measurements.activeEnergy": 100,
                    "sensors.sensorId.measurements.reactiveEnergy": 200,
                    "sensors.sensorId.lastUpdated": "1970-01-01T00:00:00.000Z"
                }
            }
        });
    });

});
