import { GraphQLObjectType, GraphQLString } from "graphql";
import getPlayer from "./player/getPlayer";

const user = {
  type: GraphQLString,
  resolve: () => "Hello",
};

const rootQuery = new GraphQLObjectType({
  name: "Query",
  fields: {
    getPlayer,
  },
});

export default rootQuery;
