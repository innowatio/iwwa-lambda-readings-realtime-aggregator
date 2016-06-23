import "babel-polyfill";
import {expect} from "chai";
import sinon from "sinon";

import {splitMeasurements} from "steps/split-measurements";

describe("splitMeasurements", () => {

    var clock;

    before(() => {
        clock = sinon.useFakeTimers();
    });

    after(() => {
        clock.restore();
    });

    it("map values", async () => {
        const kinesisEvent = {
            "id": "eventId",
            "data": {
                "element": {
                    "sensorId": "sensorId",
                    "date": new Date().toISOString(),
                    "source": "reading",
                    "measurements": [
                        {
                            "type": "activeEnergy",
                            "value": "8.08",
                            "unitOfMeasurement": "kWh"
                        },
                        {
                            "type": "reactiveEnergy",
                            "value": "85",
                            "unitOfMeasurement": "kVArh"
                        },
                        {
                            "type": "maxPower",
                            "value": "3.000",
                            "unitOfMeasurement": "VAr"
                        }
                    ]
                },
                "id": "electricalReadingId"
            },
            "timestamp": 1420070400000,
            "type": "element inserted in collection readings"
        };

        const readings = splitMeasurements(kinesisEvent.data.element);

        expect(readings).to.deep.equal([{
            _id: "sensorId-1970-01-01-reading-activeEnergy",
            day: "1970-01-01",
            measurementType: "activeEnergy",
            measurementValue: "8.08",
            measurementTime: 0,
            sensorId: "sensorId",
            unitOfMeasurement: "kWh"
        }, {
            _id: "sensorId-1970-01-01-reading-reactiveEnergy",
            day: "1970-01-01",
            measurementType: "reactiveEnergy",
            measurementValue: "85",
            measurementTime: 0,
            sensorId: "sensorId",
            unitOfMeasurement: "kVArh"
        }, {
            _id: "sensorId-1970-01-01-reading-maxPower",
            day: "1970-01-01",
            measurementType: "maxPower",
            measurementValue: "3.000",
            measurementTime: 0,
            sensorId: "sensorId",
            unitOfMeasurement: "VAr"
        }]);
    });
});