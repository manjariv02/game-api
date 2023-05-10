import express from "express";
import connectDB from "./db/connection";
import router from "./routes";

const app = express();
connectDB(app);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", router);

app.on("dbConnected", () => {
  app.listen(3000, () => {
    console.log("Server running on port 3000");
  });
});
