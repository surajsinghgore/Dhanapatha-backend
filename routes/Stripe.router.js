import { Router } from "express";
import { verifyUserToken } from "../middleware/VerifyUserLogin.middleware.js";
import { addMoney, createPaymentIntent } from "../controllers/Stripe.controller.js";

const router = Router();

router.route("/add-money").post(addMoney)
router.route("/create-payment-intent").post(createPaymentIntent)


export default router;
