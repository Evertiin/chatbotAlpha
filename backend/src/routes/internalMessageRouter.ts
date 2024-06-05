import { Router } from 'express';
import * as InternalMessage from '../controllers/InternalMessageController';
import isAuth from '../middleware/isAuth';
import multer from "multer";
import uploadConfig from "../config/upload";

const internalMessageRouter = Router();
const upload = multer(uploadConfig);

internalMessageRouter.get('/chat-interno/mensagens/:userId', isAuth, InternalMessage.listarMensagens);
internalMessageRouter.get('/chat-interno/count/mensagens', isAuth, InternalMessage.listCountUnreadMessage);
internalMessageRouter.post('/chat-interno/mensagens', isAuth, upload.array("medias"), InternalMessage.criarMensagem);
internalMessageRouter.put('/chat-interno/mensagens/:mensagemId/nao-lida', isAuth, InternalMessage.marcarMensagemNaoLida);
internalMessageRouter.put('/chat-interno/mensagens/:contactId', isAuth, InternalMessage.marcarMensagemNaoLida);

export default internalMessageRouter;
