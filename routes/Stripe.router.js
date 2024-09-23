import { Router } from "express";
import { verifyUserToken } from "../middleware/VerifyUserLogin.middleware.js";
import { addMoney, createPaymentIntent, withdrawMoney } from "../controllers/Stripe.controller.js";

const router = Router();

router.route("/add-money").post(addMoney)
router.route("/create-payment-intent").post(createPaymentIntent)
router.route("/withdraw-money").post(verifyUserToken,withdrawMoney)


export default router;
