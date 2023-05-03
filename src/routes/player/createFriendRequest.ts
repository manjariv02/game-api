import { GraphQLNonNull, GraphQLString } from "graphql";
import PlayerType from "./type";
import Player from "../../db/models/Players";
import { Request } from "express";

const createFriendRequest = {
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
          const existingRequest = player.friendRequests?.includes(friendId);

          if (existingRequest)
            throw "Friend request already sent to this player";

          const existingFriend = player.friends?.includes(friendId);

          if (existingFriend) throw "This player is already your friend";

          player.friendRequests?.push(friendId);

          const updatedPlayer = await player.save();
          if (updatedPlayer) {
            return {
              result: updatedPlayer,
              status: 200,
            };
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

export default createFriendRequest;
