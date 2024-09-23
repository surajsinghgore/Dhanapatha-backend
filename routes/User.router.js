import { Router } from "express";
import {  loginUser, RegisterUser } from "../controllers/User.controller.js";
import { registerValidation } from "../validators/validation.js";
import { validationResult } from 'express-validator';


const router = Router();



router.route("/register").post(registerValidation, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({success:false, errors: errors.array() });
    }
    next();
}, RegisterUser);



router.route("/login").post(loginUser)





export default router;