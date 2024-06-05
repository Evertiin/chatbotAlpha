import Group from "../../models/Group";

interface Request {
  group: string;
  isActive: boolean;
  userId: number;
  tenantId: number | string;
}

const CreateGruopService = async ({
  group,
  isActive,
  userId,
  tenantId
}: Request): Promise<Group> => {
  const groupData = await Group.create({
    group,
    isActive,
    userId,
    tenantId
  });

  return groupData;
};

export default CreateGruopService;
