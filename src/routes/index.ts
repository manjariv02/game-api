import { Router } from "express";
import { graphqlHTTP } from "express-graphql";
import loginRouter from "./login";
import registerRouter from "./register";
import authMiddleware from "../middleware/auth";
import query from "./Queries";
import mutation from "./Mutations";
import { GraphQLSchema } from "graphql";

const router = Router();

router.use("/login", loginRouter);
router.use("/register", registerRouter);

router.use("/", authMiddleware);

const schema = new GraphQLSchema({ query, mutation });

router.use(
  "/graphql",
  graphqlHTTP((req, res) => ({
    schema,
    context: { req },
    graphiql: process.env.NODE_ENV === "development",
  }))
);

export default router;
