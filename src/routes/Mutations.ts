import { GraphQLObjectType, GraphQLString, GraphQLNonNull } from "graphql";

//Player
import updatePlayer from "./player/updatePlayer";
import createFriendRequest from "./player/createFriendRequest";
import acceptFriendRequest from "./player/acceptFriendRequest";

const rootMutations = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    acceptFriendRequest,
    createFriendRequest,
    updatePlayer,
  },
});

export default rootMutations;
