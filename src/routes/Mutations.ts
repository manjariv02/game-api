import { GraphQLObjectType, GraphQLString, GraphQLNonNull } from "graphql";

//Player
import updatePlayer from "./player/updatePlayer";
import createFriendRequest from "./player/createFriendRequest";
import acceptFriendRequest from "./player/acceptFriendRequest";
import createLobby from "./lobby/createLobby";
import updateLobby from "./lobby/updateLobby";
import deleteLobby from "./lobby/deleteLobby";
import updateInventory from "./inventory/updateInventory";
import joinLobby from "./lobby/joinLobby";

const rootMutations = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    createFriendRequest,
    acceptFriendRequest,
    updatePlayer,
    updateInventory,
    createLobby,
    updateLobby,
    deleteLobby,
    joinLobby,
  },
});

export default rootMutations;
