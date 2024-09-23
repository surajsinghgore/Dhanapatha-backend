import mongoose from "mongoose";
import AddMoney from "../models/AddMoney.model.js";
import { User } from "../models/User.model.js";

import Stripe from "stripe";
const stripe = new Stripe(process.env.stipe_secret_key);




export const createPaymentIntent = async (req, res) => {
  try {
    const { amount } = req.body;
    let _id = new mongoose.Types.ObjectId("66f12a57da8f9ada854f6677");
    let email = "surajthakurrs45@gmail.com";

    if (amount < 41) {
      return res.status(400).json({ error: "Amount must be at least ₹41.00." });
    }
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: "inr",
      metadata: {
        userId: _id.toString(),
        email,
      },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

export const addMoney = async (req, res) => {
  try {
    const { amount, transactionId, paymentMethod, status } = req.body;
    let { _id } = new mongoose.Types.ObjectId("66f12a57da8f9ada854f6677");
    const paymentStatus = status === "succeeded" ? "completed" : "failed";

    const addMoneyEntry = new AddMoney({
      user: _id,
      amount,
      status: paymentStatus,
      transactionId,
      paymentMethod,
    });

    await addMoneyEntry.save();
    if (paymentStatus === "completed") {
      await User.findByIdAndUpdate(_id, {
        $inc: { balance: amount },
      });
    }

    res.status(200).json({ success: true, message: "Payment recorded successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};



