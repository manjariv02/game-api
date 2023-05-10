import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
} from "graphql";
import { IPlayer } from "../../db/models/Players";
import { responseType } from "../Types";
import { LobbyType } from "../lobby/type";
import InventoryType from "../inventory/type";

export interface PlayerResponse extends responseType {
  result?: IPlayer;
  results?: IPlayer[];
}

export const PlayerType: GraphQLObjectType<IPlayer> = new GraphQLObjectType({
  name: "Player",
  fields: () => ({
    _id: { type: GraphQLString },
    name: { type: GraphQLString },
    pic: { type: GraphQLInt },
    friends: { type: new GraphQLList(PlayerType) },
    friendRequests: { type: new GraphQLList(PlayerType) },
    friendRequestsSent: { type: new GraphQLList(PlayerType) },
    lobby: { type: new GraphQLList(LobbyType) },
    joinedLobby: { type: new GraphQLList(LobbyType) },
    inventory: { type: new GraphQLList(InventoryType) },
  }),
});

const PlayerResponseType = new GraphQLObjectType<PlayerResponse>({
  name: "Players",
  fields: () => ({
    result: { type: PlayerType },
    results: { type: new GraphQLList(PlayerType) },
    status: { type: GraphQLInt },
    error: { type: GraphQLString },
  }),
});

export default PlayerResponseType;
