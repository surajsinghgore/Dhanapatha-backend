import "dotenv/config";
import express from "express";
import cors from "cors";
import {DbConnection} from "./db/DbConnection.js";
import { app } from "./app.js"; 

const server = express(); 

const corsOptions = {
  origin: "https://dhanapatha.surajsingh.online",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

server.use(cors(corsOptions));

server.use(app); 

DbConnection()
  .then(() => {
    const PORT = process.env.PORT || 8000;
    server.listen(PORT, () => {
      console.log(`⚙️ Server is running at port : ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
  });
