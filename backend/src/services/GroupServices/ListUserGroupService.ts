import { QueryTypes } from "sequelize";
import Group from "../../models/Group";

interface Request {
    tenantId: string | number;
    userId: string | number;
}
const ListUserGroupService = async ({ tenantId, userId }: Request): Promise<Group[]> => {

    const query = `
    select q.* 
    from "Groups" q
    , "Users" u 
    , "UsersGroups" uq 
    where uq."groupId" = q.id 
    and uq."userId" = u.id 
    and u.id = :userId 
    and q."tenantId" = :tenantId
    `;
    const groupData: any = await Group.sequelize?.query(query, {
        replacements: {
            tenantId,
            userId
        },
        type: QueryTypes.SELECT,
        nest: true
    });

    return groupData;
};

export default ListUserGroupService;
