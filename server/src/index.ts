/* Import modules */
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import cors from "cors";
import path from "path";

/* Import database */
import * as database from "./config/database.config";

/* Import routes */
import routes from "./routes/routes";

/* Set up app */
dotenv.config();
const app = express();
const PORT = process.env.PORT;

// CORS configuration - must be before routes
app.use(
    cors({
        origin: process.env.CLIENT_URL || "*",
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    }),
);

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

/* Default route */
app.get("/", (request: Request, response: Response) => {
    response.send("Server is running.");
});

/* Health check endpoint */
app.get("/api/health", (request: Request, response: Response) => {
    response
        .status(200)
        .json({ status: "healthy", timestamp: new Date().toISOString() });
});

/* Set up routes */
app.use("/api", routes);

/* Set not found handler */
app.use((request: Request, response: Response) => {
    response.status(404).json({ message: "Not found." });
});

/* Start the server first, then connect to database */
const server = app.listen(PORT, () => {
    console.log(`✅ Server listening on http://localhost:${PORT}/api`);
    console.log("⏳ Connecting to database...");

    // Connect to database after server is up
    database.connect().catch((err) => {
        console.error("❌ Failed to connect to database:", err);
        console.error(
            "⚠️  Server will continue running but database operations will fail",
        );
    });
});

// Handle graceful shutdown
process.on("SIGTERM", () => {
    console.log("SIGTERM signal received: closing HTTP server");
    server.close(() => {
        console.log("HTTP server closed");
        process.exit(0);
    });
});
