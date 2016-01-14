import dotenv from "dotenv";

dotenv.load();

export const ALLOWED_SOURCE = "reading";
export const MONGODB_URL = process.env.MONGODB_URL;
export const READINGS_REAL_TIME_AGGREGATES = "readings-real-time-aggregates";
export const SITES = "sites";
export const SENSORS = "sensors";
