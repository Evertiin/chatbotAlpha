import AppError from '../../errors/AppError';
import InternalMessage from '../../models/InternalMessage';
import ReadMessageGroups from '../../models/ReadMessageGroups';
import UsersGroups from './../../models/UsersGroups';

interface Request {
    senderId: number;
    userId: number;
    isGroup: boolean;
}

const ReadMessageService = async ({ senderId, userId, isGroup }: Request) => {

    if (isGroup === false) {
        await InternalMessage.update(
            { read: true },
            {
                where: {
                    senderId: senderId,
                    receiverId: userId
                }
            }
        )
    } else {
        const userGroup = await UsersGroups.findOne({ where: { groupId: senderId, userId } });

        if (!userGroup) {
            new AppError("USER_GROUP_NOT_FOUND", 404)
        }

        const messages = await InternalMessage.findAll({ where: { groupId: userGroup.groupId } })

        messages.forEach(async (message) => {
            const readMessage = await ReadMessageGroups.findAll({ where: { internalMessageId: message.id, userGroupId: userGroup.id } })

            if (readMessage.length <= 0) {
                const data = {
                    internalMessageId: message.id,
                    userGroupId: userGroup.id
                }
                await ReadMessageGroups.create(data);
            }
        })

    }
}

export default ReadMessageService;
