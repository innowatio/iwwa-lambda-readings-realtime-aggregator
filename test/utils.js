export function getSensorWithSourceInMeasurements (date, source) {
    return {
        "id": "eventId",
        "data": {
            "element": {
                "sensorId": "sensorId",
                "date": date,
                "measurements": [
                    {
                        "type": "activeEnergy",
                        "source": source,
                        "value": "0.808",
                        "unitOfMeasurement": "kWh"
                    },
                    {
                        "type": "reactiveEnergy",
                        "source": source,
                        "value": "-0.085",
                        "unitOfMeasurement": "kVArh"
                    },
                    {
                        "type": "maxPower",
                        "source": source,
                        "value": "0.000",
                        "unitOfMeasurement": "VAr"
                    }
                ]
            },
            "id": "electricalReadingId"
        },
        "timestamp": 1420070400000,
        "type": "element inserted in collection readings"
    };
}

export function getSensorWithSourceInElement (date, source) {
    return {
        "id": "eventId",
        "data": {
            "element": {
                "sensorId": "sensorId",
                "date": date,
                "source": source,
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
}
