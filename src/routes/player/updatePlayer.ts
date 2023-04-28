import { GraphQLInt, GraphQLNonNull, GraphQLString } from "graphql";
import PlayerType from "./type";
import Player, { IPlayer } from "../../db/models/Players";
import { Request } from "express";

const updatePlayer = {
  type: PlayerType,
  args: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    pic: { type: new GraphQLNonNull(GraphQLInt) },
  },
  resolve: async (
    parent: any,
    { name, pic }: IPlayer,
    { req }: { req: Request }
  ) => {
    try {
      const playerId = req.user?.playerId;

      if (playerId) {
        const playerUpdate = await Player.findOneAndUpdate(
          { _id: playerId },
          { name, pic },
          { new: true }
        );

        return {
          result: {
            _id: playerUpdate?._id,
            name: playerUpdate?.name,
            pic: playerUpdate?.pic,
          },
          status: 200,
        };
      }

      throw "Something went wrong";
    } catch (error) {
      return {
        status: 400,
        error,
      };
    }
  },
};

export default updatePlayer;
