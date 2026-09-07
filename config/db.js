
import { createClient } from "@libsql/client/web";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

// 1. Initialize env variables BEFORE creating client
dotenv.config();

export const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export const connectDB = async () => {

    try {

        // Create tables if they aren't exist
        const schemaSql = fs.readFileSync(path.join(process.cwd(), "db", "schema.sql"), "utf8");

        // execute file or more
        await db.executeMultiple(schemaSql);

        console.log("Turso tables initialized successfully.");
    }

    catch (error) {

	console.error("Database initialization error: ", error);
	throw error;
    }
};

