import dotenv from "dotenv";

dotenv.config();

export const ALLOWED_SOURCE = "reading";
export const MONGODB_URL = process.env.MONGODB_URL || "mongodb://localhost:27017";
export const READINGS_REAL_TIME_AGGREGATES_COLLECTION = "readings-real-time-aggregates";
