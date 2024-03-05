import mongoose from 'mongoose';
import { Client } from "../models/index.js";

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/ALGAR_TECH', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        Client.deleteMany({})
            .then(() => console.log('The DB was successfully reloaded!'))

        console.log('Connected successfully to MongoDB');
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
};

export default connectDB;
