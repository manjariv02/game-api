import { GraphQLNonNull, GraphQLString } from "graphql";
import PlayerResponseType from "./type";
import Player from "../../db/models/Players";
import { Request } from "express";

const acceptFriendRequest = {
  type: PlayerResponseType,
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

      if (playerId && friendId) {
        const acceptRequest = await acceptFriendAndRemoveRequests(
          playerId,
          friendId
        );

        const acceptFriendsRequest = await acceptFriendAndRemoveRequests(
          friendId,
          playerId
        );

        if (acceptRequest && acceptFriendsRequest) {
          return {
            status: 200,
          };
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

const acceptFriendAndRemoveRequests = async (
  playerId: string,
  friendId: string
) => {
  try {
    const player = await Player.findById(playerId);

    if (player) {
      const checkInFriendRequests = player.friendRequests?.includes(friendId);
      const checkInSentFriendRequests =
        player.friendRequestsSent?.includes(friendId);

      if (checkInFriendRequests || checkInSentFriendRequests) {
        const existingFriend = player.friends?.includes(friendId);

        if (existingFriend) throw "This player is already your friend";

        const confirmRequest = player.friends?.push(friendId);

        if (confirmRequest) {
          const requestIndex = player.friendRequests?.indexOf(friendId);

          if (typeof requestIndex === "number" && requestIndex > -1) {
            const removedId = player.friendRequests?.splice(requestIndex, 1);
            if (removedId) await player.save();
          }

          const requestSentIndex = player.friendRequestsSent?.indexOf(friendId);

          if (typeof requestSentIndex === "number" && requestSentIndex > -1) {
            const removedId = player.friendRequestsSent?.splice(
              requestSentIndex,
              1
            );
            if (removedId) await player.save();
          }

          return true;
        }
      }
    }
  } catch (err) {
    throw err;
  }
};

export default acceptFriendRequest;
