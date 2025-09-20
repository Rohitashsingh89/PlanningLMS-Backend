import mongoose from "mongoose";

const databaseConnection = async (DATABASE_URL, DATABASE_NAME) => {
    try {
        const DB_OPTIONS = {
            dbName: DATABASE_NAME,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        };

        await mongoose.connect(DATABASE_URL, DB_OPTIONS);
        console.log("✅ Database Connected Successfully...");
    } catch (error) {
        console.error("❌ Database Connection Failed");
        console.error(error.message);
        process.exit(1); // Stop server if DB connection fails
    }
};

export default databaseConnection;
