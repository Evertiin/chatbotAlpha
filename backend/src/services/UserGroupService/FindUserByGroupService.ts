/* eslint-disable eqeqeq */
import User from "../../models/User";
import UsersGroups from "../../models/UsersGroups";


const FindUserByGroupService = async (groupId: number): Promise<any> => {

    return await UsersGroups.findAll({
        where: { groupId },
        include: [
            {
                model: User,
                as: 'user'
            }
        ]
    })

};

export default FindUserByGroupService;
