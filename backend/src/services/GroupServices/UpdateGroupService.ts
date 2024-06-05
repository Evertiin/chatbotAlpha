import AppError from "../../errors/AppError";
import Group from "../../models/Group";

interface GroupData {
  group: string;
  isActive: boolean;
  userId: number;
  tenantId: number | string;
}

interface Request {
  groupData: GroupData;
  groupId: string;
}

const UpdateGroupService = async ({
  groupData,
  groupId
}: Request): Promise<Group> => {
  const { group, isActive, userId, tenantId } = groupData;

  const groupModel = await Group.findOne({
    where: { id: groupId, tenantId },
    attributes: ["id", "group", "isActive", "userId"]
  });

  if (!groupModel) {
    throw new AppError("ERR_NO_GROUP_FOUND", 404);
  }

  await groupModel.update({
    group,
    isActive,
    userId
  });

  await groupModel.reload({
    attributes: ["id", "group", "isActive", "userId"]
  });

  return groupModel;
};

export default UpdateGroupService;
