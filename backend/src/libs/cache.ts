import Redis from "ioredis";
import util from "util";
import * as crypto from "crypto";

const redis = new Redis(process.env.REDIS_URI || "");

function encryptParams(params: any) {
  const str = JSON.stringify(params);
  return crypto.createHash("sha256").update(str).digest("base64");
}

export function setFromParams(
  key: string,
  params: any,
  value: string,
  option?: string,
  optionValue?: string | number
) {
  const finalKey = `${key}:${encryptParams(params)}`;
  if (option !== undefined && optionValue !== undefined) {
    return set(finalKey, value, option, optionValue);
  }
  return set(finalKey, value);
}

export function getFromParams(key: string, params: any) {
  const finalKey = `${key}:${encryptParams(params)}`;
  return get(finalKey);
}

export function delFromParams(key: string, params: any) {
  const finalKey = `${key}:${encryptParams(params)}`;
  return del(finalKey);
}

export function set(
  key: string,
  value: string,
  option?: string,
  optionValue?: string | number
) {
  const setPromisefy = util.promisify(redis.set).bind(redis);
  if (option !== undefined && optionValue !== undefined) {
    return setPromisefy(key, value);
  }

  return setPromisefy(key, value);
}

export function get(key: string) {
  const getPromisefy = util.promisify(redis.get).bind(redis);
  return getPromisefy(key);
}

export function getKeys(pattern: string) {
  const getKeysPromisefy = util.promisify(redis.keys).bind(redis);
  return getKeysPromisefy(pattern);
}

export function del(key: string) {
  const delPromisefy = util.promisify(redis.del).bind(redis);
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  return delPromisefy(key);
}

export async function delFromPattern(pattern: string) {
  const all = await getKeys(pattern);
  for (let item of all!) {
    del(item);
  }
}

export const cacheLayer = {
  set,
  setFromParams,
  get,
  getFromParams,
  getKeys,
  del,
  delFromParams,
  delFromPattern
};
