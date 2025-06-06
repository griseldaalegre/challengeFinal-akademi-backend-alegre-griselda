const mongoose = require("mongoose");

async function connectBD() {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
    } catch (error) {
        process.exit(1); 
    }
}

connectBD();
