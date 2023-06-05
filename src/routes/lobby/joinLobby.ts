import { GraphQLNonNull, GraphQLString } from "graphql";
import Player from "../../db/models/Players";
import { Request } from "express";
import Lobby, { ILobby } from "../../db/models/Lobby";
import Inventory from "../../db/models/Inventory";
import LobbyResponseType from "./type";

const joinLobby = {
  type: LobbyResponseType,
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
        const player = await Player.findById(playerId)
          .populate("lobby")
          .populate("joinedLobby");

        const lobby = await Lobby.findById(lobbyId);

        if (player && lobby) {
          const isHostIdPresent =
            player.lobby?.some((player) => player.host.equals(lobby.host)) ||
            player.joinedLobby?.some((player) =>
              player.host.equals(lobby.host)
            );

          if (isHostIdPresent)
            throw "Already an lobby exists with the player or the host";

          const checkPlayer = lobby.players?.includes(playerId);
          if (checkPlayer) throw "player already present in the lobby";
          if (lobby.players.length > 1) throw "No room in Lobby";

          const inventory = await Inventory.create({});

          if (inventory) {
            lobby.players?.push(playerId);
            lobby.playerInventory.push({
              playerId,
              inventory,
            });
            const lobbySaved = await lobby.save();

            player.joinedLobby?.push(lobbyId);
            const playerSaved = await player.save();

            if (lobbySaved && playerSaved) {
              return {
                result: lobbySaved,
                status: 200,
              };
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

export default joinLobby;
