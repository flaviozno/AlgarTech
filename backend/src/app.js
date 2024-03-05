import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import ClientRoutes from './routes/index.js';
import { populateDB } from './services/index.js';

const app = express();
app.use(express.json());
app.use(cors());

connectDB().then(() => {
    // populateDB('clients.csv');

    app.use('/api', ClientRoutes)

    app.listen(3333, () => {
        console.info('Server in running on port 3333')
    });
})