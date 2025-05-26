require("dotenv").config({ path: "config/dev.env" });
const express = require("express");
const cors = require("cors");   
require("./db/mongoose");


const app = express();
const port = process.env.PORT || 3001;

// Configurar CORS aquí
app.use(cors({
  origin: '*'   // Permitir todas las solicitudes (para desarrollo)
// Puedes cambiar origin para permitir sólo dominios específicos:
// origin: 'http://localhost:4200'  (por ejemplo para Angular)
}));

app.use(express.json());


app.listen(port, () => {
  console.log("Server is up on port " + port);
});
