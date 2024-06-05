import * as Yup from "yup";
import AppError from "../../errors/AppError";
import Tenant from "../../models/Tenant";
import CreateDefaultSettings from "../SettingServices/CreateDefaultSettings";

interface Request {
  name: string;
  status: string;
  cnpj: string;
  tenantId: number | string;
  maxUsers: number;
  maxConnections: number;
  enableIa: boolean;
  apiKey?: string;
}

interface Response {
  name: string;
  id: number;
  status: string;
  cnpj: string;
}

export const CreateTenantService = async ({
  name,
  status,
  cnpj,
  tenantId,
  maxUsers,
  maxConnections,
  enableIa,
  apiKey
}: Request): Promise<Response> => {
  const schema = Yup.object().shape({
    name: Yup.string().required().min(2),
  });

  try {
    await schema.validate({ name });
  } catch (err) {
    throw new AppError(err.message);
  }

  const tenant = await Tenant.create({
    name,
    status,
    cnpj,
    maxUsers,
    maxConnections,
    ownerId: tenantId,
    enableIa,
    apiKey
  });

  const settings = CreateDefaultSettings(tenant.id);

  await tenant.update({ settings });

  const serializeTenant = {
    id: tenant.id,
    name: tenant.name,
    status: tenant.status,
    cnpj: tenant.cnpj,
    maxUsers: tenant.maxUsers,
    maxConnections: tenant.maxConnections,
    ownerId: tenant.ownerId,
    enableIa: tenant.enableIa,
    apiKey: tenant.apiKey,
  };

  return serializeTenant;
};
