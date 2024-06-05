import { Sequelize, Op, QueryTypes } from "sequelize";
import Contact from "../../models/Contact";
import { logger } from "../../utils/logger";
import sequelize from "../../database";

const ListAllContactsService = async (
  tenantId
 ): Promise<any> => {

  const contacts = Contact.findAll({
    where: {
        tenantId },
    });

  return contacts;
};

export default ListAllContactsService;
