import AppError from "../../errors/AppError";
import Group from "../../models/Group";

const GetGroupService = async (groupId): Promise<Group> => {

  const groupModel = await Group.findByPk(groupId);

  if (!groupModel) {
    throw new AppError("ERR_NO_GROUP_FOUND", 404);
  }

  return groupModel;
};

export default GetGroupService;
