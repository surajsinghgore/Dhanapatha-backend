import { Router } from "express";
import {  addAccount, fetchAccountBalance, fetchTransactions, getBankDetails, transferMoney, updateAccount } from "../controllers/Account.controller.js";
import { verifyUserToken } from "../middleware/VerifyUserLogin.middleware.js";



const router = Router();



router.route("/add-account-number").post(verifyUserToken,addAccount)
router.route("/update-account-number").patch(verifyUserToken,updateAccount)
router.route("/fetch-account-balance").get(verifyUserToken,fetchAccountBalance)
router.route("/transfer-money").post(verifyUserToken,transferMoney)
router.route("/get-transaction").get(verifyUserToken,fetchTransactions)
router.route("/get-bank").get(verifyUserToken,getBankDetails)


export default router;