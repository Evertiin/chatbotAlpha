import GetDefaultWhatsApp from "../../helpers/GetDefaultWhatsApp";
import { getWbot } from "../../libs/wbot-baileys";
import { logger } from "../../utils/logger";

const GetProfilePicUrl = async (
  number: string,
  tenantId: string | number
): Promise<string> => {
  try {
    const defaultWhatsapp = await GetDefaultWhatsApp(tenantId);
    const wbot = getWbot(defaultWhatsapp.id);
    const profilePicUrl = await wbot.profilePictureUrl(`${number}@s.whatsapp.net`);
    return profilePicUrl;
  } catch (error) {
    logger.error(`GetProfilePicUrl - ${error}`);
    return "";
  }
};

export default GetProfilePicUrl;
