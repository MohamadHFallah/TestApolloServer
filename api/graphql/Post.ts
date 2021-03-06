import { PubSub } from "apollo-server";
import {
  objectType,
  extendType,
  nonNull,
  stringArg,
  intArg,
} from "nexus";

export const POST_CREATED = 'POST_CREATED';

export const Post = objectType({
  name: "Post",
  definition(t) {
    t.int("id"), t.string("title"), t.string("body"), t.boolean("published");
  },
});


export const PostQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.field("drafts", {
      type: "Post",
      resolve(_root, _args, ctx) {
        return ctx.db.posts.filter((p) => p.published === false);
        // return [{ id: 1, title: "Nexus", body: "..", published: false }];
      },
    });
  },
});

export const PostMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("createDraft", {
      type: "Post",
      args: {
        title: nonNull(stringArg()),
        body: stringArg(),
      },
      resolve: async(_root, args, ctx)=> {        
        const draft = {
          id:  1,
          title: args.title,
          body: args.body,
          published: true,
        };
        ctx.pubsub.publish(POST_CREATED, { post: draft });
        ctx.db.posts.push(draft);
        return draft;
      },
    });
    t.field("publish", {
      type: "Post",
      args: {
        draftId: nonNull(intArg()),
      },
      resolve(_root, args, ctx) {
        let draftToPublish = ctx.db.posts.find((p) => (p.id = args.draftId));
        console.log("draftToPublish ", draftToPublish);

        if (!draftToPublish) {
          throw new Error("Could not find draft with id " + args.draftId);
        }

        draftToPublish.published = true;
        return draftToPublish;
      },
    });
  },
});


