import { Router } from "express";
import {  addAccount, fetchAccountBalance } from "../controllers/Account.controller.js";
import { verifyUserToken } from "../middleware/VerifyUserLogin.middleware.js";



const router = Router();



router.route("/add-account-number").post(verifyUserToken,addAccount)
router.route("/fetch-account-balance").get(verifyUserToken,fetchAccountBalance)


export default router;