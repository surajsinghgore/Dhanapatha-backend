import { Router } from "express";
import {  getUserHistory, refundTransaction } from "../controllers/Refund.controller.js";
import { verifyUserToken } from "../middleware/VerifyUserLogin.middleware.js";
const router = Router();

router.route("/refund-money").post(verifyUserToken,refundTransaction)
router.route("/history").get(verifyUserToken,getUserHistory)

export default router;