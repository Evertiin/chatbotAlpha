import Tenant from "../../models/Tenant";

interface Request {
  id: number | string;
  status: string;
}

const AdminStatusTenant = async ({
  id,
  status
}: Request): Promise<any> => {

  const tenant = await Tenant.findByPk(id);

  await tenant!.update({
    status
  });

  const serialized = {
    id: tenant!.id,
    name: tenant!.name,
    cnpj: tenant!.cnpj,
    status: status,
    ownerId: tenant!.ownerId
  };

  return serialized;
};

export default AdminStatusTenant;
