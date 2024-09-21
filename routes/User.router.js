import { Router } from "express";
import { loginUser, RegisterUser } from "../controllers/User.controller.js";


// Register
const router = Router();



router.route("/register").post(RegisterUser);



export default router;