require("dotenv").config({ path: "config/dev.env" });
const express = require("express");
const cors = require("cors");
require("./db/mongoose");
const authRouter = require("./routes/auth-routes");
const usersRouter = require("./routes/users-routes");
const coursesRouter = require("./routes/courses-routes");
const enrollmentsRouter = require("./routes/enrollments-routes");
const gradesRouter = require("./routes/grades-routes");


const auth = require("./middlewares/auth");

const errorHandler = require("./middlewares/error-handler");


const app = express();
const port = process.env.PORT;

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());

app.use("/auth", authRouter);
app.use(auth);
app.use("/users", usersRouter);
app.use("/courses", coursesRouter);
app.use("/enrollments", enrollmentsRouter);
app.use("/grades", gradesRouter);
app.use(errorHandler);

app.listen(port, () => {
  console.log("Server is up on port " + port);
});
