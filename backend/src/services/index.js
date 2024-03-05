import fs from 'fs'
import csvParser from 'csv-parser';
import { Client } from '../models/index.js';
import {moneyFormat } from "../utils/index.js"

export const populateDB = async (file) => {
    try {
        fs.createReadStream(file)
            .pipe(csvParser())
            .on('data', async (data) => {
                const client = new Client({
                    name: data.name,
                    address: data.address,
                    phone: data.phone,
                    debt_amount: moneyFormat(data.debt_amount)
                });
                await client.save();
            })
            .on('end', () => {
                console.log('The DB was populated!');
            });
    } catch (err) {
        console.error(err);
    }
};

