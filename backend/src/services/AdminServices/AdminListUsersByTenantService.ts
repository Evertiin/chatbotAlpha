
import User from "../../models/User";

const AdminListUsersByTenantService = async (tenantId): Promise<User[]> => {
  const users = await User.findAll({
    where: { tenantId }
  });

  return users;
};

export default AdminListUsersByTenantService;
