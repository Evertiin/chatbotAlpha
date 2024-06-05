import InternalMessage from '../../models/InternalMessage';

const ListCountUnreadMessage = async (userId: number) => {
    const count = await InternalMessage.count({
        where: {
            receiverId: userId,
            read: false
        }
    })

    return count
}

export default ListCountUnreadMessage;