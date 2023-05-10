import { GraphQLNonNull, GraphQLString } from "graphql";
import Player from "../../db/models/Players";
import { Request } from "express";
import Lobby, { ILobby } from "../../db/models/Lobby";
import Inventory from "../../db/models/Inventory";
import LobbyResponseType from "./type";

const createLobby = {
  type: LobbyResponseType,
  args: {
    name: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (
    parent: any,
    { name }: { name: string },
    { req }: { req: Request }
  ) => {
    try {
      const playerId = req.user?.playerId;

      if (playerId && name) {
        const player = await Player.findById(playerId)
          .populate("inventory")
          .populate({
            path: "lobby",
            populate: {
              path: "playerInventory",
              populate: "inventory player",
            },
          });

        if (player && player.lobby) {
          const lobbies: ILobby[] = player.lobby;

          if (lobbies.length > 4) throw "Lobby creation limit exceeded!";

          const lastCreatedLobby = lobbies[lobbies.length - 1];
          if (
            lobbies.length &&
            lastCreatedLobby &&
            lastCreatedLobby.players.length < 2
          ) {
            return {
              status: 200,
              result: lastCreatedLobby,
            };
          }

          const checkLobby = await Lobby.findOne({ name });
          if (checkLobby) throw "Name already taken!";

          const inventory = await Inventory.create({});

          if (inventory) {
            const newLobby = await Lobby.create({
              name,
              players: [playerId],
              playerInventory: [{ playerId, inventory }],
              host: playerId,
              progress: {
                season: 0,
                episode: 0,
                level: 0,
              },
            });

            if (newLobby) {
              player.lobby.push(newLobby._id);
              player.save();

              return {
                status: 200,
                result: newLobby,
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

export default createLobby;
