import { makeExecutableSchema } from "@graphql-tools/schema";
import { makeSchema } from "nexus";
import { join } from "path";
import { Post, PostQuery, PostMutation } from "./graphql/Post";
import { Subscription } from "./graphql/Subscription";

export const schemaGeneral = makeSchema({
  types: [Post, PostQuery, PostMutation,Subscription],
  outputs: {
    typegen: join(__dirname, "..", "nexus-typegen.ts"),
    schema: join(__dirname, "..", "schema.graphql"),
  },
  contextType: {
    module: join(__dirname, "./context.ts"),
    export: "Context",
  },
});

export const schemaSubscription = makeSchema({
  types: [Post, Subscription],
  outputs: {
    typegen: join(__dirname, "..", "nexus-typegen.ts"),
    schema: join(__dirname, "..", "schema.graphql"),
  },
  contextType: {
    module: join(__dirname, "./context.ts"),
    export: "Context",
  },
});
