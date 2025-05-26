require("dotenv").config({ path: "config/dev.env" });
const express = require("express");
const cors = require("cors");   
require("./db/mongoose");


const app = express();
const port = process.env.PORT || 3001;


app.use(cors({
  origin: '*'   
}));

app.use(express.json());


app.listen(port, () => {
  console.log("Server is up on port " + port);
});
