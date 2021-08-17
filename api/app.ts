import * as HTTP from "http";
import express from "express";
import { schemaGeneral, schemaSubscription } from "./schema";
import { context } from "./context";
import { ApolloServer } from "apollo-server-express";

const PORT = 4000;

export const apolloServerGeneral = new ApolloServer({
  schema: schemaGeneral,
  context,
});

export const apolloServerSubscription = new ApolloServer({
  schema: schemaSubscription,
  context,
  // playground: {
  //   endpoint: "http://localhost:4000/subscriptions",
  //   subscriptionEndpoint: "ws://localhost:4000/subscriptions",
  // },
  subscriptions: {
    path: "/subscriptions",
    onConnect: (connectionParams, webSocket, context) => {
      console.log("Client connected");
    },
    onDisconnect: (webSocket, context) => {
      console.log("Client disconnected");
    },
  },
});

const app = express();

apolloServerGeneral.applyMiddleware({ app, path: "/graphql" });
apolloServerSubscription.applyMiddleware({ app, path: "/subscriptions"  });

const httpSever = HTTP.createServer(app);

apolloServerSubscription.installSubscriptionHandlers(httpSever);

httpSever.listen(PORT, () => {
  console.log(
    `apolloServerGeneral http://localhost:${PORT}${apolloServerGeneral.graphqlPath}`
  );

  console.log(
    `apolloServerSubscription http://localhost:${PORT}${apolloServerSubscription.graphqlPath}`
  );
  console.log(
    `apolloServerSubscription ws://localhost:${PORT}${apolloServerSubscription.subscriptionsPath}`
  );
});
