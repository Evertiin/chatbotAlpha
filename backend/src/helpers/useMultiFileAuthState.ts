import {
  proto,
  AuthenticationCreds,
  AuthenticationState,
  initAuthCreds,
  BufferJSON
} from "@whiskeysockets/baileys";
import Whatsapp from "../models/Whatsapp";
import { cacheLayer } from "../libs/cache";

export const useMultiFileAuthState = async (
  whatsapp: Whatsapp
): Promise<{ state: AuthenticationState; saveCreds: () => Promise<void> }> => {
  const writeData = async (data: any, file: string): Promise<void> => {
    try {

      if (file === 'creds') {
        await cacheLayer.set(
          `sessions:${whatsapp.id}:${file}`,
          JSON.stringify(data, BufferJSON.replacer),
          'EX',
          60 * 60 * 24 * 365

        );
      }

      if (file !== 'creds') {
        await cacheLayer.set(
          `sessions:${whatsapp.id}:${file}`,
          JSON.stringify(data, BufferJSON.replacer),
          'EX',
          60 * 60 * 24 * 2
        );
      }


    } catch (error) {
      console.log("writeData error", error);
    }
  };

  const readData = async (file: string) => {
    try {
      const data = await cacheLayer.get(`sessions:${whatsapp.id}:${file}`);

      if (data) {
        return JSON.parse(data, BufferJSON.reviver);
      }
      return null;
    } catch (error) {
      console.log("Read data error", error);
      return null;
    }
  };

  const removeData = async (file: string) => {
    try {
      await cacheLayer.del(`sessions:${whatsapp.id}:${file}`);
    } catch (error) {
      console.log("removeData", error);
    }
  };

  const creds: AuthenticationCreds =
    (await readData("creds")) || initAuthCreds();

  return {
    state: {
      creds,
      keys: {
        get: async (type, ids) => {
          const data = {};
          await Promise.all(
            ids.map(async id => {
              let value = await readData(`${type}-${id}`);
              if (type === "app-state-sync-key") {
                value = proto.Message.AppStateSyncKeyData.fromObject(value);
              }
              data[id] = value;
            })
          );
          return data;
        },
        set: async data => {
          const tasks: Promise<void>[] = [];
          // eslint-disable-next-line no-restricted-syntax, guard-for-in
          for (const category in data) {
            // eslint-disable-next-line no-restricted-syntax, guard-for-in
            for (const id in data[category]) {
              const value = data[category][id];
              const file = `${category}-${id}`;
              tasks.push(value ? writeData(value, file) : removeData(file));
            }
          }

          await Promise.all(tasks);
        }
      }
    },
    saveCreds: () => {
      return writeData(creds, "creds");
    }
  };
};