import PlayerType from "../player/type";
import { Request } from "express";
import Player from "../../db/models/Players";
import { GraphQLInt, GraphQLNonNull } from "graphql";
import { IInventory } from "../../db/models/Inventory";

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
        const inventoryUpdate = await Player.findOneAndUpdate(
          { _id: playerId },
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
    } catch (error) {
      return {
        status: 400,
        error,
      };
    }
  },
};

export default updateInventory;
