import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const db_uri: string = process.env.MONGODB_URI as string;

export async function connect(): Promise<void> {
    const maxRetries = 10;
    const retryDelay = 5000; // 5 seconds

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            // Hide credentials when printing the URI for logs
            const safeUri = db_uri.replace(/\/\/(.*@)/, "//***@");
            console.log(`[Attempt ${attempt}/${maxRetries}] Connecting to MongoDB:`, safeUri);

            await mongoose.connect(db_uri, { 
                dbName: "epicalendar",
                serverSelectionTimeoutMS: 5000
            });

            const actualDb = mongoose.connection?.db?.databaseName;
            console.log("Mongoose connected to database:", actualDb);
            console.log("✅ Connected to MongoDB successfully!");
            return;
        } catch (err) {
            console.error(`❌ MongoDB connection attempt ${attempt}/${maxRetries} failed:`, err);

            if (attempt === maxRetries) {
                console.error("Failed to connect to MongoDB after", maxRetries, "attempts");
                process.exit(1);
            }

            console.log(`Retrying in ${retryDelay/1000} seconds...`);
            await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
    }
}
