import {
    READINGS_REAL_TIME_AGGREGATES_COLLECTION
} from "../config";
import {getMongoClient} from "../services/mongodb";

async function upsert (collection, id, object) {
    const db = await getMongoClient();
    await db.collection(collection).updateOne(
        {_id: id},
        {$set: object},
        {upsert: true}
    );
}

async function upsertRealtime (id, realTime) {
    await upsert(READINGS_REAL_TIME_AGGREGATES_COLLECTION, id, realTime);
}

async function findOne (collection, query) {
    const db = await getMongoClient();
    return await db.collection(collection).findOne(query);
}

async function findOneRealtime (query) {
    return await findOne(READINGS_REAL_TIME_AGGREGATES_COLLECTION, query);
}

export async function saveReadingRealtime (realtime) {

    const savedRealtime = await findOneRealtime({
        _id: realtime._id
    }) || {
        measurementTime: 0
    };

    if (savedRealtime.measurementTime < realtime.measurementTime) {
        await upsertRealtime(
            realtime._id,
            {
                day: realtime.day,
                measurementType: realtime.measurementType,
                measurementValue: realtime.measurementValue,
                measurementTime: realtime.measurementTime,
                unitOfMeasurement: realtime.unitOfMeasurement,
                source: realtime.source
            }
        );
    }
}