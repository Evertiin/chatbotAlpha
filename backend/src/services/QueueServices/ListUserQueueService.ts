import { QueryTypes } from "sequelize";
import Queue from "../../models/Queue";

interface Request {
    tenantId: string | number;
    userId: string | number;
}
const ListUserQueueService = async ({ tenantId, userId }: Request): Promise<Queue[]> => {

    const query = `
    select q.* 
    from "Queues" q
    , "Users" u 
    , "UsersQueues" uq 
    where uq."queueId" = q.id 
    and uq."userId" = u.id 
    and u.id = :userId 
    and q."tenantId" = :tenantId
    `;
    const queueData: any = await Queue.sequelize?.query(query, {
        replacements: {
            tenantId,
            userId
        },
        type: QueryTypes.SELECT,
        nest: true
    });

    return queueData;
};

export default ListUserQueueService;
