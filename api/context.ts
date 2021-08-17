import { PubSub } from "graphql-subscriptions";
import { RedisPubSub } from "graphql-redis-subscriptions";
import { Db, db } from "./db";
import * as Redis from 'ioredis';

const dateReviver = (_key, value: string) => {
  // By default, Javascript objects are serialized using the JSON.stringify and JSON.parse methods.
  // This means that not all objects - such as Date or Regexp objects - will deserialize correctly without a custom reviver, that work out of the box with the default in-memory implementation.
  // For handling such objects, you may pass your own reviver function to JSON.parse.
};

const redisOptions = {
  host: "127.0.0.1",
  port: 6379,
  retryStrategy: times => {
    // reconnect after
    return Math.min(times * 50, 2000);
  }
};


export interface context {
  db: Db;
}
export const context = {
  db,
  pubsub:
    process.env.NODE_ENV === "development"
      ? new PubSub()
      : new RedisPubSub({
          publisher: new Redis(redisOptions),
          subscriber: new Redis(redisOptions),
          reviver : dateReviver
        }),
};

