import mongoose from "mongoose";
import AddMoney from "../models/AddMoney.model.js";
import { User } from "../models/User.model.js";

import Stripe from "stripe";
import { Withdrawal } from "../models/Withdrawal.model.js";
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

export const withdrawMoney = async (req, res) => {
  try {
    const userId = req.user._id;
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: "Invalid amount" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }


    if (user.balance < amount) {
      return res.status(400).json({ success: false, message: "Insufficient balance" });
    }

    const { bankAccountDetails } = user;
    if (!bankAccountDetails || !bankAccountDetails.accountNumber) {
      return res.status(400).json({ success: false, message: "No bank account details found" });
    }

    const withdrawalDetails = {
      userId,
      amount,
      bankAccountDetails: {
        accountHolderName: bankAccountDetails.accountHolderName,
        accountNumber: bankAccountDetails.accountNumber,
        ifscCode: bankAccountDetails.ifscCode,
        bankName: bankAccountDetails.bankName,
        accountType: bankAccountDetails.accountType
      },
      status: 'completed' 
    };





    const withdrawal = new Withdrawal(withdrawalDetails);
    await withdrawal.save();
    user.balance -= amount;
    await user.save();
    res.status(200).json({
      success: true,
      message: "Withdrawal processed successfully",
      withdrawal
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


// bankAccountDetails: {
//   accountHolderName,
//   accountNumber,
//   routingNumber,        IFSC
//   bankName,
//   accountType   checking, savings, business
// } 


// const stripe = new Stripe('your_stripe_secret_key'); // Replace with your Stripe secret key

// export const withdrawMoney = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const { amount } = req.body; // Get the withdrawal amount from the request

//     if (!amount || amount <= 0) {
//       return res.status(400).json({ success: false, message: "Invalid amount" });
//     }

//     // Fetch the user to check the balance and bank account details
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ success: false, message: "User not found" });
//     }

//     // Check if the user has sufficient balance
//     if (user.balance < amount) {
//       return res.status(400).json({ success: false, message: "Insufficient balance" });
//     }

//     // Deduct the amount from the user's balance
//     user.balance -= amount;
//     await user.save();

//     // Create a payout using Stripe
//     const payout = await stripe.payouts.create({
//       amount: amount * 100, // Amount in cents
//       currency: 'usd', // Change to your desired currency
//       destination: user.stripeAccountId, // The Stripe account ID of the user
//       // Optionally, you can add metadata or description
//     });

//     // Create a withdrawal record
//     const withdrawal = new Withdrawal({
//       userId,
//       amount,
//       bankAccountDetails: {
//         accountHolderName: user.accountHolderName,
//         accountNumber: user.accountNumber,
//         routingNumber: user.routingNumber,
//         bankName: user.bankName,
//         accountType: user.accountType
//       }, // Assuming these fields exist in the User model
//       status: 'completed' // Update this based on Stripe's response
//     });

//     await withdrawal.save();

//     res.status(200).json({
//       success: true,
//       message: "Withdrawal processed successfully",
//       payout, // Return payout details if needed
//       withdrawal
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Internal server error", error: error.message });
//   }
// };