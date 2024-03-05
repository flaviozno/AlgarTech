import express from "express";
const router = express.Router();
import { clientController } from "../controllers/index.js";
import { fileController } from "../controllers/file.js";
import multer from "multer";

const upload = multer({ dest: "uploads/" });

router.post("/file", upload.single("csvFile"), fileController.uploadCSV);

router.get("/clients/", clientController.getClients);
router.get("/clients/reload", clientController.reloadDB);
router.post("/clients/", clientController.insertClient);
router.put("/clients/:id", clientController.updateClient);
router.delete("/clients/:id", clientController.deleteClient);

export default router;
