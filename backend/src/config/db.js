import mongoose from "mongoose";
import { Client } from "../models/index.js";

const connectDB = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.eljzuj7.mongodb.net/ALGAR_TECH`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    Client.deleteMany({}).then(() =>
      console.log("The DB was successfully reloaded!")
    );

    console.log("Connected successfully to MongoDB");
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

export default connectDB;
