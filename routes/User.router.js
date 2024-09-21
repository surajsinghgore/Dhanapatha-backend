import { Router } from "express";
import { loginUser } from "../controllers/User.controller.js";


// Register
const router = Router();



router.route("/login").post(loginUser);



export default router;