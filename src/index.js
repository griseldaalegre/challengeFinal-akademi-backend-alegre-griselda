require("dotenv").config({ path: "config/dev.env" });
const express = require("express");
const cors = require("cors");
require("./db/mongoose");
const authRouter = require("./routes/auth-routes");
const errorHandler = require("./middlewares/error-handler");

const usersRouter = require("./routes/users-routes");

const app = express();
const port = process.env.PORT || 3001;

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());

app.use("/auth", authRouter);
app.use(errorHandler);
app.listen(port, () => {
  console.log("Server is up on port " + port);
});
