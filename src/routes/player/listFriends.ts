import PlayerResponseType from "./type";
import Player from "../../db/models/Players";
import { Request } from "express";

const listFriends = {
  type: PlayerResponseType,
  resolve: async (parent: any, {}, { req }: { req: Request }) => {
    try {
      const playerId = req.user?.playerId;

      if (playerId) {
        const player = await Player.findById(playerId);

        if (player) {
          return {
            results: player.friends?.map((request) => ({
              _id: request?._id,
            })),
            status: 200,
          };
        }
      }

      throw "Something went Wrong!";
    } catch (error) {
      return {
        status: 400,
        error,
      };
    }
  },
};

export default listFriends;
