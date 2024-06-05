import Queue from "../../models/Queue";
import Tenant from "../../models/Tenant";

interface Request {
    id: number | string;
    name: string;
    cnpj: string;
    maxUsers: number;
    maxConnections: number;
    enableIa: boolean;
    apiKey?: string;
}

const AdminUpdateTenantService = async ({
    id,
    name,
    cnpj,
    maxUsers,
    maxConnections,
    enableIa,
    apiKey
}: Request): Promise<any> => {

    const tenant = await Tenant.findByPk(id);

    await tenant!.update({
        name,
        cnpj,
        maxUsers,
        maxConnections,
        enableIa,
        apiKey
    });

    if (!enableIa) {
        await Queue.update({ from_ia: false, prompt: '' }, { where: { tenantId: id } });
    }

    const serialized = {
        id: tenant!.id,
        name: tenant!.name,
        cnpj: tenant!.cnpj,
        status: tenant!.status,
        ownerId: tenant!.ownerId,
        maxUsers: tenant!.maxUsers,
        maxConnections: tenant!.maxConnections,
        enableIa: tenant!.enableIa,
        apiKey: tenant!.apiKey,
    };

    return serialized;
};

export default AdminUpdateTenantService;
