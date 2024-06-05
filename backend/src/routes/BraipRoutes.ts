import express from "express";
import * as BraipController from "../controllers/BraipController";

const braipRoutes = express.Router();

braipRoutes.use(express.json());


braipRoutes.post('/braip-postback/:tenantId', BraipController.handlePostback);

export default braipRoutes;
