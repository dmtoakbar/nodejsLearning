import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/db.js";
import userRoutes from "./routes/user_routes.js";
import errorHandling from "./middlewares/error_handler.js";
import { createUserTable } from "./data/createUserTable.js"; 

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;


// midddlewares
app.use(express.json());
app.use(cors());

// Create the users table on startup
createUserTable();

//  Routes
app.use("/api", userRoutes);

// error handling
app.use(errorHandling);

// testing postgres connection
app.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT current_database()");
        res.send(`The database name is: ${result.rows[0].current_database}`);
    } catch (error) {
        res.status(500).send("Database connection error.");
        console.error(error);
    }
});

// server runnning

app.listen(port, () => {
    const url = `http://localhost:${port}`;
    console.log(`Server is running on \x1b[36m${url}\x1b[0m`); 
});