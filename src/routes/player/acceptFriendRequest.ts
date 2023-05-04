import { GraphQLNonNull, GraphQLString } from "graphql";
import PlayerType from "./type";
import Player from "../../db/models/Players";
import { Request } from "express";

const acceptFriendRequest = {
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
          const checkInFriendRequests =
            player.friendRequests?.includes(friendId);

          if (checkInFriendRequests) {
            const existingFriend = player.friends?.includes(friendId);

            if (existingFriend) throw "This player is already your friend";

            const confirmRequest = player.friends?.push(friendId);

            const requestIndex = player.friendRequests?.indexOf(friendId);

            if (requestIndex && requestIndex > -1) {
              const removeRequest = player.friendRequests?.splice(
                requestIndex,
                1
              );

              if (confirmRequest && removeRequest) {
                const updatedPlayer = await player.save();

                if (confirmRequest) {
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

export default acceptFriendRequest;
