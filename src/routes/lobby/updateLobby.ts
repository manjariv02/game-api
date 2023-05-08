import {
  GraphQLNonNull,
  GraphQLString,
  GraphQLInputObjectType,
  GraphQLInt,
} from "graphql";
import PlayerType from "../player/type";
import Player from "../../db/models/Players";
import { Request } from "express";
import Lobby, { ILobby } from "../../db/models/Lobby";

interface LobbyUpdateInput {
  season?: number;
  episode?: number;
  level?: number;
}

const LobbyUpdateInputType = new GraphQLInputObjectType({
  name: "LobbyUpdateInput",
  fields: () => ({
    season: { type: new GraphQLNonNull(GraphQLInt) },
    episode: { type: new GraphQLNonNull(GraphQLInt) },
    level: { type: new GraphQLNonNull(GraphQLInt) },
  }),
});

const updateLobby = {
  type: PlayerType,
  args: {
    lobbyId: { type: new GraphQLNonNull(GraphQLString) },
    input: { type: new GraphQLNonNull(LobbyUpdateInputType) },
  },
  resolve: async (
    parent: any,
    { lobbyId, input }: { lobbyId: string; input: LobbyUpdateInput },
    { req }: { req: Request }
  ) => {
    try {
      const playerId = req.user?.playerId;

      if (playerId) {
        const player = await Player.findById(playerId);

        if (player) {
          const existingLobby = await Lobby.findById(lobbyId);

          if (existingLobby) {
            const checkPlayer = await Lobby.findOne({
              players: { $all: [playerId] },
            });

            if (checkPlayer) {
              const update = {
                ...existingLobby.progress,
                season: input.season ?? existingLobby.progress.season,
                episode: input.episode ?? existingLobby.progress.episode,
                level: input.level ?? existingLobby.progress.level,
              };
              existingLobby.progress = update;

              if (update) {
                const saveLobbyDetail = await existingLobby.save();
                const updatedValue = saveLobbyDetail;

                if (updatedValue) {
                  return {
                    result: {
                      lobby: {
                        progress: {
                          episode: updatedValue.progress.episode,
                          level: updatedValue.progress.level,
                          season: updatedValue.progress.season,
                        },
                      },
                    },
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

export default updateLobby;
