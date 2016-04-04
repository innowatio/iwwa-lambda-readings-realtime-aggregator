import chai, {expect} from "chai";
import sinon from "sinon";
import chaiAsPromised from "chai-as-promised";

chai.use(chaiAsPromised);

import {handler} from "index";
import * as mongodb from "services/mongodb";
import {READINGS_REAL_TIME_AGGREGATES, MONGODB_URL, SITES} from "services/config";
import * as utils from "../utils";
import {getEventFromObject, run} from "../mock";

describe("On reading", async () => {

    var aggregates;

    beforeEach(async () => {
        const connect = mongodb.__get__("connect");
        const db = await connect(MONGODB_URL);
        const sites = db.collection(SITES);
        aggregates = db.collection(READINGS_REAL_TIME_AGGREGATES);
        sites.update({}, {_id: "siteId", sensorsIds: ["sensorId"]}, {upsert: true});
        await aggregates.remove({});
    });

    after(async () => {
        const connect = mongodb.__get__("connect");
        const db = await connect(MONGODB_URL);
        await db.dropCollection(SITES);
        await db.dropCollection(READINGS_REAL_TIME_AGGREGATES);
    });

    it("creates an aggregate (reading real-time) element if it doesn't exist if event is with source in measurements", async () => {
        const event = getEventFromObject(
            utils.getSensorWithSourceInMeasurements("2015-01-01T00:02:00.000Z", "reading")
        );
        await run(handler, event);
        const count = await aggregates.count({});
        expect(count).to.equal(1);
    });

    it("creates an aggregate (reading real-time) element if it doesn't exist if event is with source in element body", async () => {
        const event = getEventFromObject(
            utils.getSensorWithSourceInElement("2015-01-01T00:02:00.000Z", "reading")
        );
        await run(handler, event);
        const count = await aggregates.count({});
        expect(count).to.equal(1);
    });

    describe("correctly builds the aggregate:", () => {

        var clock;

        before(() => {
            clock = sinon.useFakeTimers();
        });

        after(() => {
            clock.restore();
        });

        it("electrical reading with source in measurements", async () => {
            const event = getEventFromObject(
                utils.getSensorWithSourceInMeasurements("2015-01-01T00:00:30.000Z", "reading")
            );
            await run(handler, event);
            const aggregate = await aggregates.findOne({_id: "siteId"});
            expect(aggregate).to.deep.equal({
                _id: "siteId",
                siteId: "siteId",
                sensors: {
                    sensorId: {
                        measurements: {
                            activeEnergy: "0.808",
                            reactiveEnergy: "-0.085",
                            maxPower: "0.000"
                        },
                        lastUpdated: new Date().toISOString()
                    }
                }
            });
        });

        it("electrical reading with source in element body", async () => {
            const event = getEventFromObject(
                utils.getSensorWithSourceInElement("2015-01-01T00:00:30.000Z", "reading")
            );
            await run(handler, event);
            const aggregate = await aggregates.findOne({_id: "siteId"});
            expect(aggregate).to.deep.equal({
                _id: "siteId",
                siteId: "siteId",
                sensors: {
                    sensorId: {
                        measurements: {
                            activeEnergy: "8.08",
                            reactiveEnergy: "85",
                            maxPower: "3.000"
                        },
                        lastUpdated: new Date().toISOString()
                    }
                }
            });
        });

        it("return `null` if source is `forcast` in measurements", async () => {
            const event = getEventFromObject(
                utils.getSensorWithSourceInMeasurements("2015-01-01T00:00:30.000Z", "forecast")
            );
            await run(handler, event);
            const aggregate = await aggregates.findOne({_id: "siteId"});
            expect(aggregate).to.deep.equal(null);
        });

        it("return `null` if source is `forecast` in element body", async () => {
            const event = getEventFromObject(
                utils.getSensorWithSourceInElement("2015-01-01T00:00:30.000Z", "forecast")
            );
            await run(handler, event);
            const aggregate = await aggregates.findOne({_id: "siteId"});
            expect(aggregate).to.deep.equal(null);
        });

        it("electrical reading with source in element body", async () => {
            const oldUpdateDate = new Date("2016-01-01").toISOString();
            await aggregates.insert({
                _id: "siteId",
                siteId: "siteId",
                sensors: {
                    sensorId: {
                        measurements: {
                            activeEnergy: "1.08",
                            reactiveEnergy: "5",
                            maxPower: "3.111",
                            anotherEnergy: "1"
                        },
                        lastUpdated: oldUpdateDate
                    }
                }
            });
            const event = getEventFromObject(
                utils.getSensorWithSourceInElement("2015-01-01T00:00:30.000Z", "reading")
            );
            await run(handler, event);
            const aggregate = await aggregates.findOne({_id: "siteId"});
            expect(aggregate).to.deep.equal({
                _id: "siteId",
                siteId: "siteId",
                sensors: {
                    sensorId: {
                        measurements: {
                            activeEnergy: "8.08",
                            reactiveEnergy: "85",
                            maxPower: "3.000",
                            anotherEnergy: "1"
                        },
                        lastUpdated: new Date().toISOString()
                    }
                }
            });
        });
    });
});
