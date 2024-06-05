import { Request, Response } from "express";
import { number } from "yup";
import { getIO } from "../libs/socket";
import AdminListChatFlowService from "../services/AdminServices/AdminListChatFlowService";
import AdminListSettingsService from "../services/AdminServices/AdminListSettingsService";
import AdminListTenantsService from "../services/AdminServices/AdminListTenantsService";
import AdminListUsersService from "../services/AdminServices/AdminListUsersService";
import AdminListChannelsService from "../services/AdminServices/AdminListChannelsService";
import AdminUpdateUserService from "../services/AdminServices/AdminUpdateUserService";
import UpdateSettingService from "../services/SettingServices/UpdateSettingService";
import AppError from "../errors/AppError";
import CreateWhatsAppService from "../services/WhatsappService/CreateWhatsAppService";
import CreateUserService from "../services/UserServices/CreateUserService";
import { CreateTenantService } from "../services/AdminServices/AdminCreateTenantService";
import ShowTicketService from "../services/TicketServices/ShowTicketService";
import AdminStatusTenant from "../services/AdminServices/AdminStatusTenant";
import AdminUpdateTenantService from "../services/AdminServices/AdminUpdateTenantService";
import AdminListUsersByTenantService from "../services/AdminServices/AdminListUsersByTenantService";

type IndexQuery = {
  searchParam: string;
  pageNumber: string;
};

type IndexQuerySettings = {
  tenantId?: string | number;
};

interface ChannelData {
  name: string;
  status?: string;
  isActive?: string;
  tokenTelegram?: string;
  instagramUser?: string;
  instagramKey?: string;
  type: "waba" | "instagram" | "telegram" | "whatsapp";
  wabaBSP?: string;
  tokenAPI?: string;
  tenantId: string | number;
}

export const store = async (req: Request, res: Response): Promise<Response> => {
  const { tenantName, status, email, password, name, cnpj, maxUsers, maxConnections, enableIa, apiKey } = req.body;
  const { tenantId } = req.user;
  const tenant = await CreateTenantService({
    name: tenantName,
    status: 'active',
    cnpj,
    tenantId,
    maxUsers,
    maxConnections,
    enableIa,
    apiKey
  });
  const user = await CreateUserService({
    email: email,
    password: password,
    name: name,
    tenantId: tenant.id,
    profile: "admin",
    configs: { "filtrosAtendimento": { "searchParam": "", "pageNumber": 1, "status": ["open", "pending"], "showAll": true, "count": null, "queuesIds": [], "withUnreadMessages": false, "isNotAssignedUser": false, "includeNotQueueDefined": true }, "isDark": false }
  });
  // const io = getIO();
  // io.emit(`${tenantId}:tenant`, {
  //   action: "create",
  //   tenant
  // });  

  return res.status(200).json({ tenant, user });
};


export const indexUsers = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { searchParam, pageNumber } = req.query as IndexQuery;
  const { users, count, hasMore } = await AdminListUsersService({
    searchParam,
    pageNumber
  });
  return res.status(200).json({ users, count, hasMore });
};

export const getUsersByTenant = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { tenantId } = req.params;
  const users = await AdminListUsersByTenantService(tenantId);
  return res.status(200).json({ users });
};


export const updateUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const userData = req.body;
  const { userId } = req.params;

  const user = await AdminUpdateUserService({ userData, userId });

  const io = getIO();
  if (user) {
    io.emit(`${user.tenantId}:user`, {
      action: "update",
      user
    });
  }

  return res.status(200).json(user);
};

export const indexTenants = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { tenantId } = req.user;
  const tenants = await AdminListTenantsService(tenantId);
  return res.status(200).json(tenants);
};

export const indexChatFlow = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { tenantId } = req.params;
  const chatFlow = await AdminListChatFlowService({ tenantId });
  return res.status(200).json(chatFlow);
};

export const indexSettings = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { tenantId } = req.params as IndexQuerySettings;
  const settings = await AdminListSettingsService(tenantId);

  return res.status(200).json(settings);
};

export const updateSettings = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { tenantId } = req.params;
  const { value, key } = req.body;

  const setting = await UpdateSettingService({
    key,
    value,
    tenantId
  });

  const io = getIO();
  io.emit(`${tenantId}:settings`, {
    action: "update",
    setting
  });

  return res.status(200).json(setting);
};

export const indexChannels = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { tenantId } = req.query as any;
  const channels = await AdminListChannelsService({ tenantId });
  return res.status(200).json(channels);
};

export const storeChannel = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const {
    name,
    tenantId,
    tokenTelegram,
    instagramUser,
    instagramKey,
    type,
    wabaBSP,
    tokenAPI
  } = req.body;

  const data: ChannelData = {
    name,
    status: "DISCONNECTED",
    tenantId,
    tokenTelegram,
    instagramUser,
    instagramKey,
    type,
    wabaBSP,
    tokenAPI
  };

  const channels = await CreateWhatsAppService(data);
  return res.status(200).json(channels);
};

export const updateStatusEmpresa = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const {
    tenantId
  } = req.params;

  const {
    status
  } = req.body;

  if (tenantId == '1') {
    throw new AppError("Ação não permitida");
  }

  const tenant = await AdminStatusTenant({ id: tenantId, status })
  return res.status(200).json(tenant);
};

export const adminUpdateTenant = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const {
    tenantId
  } = req.params;

  const {
    name,
    cnpj,
    maxUsers,
    maxConnections,
    enableIa,
    apiKey
  } = req.body;

  if (tenantId == '1') {
    throw new AppError("Ação não permitida");
  }

  const tenant = await AdminUpdateTenantService({ id: tenantId, name, cnpj, maxUsers, maxConnections, enableIa, apiKey })
  return res.status(200).json(tenant);
};
