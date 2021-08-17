import * as HTTP from "http";
import express from "express";
import { execute, subscribe } from "graphql";
import { schemaGeneral, schemaSubscription } from "./schema";
import { context as ctx } from "./context";
import { ApolloServer, gql } from "apollo-server-express";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";

const PORT = 4000;

async function run() {
  const apolloServerGeneral = new ApolloServer({
    schema: schemaGeneral,
    context: ctx,
    plugins: [
      ApolloServerPluginLandingPageGraphQLPlayground({
        endpoint: "http://localhost:4000/graphql",
      }),
    ],
  });

  const apolloServerSubscription = new ApolloServer({
    schema: schemaSubscription,
    // context,
    plugins: [
      ApolloServerPluginLandingPageGraphQLPlayground({
        endpoint: "http://localhost:4000/subscription",
      }),
    ],
  });

  const app = express();
  const httpSever = HTTP.createServer(app);

  await apolloServerGeneral.start();
  await apolloServerSubscription.start();

  apolloServerGeneral.applyMiddleware({ app, path: "/graphql" });
  apolloServerSubscription.applyMiddleware({ app, path: "/subscription" });

  SubscriptionServer.create(
    {
      schema: schemaSubscription,
      execute,
      subscribe,
      onConnect(connectionParams, webSocket, context) {
        console.log("Connected!");
        return ctx;
      },
      onDisconnect(webSocket, context) {
        console.log("Disconnected!");
      },
    },
    { server: httpSever, path: apolloServerSubscription.graphqlPath }
  );

  httpSever.listen(PORT, () => {
    console.log(`Server is now running on http://localhost:${PORT}/graphql`);
  });
  
}

run();
