import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
} from "graphql";
import { IPlayer } from "../../db/models/Players";
import { responseType } from "../Types";

export interface PlayerResponse extends responseType {
  result?: IPlayer;
  results?: IPlayer[];
}

const PlayerType: GraphQLObjectType<IPlayer> = new GraphQLObjectType({
  name: "Player",
  fields: () => ({
    _id: { type: GraphQLString },
    name: { type: GraphQLString },
    pic: { type: GraphQLString },
    friends: { type: new GraphQLList(GraphQLString) },
    friendRequests: { type: new GraphQLList(GraphQLString) },
  }),
});

export default new GraphQLObjectType<PlayerResponse>({
  name: "Players",
  fields: () => ({
    result: { type: PlayerType },
    results: { type: new GraphQLList(PlayerType) },
    status: { type: GraphQLInt },
    error: { type: GraphQLString },
  }),
});
