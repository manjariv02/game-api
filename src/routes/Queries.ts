import { GraphQLObjectType, GraphQLString } from "graphql";
import getPlayers from "./player/getPlayers";
import getPlayer from "./player/getPlayer";
// import listFriendRequest from "./player/listFriendRequest";
// import listFriends from "./player/listFriends";
// import getAllLobby from "./lobby/getAllLobby";

const rootQuery = new GraphQLObjectType({
  name: "Query",
  fields: {
    getPlayer,
    // getPlayers,
    // listFriendRequest,
    // listFriends,
    // getAllLobby,
  },
});

export default rootQuery;
