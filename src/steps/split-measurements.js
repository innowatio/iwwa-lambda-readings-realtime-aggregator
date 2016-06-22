import moment from "moment";

export function splitMeasurements (measurementsEvent) {
    const sensorId = measurementsEvent.sensorId;
    const source = measurementsEvent.source ? measurementsEvent.source : measurementsEvent.measurements[0].source;
    const measurementTime = moment.utc(measurementsEvent.date);
    const measurementDay = measurementTime.format("YYYY-MM-DD");

    const mapped = measurementsEvent.measurements.map(measurement => {
        return {
            _id: `${sensorId}-${measurementDay}-reading-${measurement.type}`,
            day: measurementDay,
            measurementType: measurement.type,
            measurementValue: measurement.value,
            measurementTime: measurementTime.valueOf(),
            unitOfMeasurement: measurement.unitOfMeasurement,
            source: source
        };
    });
    return mapped;
}