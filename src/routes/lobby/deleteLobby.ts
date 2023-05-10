import { GraphQLNonNull, GraphQLString } from "graphql";
import Player from "../../db/models/Players";
import { Request } from "express";
import Lobby from "../../db/models/Lobby";
import LobbyResponseType from "./type";
import Inventory from "../../db/models/Inventory";

const deleteLobby = {
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
        const player = await Player.findById(playerId);
        const lobby = await Lobby.findById(lobbyId);

        if (player && lobby && player.lobby?.includes(lobbyId)) {
          const lobbyIndex = player.lobby.indexOf(lobbyId);
          if (typeof lobbyIndex === "number" && lobbyIndex > -1) {
            const removeLobby = player.lobby.splice(lobbyIndex, 1);
            if (removeLobby) await player.save();
          }

          const otherPlayerId = lobby.players[1];
          if (otherPlayerId) {
            const otherPlayer = await Player.findById(otherPlayerId);
            if (otherPlayer) {
              const otherPlayerLobbyIndex =
                otherPlayer.joinedLobby?.indexOf(lobbyId);
              if (
                typeof otherPlayerLobbyIndex === "number" &&
                otherPlayerLobbyIndex > -1
              ) {
                const removeJoinedLobby = otherPlayer.joinedLobby?.splice(
                  otherPlayerLobbyIndex,
                  1
                );
                if (removeJoinedLobby) await otherPlayer.save();
              }
            }
          }

          const inventoryIds = lobby.playerInventory.map(
            (inv) => inv.inventory
          );
          if (inventoryIds) {
            const deleteInv = await Inventory.deleteMany({
              _id: { $in: inventoryIds },
            });
            const dropLobby = await Lobby.findByIdAndRemove(lobbyId);

            if (dropLobby && deleteInv) {
              return {
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

export default deleteLobby;
