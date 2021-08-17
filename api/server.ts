import { ApolloServer } from "apollo-server";
import { schemaGeneral } from "./schema";
import {context} from './context'
export const server = new ApolloServer({schema:schemaGeneral , context });
