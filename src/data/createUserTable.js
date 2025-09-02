import { readFileSync } from "fs";
import { join } from "path";
import pool from "../config/db.js"; // Ensure your DB connection is correct

const sqlFilePath = join(process.cwd(), "src/data/data.sql"); // Adjust if needed
const createUserTableQuery = readFileSync(sqlFilePath, "utf8");

export const createUserTable = async () => { // Use named export
    try {
        await pool.query(createUserTableQuery);
        console.log("User table created successfully!");
    } catch (err) {
        console.error("Error creating user table:", err);
    }
};
