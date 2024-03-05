import { populateDB } from "../services/index.js";
import { Client } from "../models/index.js";
import fs from "fs";

export const fileController = {
  uploadCSV: async (req, res) => {
    try {
      const csvFile = req.file;
      if (csvFile) {
        Client.deleteMany({});
        await populateDB(csvFile.path);
        fs.unlinkSync(csvFile.path);
        
        res
          .status(200)
          .json({ message: "File was uploaded and saved successfully!" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};
