import express from 'express';
const router = express.Router();
import {clientController} from '../controllers/index.js';

router.get('/clients/', clientController.getClients);
router.get('/clients/reload', clientController.reloadDB);
router.post('/clients/', clientController.insertClient);
router.put('/clients/:id', clientController.updateClient);
router.delete('/clients/:id', clientController.deleteClient);

export default router;
