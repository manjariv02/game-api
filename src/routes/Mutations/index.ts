import { GraphQLObjectType, GraphQLString } from "graphql";

const user = {
  type: GraphQLString,
  resolve: () => "Hello",
};

const rootMutations = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    user,
  },
});

export default rootMutations;
