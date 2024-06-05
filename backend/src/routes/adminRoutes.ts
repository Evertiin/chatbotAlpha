import express from "express";
import * as AdminController from "../controllers/AdminController";
import isAuthAdmin from "../middleware/isAuthAdmin";

const adminRoutes = express.Router();

adminRoutes.get("/admin/users", isAuthAdmin, AdminController.indexUsers);
adminRoutes.put(
  "/admin/users/:userId",
  isAuthAdmin,
  AdminController.updateUser
);
adminRoutes.post("/admin/tenants", isAuthAdmin, AdminController.store);
adminRoutes.get("/admin/tenants", isAuthAdmin, AdminController.indexTenants);
adminRoutes.get(
  "/admin/chatflow/:tenantId",
  isAuthAdmin,
  AdminController.indexChatFlow
);

adminRoutes.get(
  "/admin/users/:tenantId",
  isAuthAdmin,
  AdminController.getUsersByTenant
);

adminRoutes.put(
  "/admin/settings/:tenantId",
  isAuthAdmin,
  AdminController.updateSettings
);

adminRoutes.put(
  "/admin/status/tenant/:tenantId",
  isAuthAdmin,
  AdminController.updateStatusEmpresa
);

adminRoutes.put(
  "/admin/empresa/:tenantId",
  isAuthAdmin,
  AdminController.adminUpdateTenant
);

adminRoutes.get("/admin/channels", isAuthAdmin, AdminController.indexChannels);
adminRoutes.post("/admin/channels", isAuthAdmin, AdminController.storeChannel);

export default adminRoutes;
