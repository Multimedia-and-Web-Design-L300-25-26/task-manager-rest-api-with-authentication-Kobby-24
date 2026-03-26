import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../src/config/db.js";

process.env.NODE_ENV = "test";
dotenv.config({ path: ".env.test" });
dotenv.config({ override: true }); // .env overrides (cloud MongoDB for local dev when available)

beforeAll(async () => {
  await connectDB();
}, 15000);

afterAll(async () => {
  await mongoose.connection.close();
});
