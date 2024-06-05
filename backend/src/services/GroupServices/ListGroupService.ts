import Group from "../../models/Group";

interface Request {
  tenantId: string | number;
}
const ListGroupService = async ({ tenantId }: Request): Promise<Group[]> => {
  return await Group.findAll({
    where: {
      tenantId
    },
    order: [["group", "ASC"]]
  });
};

export default ListGroupService;
