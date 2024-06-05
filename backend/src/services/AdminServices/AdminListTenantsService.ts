import { Op } from "sequelize";
import Tenant from "../../models/Tenant";

const AdminListTenantsService = async (tenantId: number | string): Promise<Tenant[]> => {
  const tenants = await Tenant.findAll({
    order: [["name", "ASC"]],
    attributes: ["id", "name", "cnpj", "status", "ownerId", "maxUsers", "maxConnections", "enableIa", "apiKey"],
    where: {
      id: { [Op.ne]: tenantId }
    }
  });

  return tenants;
};

export default AdminListTenantsService;
