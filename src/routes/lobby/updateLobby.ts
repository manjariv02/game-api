import {
  GraphQLNonNull,
  GraphQLString,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLList,
} from "graphql";
import Player from "../../db/models/Players";
import { Request } from "express";
import Lobby, { ILobby } from "../../db/models/Lobby";
import LobbyResponseType from "./type";
import Inventory, { IInventory } from "../../db/models/Inventory";
import InventoryType from "../inventory/type";

interface InventoryBodyType {
  playerId: string;
  inventory: IInventory;
}

const updateLobbyBodyObject = new GraphQLInputObjectType({
  name: "UpdateLobbyInputType",
  fields: () => ({
    playerId: { type: GraphQLString },
    inventory: {
      type: new GraphQLInputObjectType({
        name: "InventoryInputType",
        fields: () => ({
          normalArr: { type: GraphQLString },
          fireArr: { type: GraphQLString },
        }),
      }),
    },
  }),
});

const updateLobby = {
  type: LobbyResponseType,
  args: {
    lobbyId: { type: new GraphQLNonNull(GraphQLString) },
    season: { type: new GraphQLNonNull(GraphQLInt) },
    episode: { type: new GraphQLNonNull(GraphQLInt) },
    level: { type: new GraphQLNonNull(GraphQLInt) },
    inventory: {
      type: new GraphQLNonNull(new GraphQLList(updateLobbyBodyObject)),
    },
  },
  resolve: async (
    parent: any,
    {
      lobbyId,
      season,
      episode,
      level,
      inventory,
    }: {
      lobbyId: string;
      season: number;
      episode: number;
      level: number;
      inventory: InventoryBodyType[];
    },
    { req }: { req: Request }
  ) => {
    try {
      const playerId = req.user?.playerId;

      if (playerId) {
        const player = await Player.findById(playerId);

        if (player && player.lobby) {
          const ownsLobby = player.lobby.includes(lobbyId);

          if (ownsLobby) {
            const lobby = await Lobby.findById(lobbyId).populate(
              "playerInventory"
            );

            if (lobby) {
              lobby.progress = { season, episode, level };
              const lobbySaved = await lobby.save();

              for (const item of inventory) {
                const playerInventory = lobby.playerInventory.find(
                  (inv) => inv.playerId === item.playerId
                );
                if (playerInventory) {
                  const inventoryId = playerInventory.inventory;

                  const foundInventory = await Inventory.findById(inventoryId);
                  if (foundInventory) {
                    foundInventory.normalArr = item.inventory?.normalArr;
                    foundInventory.fireArr = item.inventory?.fireArr;
                    const inventorySaved = await foundInventory.save();

                    if (inventorySaved && lobbySaved) {
                      return {
                        status: 200,
                        result: lobbySaved,
                      };
                    }
                  }
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
