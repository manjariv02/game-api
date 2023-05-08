import PlayerType from "../player/type";
import { Request } from "express";
import Player from "../../db/models/Players";

const getAllLobby = {
  type: PlayerType,
  args: {},
  resolve: async (parent: any, {}, { req }: { req: Request }) => {
    const playerId = req.user?.playerId;

    if (playerId) {
      const player = await Player.findById({ _id: playerId });

      if (player) {
        return {
          results: player.lobby?.map((lobby) => ({
            _id: lobby._id,
          })),
        };
      }
    }

    try {
      throw "Something is wrong!";
    } catch (error) {
      return { error };
    }
  },
};
export default getAllLobby;
