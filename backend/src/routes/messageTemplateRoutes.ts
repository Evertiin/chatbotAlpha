import express from "express";
import isAuth from "../middleware/isAuth";
import MessageTemplateController from "../controllers/MessageTemplateController";

const messageTemplateRoutes = express.Router();

messageTemplateRoutes.post("/message-templates", isAuth, MessageTemplateController.createMessageTemplate.bind(MessageTemplateController));
messageTemplateRoutes.get('/message-templates', MessageTemplateController.listMessageTemplates.bind(MessageTemplateController));
messageTemplateRoutes.put('/message-templates', MessageTemplateController.updateMessageTemplate.bind(MessageTemplateController))
export default messageTemplateRoutes;
