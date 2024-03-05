import { Client } from "../models/index.js";
import { moneyFormat } from "../utils/index.js";
import { populateDB } from "../services/index.js";
import fs from "fs";

export const clientController = {
  reloadDB: async (req, res) => {
    try {
      Client.deleteMany({}).then(() =>
        console.log("The DB was successfully reloaded!")
      );
      if (
        fs.access("clients.csv", fs.constants.F_OK, async (err) => {
          if (err) {
            console.log("File not foune!");
            res.status(200).json({ message: "Reloaded" });
          } else {
            await populateDB("clients.csv");
          }
        })
      )
        res.status(200).json({ message: "Reloaded" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  findOneClient: async (phone) => {
    return await Client.findOne({ phone }).exec();
  },

  getClients: async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    try {
      const count = await Client.countDocuments();
      const totalPages = Math.ceil(count / limit);

      const clients = await Client.find()
        .skip((page - 1) * limit)
        .limit(limit);

      res.json({
        clients: clients,
        totalPages: totalPages,
        currentPage: page,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  insertClient: async (req, res) => {
    const exist = await clientController.findOneClient(req.body.phone);
    if (!exist) {
      const client = new Client({
        name: req.body.name,
        address: req.body.address,
        phone: req.body.phone,
        debt_amount: moneyFormat(
          isNaN(req.body.debt_amount)
            ? Number(req.body.debt_amount)
            : req.body.debt_amount
        ),
      });
      try {
        const newClient = await client.save();
        res.status(201).json(newClient);
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
    } else {
      return res.status(403).json({ message: "Client  already exists" });
    }
  },

  updateClient: async (req, res) => {
    try {
      const client = await Client.findById(req.params.id);
      if (!client) {
        return res.status(404).json({ message: "Client not found" });
      }

      if (req.body.phone !== undefined) {
        client.phone = req.body.phone;
      }

      if (req.body.address !== undefined) {
        client.address = req.body.address;
      }

      const updatedClient = await client.save();
      res.json(updatedClient);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  deleteClient: async (req, res) => {
    console.log(req.params.id);
    try {
      const client = await Client.findById(req.params.id);
      if (!client) {
        return res.status(404).json({ message: "Client not found" });
      }

      await client.deleteOne();
      res.json({ message: "Client was deleted" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};
