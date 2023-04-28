import { GraphQLObjectType, GraphQLString } from "graphql";

const user = {
  type: GraphQLString,
  resolve: () => "Hello",
};

const rootQuery = new GraphQLObjectType({
  name: "Query",
  fields: {
    usersList: user,
  },
});

export default rootQuery;
