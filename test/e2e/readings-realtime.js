import chai, {expect} from "chai";
import chaiAsPromised from "chai-as-promised";
import sinon from "sinon";

chai.use(chaiAsPromised);

import {handler} from "index";
import {READINGS_REAL_TIME_AGGREGATES_COLLECTION} from "config";
import * as utils from "../utils";
import {getEventFromObject} from "../mock";
import {getMongoClient} from "services/mongodb";

describe("On reading", async () => {

    const context = {
        succeed: sinon.spy(),
        fail: sinon.spy()
    };

    var aggregates;
    var db;

    before(async () => {
        db = await getMongoClient();
        await db.createCollection(READINGS_REAL_TIME_AGGREGATES_COLLECTION);
    });

    after(async () => {
        db = await getMongoClient();
        await db.dropCollection(READINGS_REAL_TIME_AGGREGATES_COLLECTION);
    });

    beforeEach(async () => {
        db = await getMongoClient();
        aggregates = db.collection(READINGS_REAL_TIME_AGGREGATES_COLLECTION);
        context.succeed.reset();
        context.fail.reset();
    });

    it("creates an aggregate (reading real-time) element if it doesn't exist [CASE 0: source in measurements]", async () => {
        const event = getEventFromObject(
            utils.getSensorWithSourceInMeasurements("2015-01-01T00:02:00.000Z", "reading")
        );
        await handler(event, context);
        const count = await aggregates.count({});
        expect(count).to.equal(3);
    });

    it("creates an aggregate (reading real-time) element if it doesn't exist [CASE 0: source in element body]", async () => {
        const event = getEventFromObject(
            utils.getSensorWithSourceInElement("2015-01-01T00:02:00.000Z", "reading")
        );
        await handler(event, context);
        const count = await aggregates.count({});
        expect(count).to.equal(3);
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
            await handler(event, context);
            const aggregate = await aggregates.findOne({_id: "sensorId-reading-activeEnergy"});
            expect(aggregate).to.deep.equal({
                _id: "sensorId-reading-activeEnergy",
                day: "2015-01-01",
                measurementType: "activeEnergy",
                measurementValue: "0.808",
                measurementTime: 1420070520000,
                sensorId: "sensorId",
                unitOfMeasurement: "kWh"
            });
        });

        it("electrical reading with source in element body", async () => {
            const event = getEventFromObject(
                utils.getSensorWithSourceInElement("2015-01-01T00:00:30.000Z", "reading")
            );
            await handler(event, context);
            const aggregate = await aggregates.findOne({_id: "sensorId-reading-activeEnergy"});
            expect(aggregate).to.deep.equal({
                _id: "sensorId-reading-activeEnergy",
                day: "2015-01-01",
                measurementType: "activeEnergy",
                measurementValue: "0.808",
                measurementTime: 1420070520000,
                sensorId: "sensorId",
                unitOfMeasurement: "kWh"
            });
        });

        it("return `null` if source is `forecast` in measurements", async () => {
            const event = getEventFromObject(
                utils.getSensorWithSourceInMeasurements("2015-01-01T00:00:30.000Z", "forecast")
            );
            await handler(event, context);
            const aggregate = await aggregates.findOne({_id: "sensorId-forecast-activeEnergy"});
            expect(aggregate).to.deep.equal(null);
        });

        it("return `null` if source is `forecast` in element body", async () => {
            const event = getEventFromObject(
                utils.getSensorWithSourceInElement("2015-01-01T00:00:30.000Z", "forecast")
            );
            await handler(event, context);
            const aggregate = await aggregates.findOne({_id: "sensorId-forecast-activeEnergy"});
            expect(aggregate).to.deep.equal(null);
        });

        it("electrical reading with source in element body", async () => {
            const event = getEventFromObject(
                utils.getSensorWithSourceInElement("2015-01-01T00:00:30.000Z", "reading")
            );
            await handler(event, context);
            const aggregate = await aggregates.findOne({_id: "sensorId-reading-activeEnergy"});
            expect(aggregate).to.deep.equal({
                _id: "sensorId-reading-activeEnergy",
                day: "2015-01-01",
                measurementType: "activeEnergy",
                measurementValue: "0.808",
                measurementTime: 1420070520000,
                sensorId: "sensorId",
                unitOfMeasurement: "kWh"
            });
        });
    });
});
