/* eslint-disable eqeqeq */
import { QueryTypes } from "sequelize";
import Group from "../../models/Group";

const ListGroupsByUserId = async (userId: number): Promise<any> => {

    const query = `
    select distinct
    g.id
    , g."group" as name
    , ( 
        select count(mi.*)
        from "InternalMessage" mi
        where mi."groupId"  = g.id
        and mi."senderId" != :userId
        and mi.id not in ( 
            select rmg."internalMessageId"
              from "ReadMessageGroups" rmg,
                   "InternalMessage" im2 
             where rmg."userGroupId" = ug.id 
               and rmg."internalMessageId" = im2.id  
        )
    ),
    mm_last_message."text",
    mm_last_message."timestamp"
    from "Groups" g,
         "UsersGroups" ug
    left join LATERAL (
            select 
                mi1."text"
                , mi1."timestamp"
                , mi1."groupId" 
                , mi1."senderId"
            from "InternalMessage" mi1
            where mi1."createdAt" = (
                select max("createdAt") 
                 from "InternalMessage" mi2 
                where mi2."groupId" = g.id
            )
        ) AS mm_last_message ON true
    where ug."userId" = :userId
    and ug."groupId" = g.id
    and g."isActive" = true
    `;

    const groups: any = await Group.sequelize?.query(query, {
        replacements: {
            userId
        },
        type: QueryTypes.SELECT,
        nest: true
    });

    return groups;
};

export default ListGroupsByUserId;
