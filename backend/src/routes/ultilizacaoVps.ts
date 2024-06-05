import { Router } from "express";
import isAuth from "../middleware/isAuth";

const ultilizacaoRoutes = Router();

import { CheckServiceMessenger } from "../controllers/ulitlizacaoVpsController";

// Rota para obter informações de status do servidor
ultilizacaoRoutes.get("/status", isAuth, CheckServiceMessenger);

export default ultilizacaoRoutes;
