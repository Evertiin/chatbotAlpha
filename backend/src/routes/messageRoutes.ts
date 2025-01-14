import { Router } from "express";
import multer from "multer";
import isAuth from "../middleware/isAuth";
import uploadConfig from "../config/upload";

import * as MessageController from "../controllers/MessageController";

const messageRoutes = Router();

const upload = multer(uploadConfig);

messageRoutes.get("/messages/:ticketId", isAuth, MessageController.index);
messageRoutes.get("/count/messages", isAuth, MessageController.ListCountMensagens );

messageRoutes.post(
  "/messages/:ticketId",
  isAuth,
  upload.array("medias"),
  MessageController.store
);

messageRoutes.post("/forward-messages/", isAuth, MessageController.forward);

messageRoutes.delete("/messages/:messageId", isAuth, MessageController.remove);

export default messageRoutes;
