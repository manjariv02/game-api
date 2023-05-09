import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLInt,
} from "graphql";
import { IInventory } from "../../db/models/Inventory";

const InventoryType = new GraphQLObjectType<IInventory>({
  name: "Inventory",
  fields: () => ({
    _id: { type: new GraphQLNonNull(GraphQLID) },
    normalArr: { type: new GraphQLNonNull(GraphQLInt) },
    fireArr: { type: new GraphQLNonNull(GraphQLInt) },
  }),
});

export default InventoryType;
