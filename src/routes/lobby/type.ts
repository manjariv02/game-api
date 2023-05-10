import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLInt,
} from "graphql";
import { ILobby } from "../../db/models/Lobby";
import { PlayerType } from "../player/type";
import InventoryType from "../inventory/type";
import { responseType } from "../Types";

export interface LobbyResponse extends responseType {
  result?: ILobby;
  results?: ILobby[];
}

export const LobbyType = new GraphQLObjectType<ILobby>({
  name: "Lobby",
  fields: () => ({
    _id: { type: new GraphQLNonNull(GraphQLString) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    players: { type: new GraphQLNonNull(new GraphQLList(PlayerType)) },
    playerInventory: {
      type: new GraphQLNonNull(
        new GraphQLList(
          new GraphQLObjectType({
            name: "PlayerInventory",
            fields: () => ({
              playerId: { type: new GraphQLNonNull(PlayerType) },
              inventory: { type: new GraphQLNonNull(InventoryType) },
            }),
          })
        )
      ),
    },
    host: { type: new GraphQLNonNull(PlayerType) },
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

const LobbyResponseType = new GraphQLObjectType<LobbyResponse>({
  name: "Lobbies",
  fields: () => ({
    result: { type: LobbyType },
    results: { type: new GraphQLList(LobbyType) },
    status: { type: GraphQLInt },
    error: { type: GraphQLString },
  }),
});

export default LobbyResponseType;
