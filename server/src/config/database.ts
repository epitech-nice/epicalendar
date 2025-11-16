import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const db_uri: string = process.env.MONGODB_URI as string;

export async function connect(): Promise<void> {
    try {
        // Hide credentials when printing the URI for logs
        const safeUri = db_uri.replace(/\/\/(.*@)/, "//***@");
        console.log("Using MongoDB URI:", safeUri);

        await mongoose.connect(db_uri, { dbName: "epicalendar" });

        const actualDb = mongoose.connection?.db?.databaseName;
        console.log("Mongoose connected to database:", actualDb);

        console.log("Connected to MongoDB successfully!");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
        process.exit(1);
    }
}
