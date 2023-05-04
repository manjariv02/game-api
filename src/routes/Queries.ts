import { GraphQLObjectType, GraphQLString } from "graphql";
import getPlayer from "./player/getPlayer";
import listFriendRequest from "./player/listFriendRequest";
import listFriends from "./player/listFriends";

const user = {
  type: GraphQLString,
  resolve: () => "Hello",
};

const rootQuery = new GraphQLObjectType({
  name: "Query",
  fields: {
    getPlayer,
    listFriendRequest,
    listFriends,
  },
});

export default rootQuery;
