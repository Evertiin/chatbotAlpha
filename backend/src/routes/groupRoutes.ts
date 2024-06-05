import express from "express";
import isAuth from "../middleware/isAuth";

import * as GroupController from "../controllers/GroupController";

const groupRoutes = express.Router();

groupRoutes.post("/group/user", isAuth, GroupController.storeUser);
groupRoutes.post("/group", isAuth, GroupController.store);
groupRoutes.get("/group", isAuth, GroupController.index);
groupRoutes.get("/group/:groupId", isAuth, GroupController.listUserbyGroup);
groupRoutes.get("/group/user", isAuth, GroupController.listUserGroups);
groupRoutes.put("/group/:groupId", isAuth, GroupController.update);
groupRoutes.delete("/group/:groupId", isAuth, GroupController.remove);
groupRoutes.delete("/group/user/:userId/:groupId", isAuth, GroupController.removeUser);

export default groupRoutes;
