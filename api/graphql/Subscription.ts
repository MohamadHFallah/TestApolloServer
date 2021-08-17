import { intArg, subscriptionField } from "nexus";
import { POST_CREATED } from "./Post";

export const Subscription = subscriptionField("post", {
  type: "Post",
  args: {
    id: intArg(),
  },
  subscribe: async (_root, args, ctx) => {
    return ctx.pubsub.asyncIterator([POST_CREATED]);
  },
  resolve: (payload) => {
    return payload;
  },
});
