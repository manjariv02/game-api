import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLInt,
} from "graphql";
import { ILobby } from "../../db/models/Lobby";

const LobbyType = new GraphQLObjectType<ILobby>({
  name: "Lobby",
  fields: () => ({
    _id: { type: new GraphQLNonNull(GraphQLID) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    players: { type: new GraphQLNonNull(new GraphQLList(GraphQLID)) },
    playerInventory: {
      type: new GraphQLNonNull(
        new GraphQLList(
          new GraphQLObjectType({
            name: "PlayerInventory",
            fields: () => ({
              playerId: { type: new GraphQLNonNull(GraphQLID) },
              inventory: { type: new GraphQLNonNull(GraphQLID) },
            }),
          })
        )
      ),
    },
    host: { type: new GraphQLNonNull(GraphQLID) },
    progress: {
      type: new GraphQLObjectType({
        name: "Progress",
        fields: () => ({
          season: { type: new GraphQLNonNull(GraphQLInt) },
          episode: { type: new GraphQLNonNull(GraphQLInt) },
          level: { type: new GraphQLNonNull(GraphQLInt) },
        }),
      }),
    },
  }),
});

export default LobbyType;
