import PlayerType from "./type";
import Player from "../../db/models/Players";
import { Request } from "express";

const listFriendRequest = {
  type: PlayerType,
  resolve: async (parent: any, {}, { req }: { req: Request }) => {
    try {
      const playerId = req.user?.playerId;

      if (playerId) {
        const player = await Player.findById(playerId);

        if (player) {
          return {
            results: player.friendRequests?.map((request) => ({
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

export default listFriendRequest;
