import { ServerConfigInterface } from '../global.interface';
import config from '../config';
import Redis = require('ioredis');

const client: Redis.Redis = new Redis({ port: config.redis.port, host: config.redis.host });








export default client;