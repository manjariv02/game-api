import { Router } from "express";
import { graphqlHTTP } from "express-graphql";
import { GraphQLSchema } from "graphql";

import loginRouter from "./login";
import registerRouter from "./register";
import authMiddleware from "../middleware/auth";
import query from "./Queries";
import mutation from "./Mutations";

const router = Router();

router.use("/login", loginRouter);
router.use("/register", registerRouter);

// router.use("/", authMiddleware);

router.use(
  "/graphql",
  graphqlHTTP({
    schema: new GraphQLSchema({
      query,
      mutation,
    }),
    graphiql: true,
  })
);

export default router;
