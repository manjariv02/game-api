import { GraphQLObjectType, GraphQLString, GraphQLNonNull } from "graphql";

//Player
import updatePlayer from "./player/updatePlayer";

const rootMutations = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    updatePlayer,
  },
});

export default rootMutations;
