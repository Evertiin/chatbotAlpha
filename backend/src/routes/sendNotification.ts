import express from "express";
import isAuth from "../middleware/isAuth";
import * as NotificationController from "../controllers/NotificationController";

const sendNotificationRoutes = express.Router();

sendNotificationRoutes.post("/send-notification", NotificationController.sendNotification);

export default sendNotificationRoutes;
