import "dotenv/config";
import express from "express";
import cors from "cors";
import { DbConnection } from "./db/DbConnection.js";
import { app } from "./app.js"; 

const server = express(); 

const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

server.use(cors(corsOptions));
server.use(app); 

// Connect to the database
DbConnection()
  .then(() => {
    console.log("⚙️ MongoDB connection established.");
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
  });

// Export the server as a serverless function
export default server;
