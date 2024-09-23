import express from "express";
import cookieParser from "cookie-parser";
const app = express();

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());


app.get("/", (req, res) => {
  res.send("Welcome to the Money Transfer API!");
});


// Routes import
import userRouter from "./routes/User.router.js";
import accountRouter from "./routes/Account.router.js";


// Routes declaration
app.use("/api/v1/user", userRouter);
app.use("/api/v1/stripe", accountRouter);

export { app };
