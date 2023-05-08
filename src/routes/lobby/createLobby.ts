import { GraphQLNonNull, GraphQLString } from "graphql";
import PlayerType from "../player/type";
import Player from "../../db/models/Players";
import { Request } from "express";
import Lobby from "../../db/models/Lobby";

const createLobby = {
  type: PlayerType,
  args: {
    friendId: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (
    parent: any,
    { friendId }: { friendId: string },
    { req }: { req: Request }
  ) => {
    try {
      const playerId = req.user?.playerId;

      if (playerId) {
        const player = await Player.findById(playerId);

        if (player) {
          const existingFriend = player.friends?.includes(friendId);

          if (existingFriend) {
            const existingLobby = await Lobby.findOne({
              players: { $all: [playerId, friendId] },
            });

            if (existingLobby) throw "Lobby already exists with this friendId";
            else {
              const newlobby = new Lobby({
                name: `Lobby-${playerId}-${friendId}`,
                players: [playerId, friendId],
                host: playerId,
              });
              const createNewLobby = player.lobby?.push(newlobby);

              if (createNewLobby) {
                const updatedPlayer = await Promise.all([
                  player.save(),
                  newlobby.save(),
                ]);

                if (updatedPlayer) {
                  return {
                    result: updatedPlayer,
                    status: 200,
                  };
                }
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

export default createLobby;
