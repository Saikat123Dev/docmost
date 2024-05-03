import * as path from 'path';
import * as bcrypt from 'bcrypt';

export const envPath = path.resolve(process.cwd(), '..', '..', '.env');

export function generateHostname(name: string): string {
  let hostname = name.replace(/[^a-z0-9]/gi, '').toLowerCase();
  hostname = hostname.substring(0, 30);
  return hostname;
}

export async function hashPassword(password: string) {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

export async function comparePasswordHash(
  plainPassword: string,
  passwordHash: string,
): Promise<boolean> {
  return bcrypt.compare(plainPassword, passwordHash);
}

export function getRandomInt(min = 4, max = 5) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export type RedisConfig = {
  host: string;
  port: number;
  password?: string;
};
export function parseRedisUrl(redisUrl: string): RedisConfig {
  // format - redis[s]://[[username][:password]@][host][:port][/db-number]
  const { hostname, port, password } = new URL(redisUrl);
  const portInt = parseInt(port, 10);

  return { host: hostname, port: portInt, password };
}
