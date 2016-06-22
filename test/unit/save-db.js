import "babel-polyfill";
import {expect} from "chai";

import {
    READINGS_REAL_TIME_AGGREGATES_COLLECTION
} from "config";
import {getMongoClient} from "services/mongodb";
import {saveReadingRealtime} from "steps/save-db";

describe("saveReadingRealtime", () => {

    before(async () => {
        const db = await getMongoClient();
        await db.createCollection(READINGS_REAL_TIME_AGGREGATES_COLLECTION);
    });

    after(async () => {
        const db = await getMongoClient();
        await db.dropCollection(READINGS_REAL_TIME_AGGREGATES_COLLECTION);
    });

    it("insert measurements", async () => {

        const realtime = {
            _id: "sensorId-2015-01-01-reading-activeEnergy",
            day: "2015-01-01",
            measurementType: "activeEnergy",
            measurementValue: "0.808",
            measurementTime: 1420070400000,
            unitOfMeasurement: "kWh",
            source: "reading"
        };

        const realtimeReactive = {
            _id: "sensorId-2015-01-01-reading-reactiveEnergy",
            day: "2015-01-01",
            measurementType: "reactiveEnergy",
            measurementValue: "0.808",
            measurementTime: 1420070300000,
            unitOfMeasurement: "kWh",
            source: "reading"
        };

        await saveReadingRealtime(realtime);
        await saveReadingRealtime(realtimeReactive);

        const db = await getMongoClient();
        const realtimeCollection = db.collection(READINGS_REAL_TIME_AGGREGATES_COLLECTION);
        const realtimeReadings = await realtimeCollection.find({}).toArray();
        const realtimeReading = await realtimeCollection.findOne({
            _id: realtime._id
        });
        const realtimeReadingReactive = await realtimeCollection.findOne({
            _id: realtimeReactive._id
        });

        expect(realtimeReadings.length).to.be.equal(2);
        expect(realtimeReading).to.deep.equal(realtime);
        expect(realtimeReadingReactive).to.deep.equal(realtimeReactive);
    });

    it("skip measurement", async () => {

        const realtime = {
            _id: "sensorId-2015-01-01-reading-activeEnergy",
            day: "2015-01-01",
            measurementType: "activeEnergy",
            measurementValue: "0.808",
            measurementTime: 1420070300000,
            unitOfMeasurement: "kWh",
            source: "reading"
        };

        await saveReadingRealtime(realtime);

        const db = await getMongoClient();
        const realtimeCollection = db.collection(READINGS_REAL_TIME_AGGREGATES_COLLECTION);
        const realtimeReadings = await realtimeCollection.find({}).toArray();
        const realtimeReading = await realtimeCollection.findOne({
            _id: realtime._id
        });

        expect(realtimeReadings.length).to.be.equal(2);
        expect(realtimeReading).to.deep.equal({
            ...realtime,
            measurementTime: 1420070400000
        });
    });

    it("update measurement", async () => {

        const realtime = {
            _id: "sensorId-2015-01-01-reading-activeEnergy",
            day: "2015-01-01",
            measurementType: "activeEnergy",
            measurementValue: "0.808",
            measurementTime: 1420070500000,
            unitOfMeasurement: "kWh",
            source: "reading"
        };

        await saveReadingRealtime(realtime);

        const db = await getMongoClient();
        const realtimeCollection = db.collection(READINGS_REAL_TIME_AGGREGATES_COLLECTION);
        const realtimeReadings = await realtimeCollection.find({}).toArray();
        const realtimeReading = await realtimeCollection.findOne({
            _id: realtime._id
        });

        expect(realtimeReadings.length).to.be.equal(2);
        expect(realtimeReading).to.deep.equal(realtime);
    });
});