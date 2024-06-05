import AppError from "../../errors/AppError";
import Group from "../../models/Group";

interface Request {
  id: string;
  tenantId: number | string;
}

const DeleteGroupService = async ({ id, tenantId }: Request): Promise<void> => {
  const group = await Group.findOne({
    where: { id, tenantId }
  });

  if (!group) {
    throw new AppError("ERR_NO_GROUP_FOUND", 404);
  }
  try {
    await group.destroy();
  } catch (error) {
    throw new AppError("ERR_GRUOP_NO_EXISTS", 404);
  }
};

export default DeleteGroupService;
