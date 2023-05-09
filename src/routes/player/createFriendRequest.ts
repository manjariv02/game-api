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
        const friend = await Player.findById(friendId);

        if (player && friend) {
          const existingRequest = player.friendRequestsSent?.includes(friendId);
          const requestRecieved = friend.friendRequests?.includes(playerId);

          if (existingRequest && requestRecieved)
            throw "Friend request already sent to this player";

          const existingFriend = player.friends?.includes(friendId);
          const existingPlayer = friend.friends?.includes(playerId);

          if (!existingFriend && !existingPlayer) {
            player.friendRequestsSent?.push(friendId);
            const updatedPlayer = await player.save();

            friend.friendRequests?.push(playerId);
            const updatedFriend = await friend.save();

            if (updatedPlayer && updatedFriend) {
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

export default createFriendRequest;
