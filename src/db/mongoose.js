const mongoose = require("mongoose");

async function connectBD() {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Conectado a MongoDB Atlas");
    } catch (error) {
        console.error("Error al conectar a MongoDB Atlas:", error);
        process.exit(1); 
    }
}

connectBD();
