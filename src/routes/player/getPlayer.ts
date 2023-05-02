import PlayerType from "./type";
import Player from "../../db/models/Players";
import { Request } from "express";

const getPlayer = {
  type: PlayerType,
  args: {},
  resolve: async (parent: any, {}, { req }: { req: Request }) => {
    try {
      const playerId = req.user?.playerId;

      if (playerId) {
        const players = await Player.find();

        return {
          results: players.map((player) => ({
            _id: player?._id,
            name: player?.name,
            pic: player?.pic,
          })),
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

export default getPlayer;
