import { GraphQLNonNull, GraphQLString } from "graphql";
import PlayerType from "../player/type";
import Player from "../../db/models/Players";
import { Request } from "express";
import Lobby from "../../db/models/Lobby";

const deleteLobby = {
  type: PlayerType,
  args: {
    lobbyId: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (
    parent: any,
    { lobbyId }: { lobbyId: string },
    { req }: { req: Request }
  ) => {
    try {
      const playerId = req.user?.playerId;

      if (playerId) {
        const player = await Player.findById(playerId);

        if (player) {
          const getLobby = await Lobby.findById(lobbyId);

          const lobbyDetails = getLobby;

          if (lobbyDetails) {
            const checkHost = lobbyDetails.host.toString() === playerId;

            if (checkHost) {
              const deleteTheLobby = await Lobby.deleteOne({ _id: lobbyId });

              if (deleteTheLobby) {
                return {
                  result: {
                    _id: lobbyDetails._id,
                    name: lobbyDetails.name,
                  },
                  status: 200,
                };
              }
            }
          }
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

export default deleteLobby;
