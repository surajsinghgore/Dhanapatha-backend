import { Router } from "express";
import {  changePassword, loginUser, RegisterUser, searchUsers } from "../controllers/User.controller.js";
import { registerValidation } from "../validators/validation.js";
import { validationResult } from 'express-validator';
import { verifyUserToken } from "../middleware/VerifyUserLogin.middleware.js";


const router = Router();



router.route("/register").post(registerValidation, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({success:false, errors: errors.array() });
    }
    next();
}, RegisterUser);


router.route("/login").post(loginUser)
router.route("/search-user").get(verifyUserToken,searchUsers)
router.route("/change-password").post(verifyUserToken,changePassword)





export default router;