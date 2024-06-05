import * as Yup from "yup";
import { Request, Response } from "express";
import AppError from "../errors/AppError";

import CreateGruopService from "../services/GroupServices/CreateGroupService";
import ListGroupService from "../services/GroupServices/ListGroupService";
import UpdateGroupService from "../services/GroupServices/UpdateGroupService";
import DeleteGroupService from "../services/GroupServices/DeleteGroupService";
import ListUserGroupService from "../services/GroupServices/ListUserGroupService";
import FindUserByGroupService from "../services/UserGroupService/FindUserByGroupService";
import UsersGroups from "../models/UsersGroups";
import User from "../models/User";

interface GroupData {
  group: string;
  isActive: boolean;
  userId: number;
  tenantId: number | string;
}

export const store = async (req: Request, res: Response): Promise<Response> => {
  const { tenantId } = req.user;
  if (req.user.profile !== "admin") {
    throw new AppError("ERR_NO_PERMISSION", 403);
  }

  const newGroup: GroupData = { ...req.body, userId: req.user.id, tenantId };

  const schema = Yup.object().shape({
    group: Yup.string().required(),
    userId: Yup.number().required(),
    tenantId: Yup.number().required()
  });

  try {
    await schema.validate(newGroup);
  } catch (error) {
    throw new AppError(error.message);
  }

  const group = await CreateGruopService(newGroup);

  return res.status(200).json(group);
};

export const index = async (req: Request, res: Response): Promise<Response> => {
  const { tenantId } = req.user;
  const groups = await ListGroupService({ tenantId });
  return res.status(200).json(groups);
};

export const update = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { tenantId } = req.user;

  if (req.user.profile !== "admin") {
    throw new AppError("ERR_NO_PERMISSION", 403);
  }
  const groupData: GroupData = { ...req.body, userId: req.user.id, tenantId };

  const schema = Yup.object().shape({
    group: Yup.string().required(),
    isActive: Yup.boolean().required(),
    userId: Yup.number().required()
  });

  try {
    await schema.validate(groupData);
  } catch (error) {
    throw new AppError(error.message);
  }

  const { groupId } = req.params;
  const groupObj = await UpdateGroupService({
    groupData,
    groupId
  });

  return res.status(200).json(groupObj);
};

export const remove = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { tenantId } = req.user;
  if (req.user.profile !== "admin") {
    throw new AppError("ERR_NO_PERMISSION", 403);
  }
  const { groupId } = req.params;

  await DeleteGroupService({ id: groupId, tenantId });
  return res.status(200).json({ message: "Group deleted" });
};

export const listUserGroups = async (req: Request, res: Response): Promise<Response> => {
  const { tenantId, id } = req.user;
  const groups = await ListUserGroupService({ tenantId, userId: id });
  return res.status(200).json(groups);
};

export const listUserbyGroup = async (req: Request, res: Response): Promise<Response> => {
  const { groupId } = req.params;
  const users = await FindUserByGroupService(Number(groupId));
  return res.status(200).json(users);
}

export const storeUser = async (req: Request, res: Response): Promise<Response> => {
  const { groupId, userId } = req.body;
  let userGroup = await UsersGroups.findOne({ where: { userId, groupId } });
  if (userGroup) {
    throw new AppError("USER_GRPUP_ALREADY_EXIST", 400);
  }
  userGroup = await UsersGroups.create({ userId, groupId });
  return res.status(200).json(userGroup);
}

export const removeUser = async (req: Request, res: Response): Promise<Response> => {
  const { groupId, userId } = req.params;
  const userGroup = await UsersGroups.findOne({ where: { userId, groupId } });
  if (!userGroup) {
    throw new AppError("USER_GROUP_NOT_FOUND", 404);
  }
  await userGroup.destroy()
  return res.status(200).json(userGroup);
}

