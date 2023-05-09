import PlayerResponseType from "./type";
import Player from "../../db/models/Players";
import { Request } from "express";

const getPlayers = {
  type: PlayerResponseType,
  args: {},
  resolve: async (parent: any, {}, { req }: { req: Request }) => {
    try {
      const playerId = req.user?.playerId;

      if (playerId) {
        const results = await Player.find()
          .populate("lobby")
          .populate("friends")
          .populate("friendRequests")
          .populate("friendRequestsSent")
          .populate("inventory");

        if (results) {
          return {
            results,
            status: 200,
          };
        }
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

export default getPlayers;
