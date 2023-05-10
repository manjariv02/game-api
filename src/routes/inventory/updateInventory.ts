import PlayerType from "../player/type";
import { Request } from "express";
import { GraphQLInt, GraphQLNonNull } from "graphql";
import Inventory, { IInventory } from "../../db/models/Inventory";
import Player from "../../db/models/Players";

const updateInventory = {
  type: PlayerType,
  args: {
    normalArr: { type: new GraphQLNonNull(GraphQLInt) },
    fireArr: { type: new GraphQLNonNull(GraphQLInt) },
  },
  resolve: async (
    parent: any,
    { normalArr, fireArr }: IInventory,
    { req }: { req: Request }
  ) => {
    try {
      const playerId = req.user?.playerId;

      if (playerId) {
        const player = await Player.findById(playerId);

        if (player) {
          const inventoryUpdate = await Inventory.findOneAndUpdate(
            { _id: player.inventory },
            { normalArr, fireArr },
            { new: true }
          );

          if (inventoryUpdate) {
            return {
              result: {
                _id: inventoryUpdate._id,
              },
              status: 200,
            };
          }
        }
      }
      throw "Something went wrong! ";
    } catch (error) {
      return {
        status: 400,
        error,
      };
    }
  },
};

export default updateInventory;
