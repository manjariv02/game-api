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
        const result = await Player.findById(playerId)
          .populate("lobby")
          .populate("joinedLobby")
          .populate("friends")
          .populate("friendRequests")
          .populate("friendRequestsSent")
          .populate("inventory");

        console.log(result);

        if (result) {
          return {
            result,
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
