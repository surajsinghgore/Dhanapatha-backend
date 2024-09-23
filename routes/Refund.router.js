import { Router } from "express";
import {  refundTransaction } from "../controllers/Refund.controller.js";
import { verifyUserToken } from "../middleware/VerifyUserLogin.middleware.js";
const router = Router();

router.route("/refund-money").post(verifyUserToken,refundTransaction)

export default router;