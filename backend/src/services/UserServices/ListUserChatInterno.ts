/* eslint-disable eqeqeq */
import { QueryTypes } from "sequelize";
import User from "../../models/User";


const ListUserChatInterno = async (id: number, tenantId: number): Promise<any> => {

    const query = `
    select 
        u.id
        , u."name"
        , u.email
        , u.profile
        , u."isOnline"
        , ( select count(*) from "InternalMessage" mi where (mi."senderId" = u.id and mi."receiverId" = :id) and mi."read" = false )
        , mm_last_message."text"
        , mm_last_message."timestamp"
        , mm_last_message."read"
    from "Users" u
    left join LATERAL (
        select 
            mi1."text"
            , mi1."timestamp"
            , mi1."read"
            , mi1."senderId"
            , mi1."receiverId" 
        from "InternalMessage" mi1
        where mi1."createdAt" = (select max("createdAt") 
                                from "InternalMessage" mi2 
                                where (mi2."senderId" = :id and mi2."receiverId" = u.id) 
                                    or (mi2."senderId" = u.id and mi2."receiverId" = :id))
    ) AS mm_last_message ON true
    where u.id != :id 
    and u."tenantId" = :tenantId
    `;

    const users: any = await User.sequelize?.query(query, {
        replacements: {
            id,
            tenantId
        },
        type: QueryTypes.SELECT,
        nest: true
    });

    return users;
};

export default ListUserChatInterno;
