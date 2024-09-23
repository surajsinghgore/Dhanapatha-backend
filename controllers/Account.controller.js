import { User } from "../models/User.model.js";
import {Transaction} from "../models/Transaction.model.js"



export const addAccount = async (req, res) => {
  try {
    const { _id } = req.user;
    const { accountNumber } = req.body;

    if (!accountNumber || !_id) {
      return res.status(400).json({ message: "Account number and User ID are required" });
    }

    if (!/^\d{16}$/.test(accountNumber)) {
      return res.status(400).json({ message: "Account number must be a 16-digit number" });
    }

    const existingAccount = await User.findOne({ accountNumber });

    if (existingAccount && !existingAccount._id.equals(_id)) {
      console.log(existingAccount._id.toString(),_id)
      return res.status(400).json({ message: "Account number is already registered with another user" });
    }

    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.accountNumber === accountNumber) {
      return res.status(200).json({
        success: true,
        message: "You have already added this account number",
        accountNumber,
      });
    }

    if (user.accountNumber !== accountNumber) {
      user.accountNumber = accountNumber;
      await user.save();

      return res.status(200).json({
        success: true,
        message: "Account number updated successfully",
        accountNumber,
      });
    }

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};







export const fetchAccountBalance = async (req, res) => {
  try {
    const { _id } = req.user;

const balance=await User.findById(_id).select("balance");

if(!balance){
  return res.status(404).json({ success: false, message: "User not found" });
}

return res.status(200).json({ success: true, data:balance });


  } catch (error) {
    console.error("Stripe balance get:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};



export const transferMoney = async (req, res) => {
  try {
    const { receiverEmail, amount } = req.body;
    const senderId = req.user._id;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Amount must be a positive number' });
    }
    if (!receiverEmail) {
      return res.status(400).json({ success: false, message: 'Please provide receiver email id' });
    }

    const sender = await User.findById(senderId);
    const receiver = await User.findOne({ email: receiverEmail });

    if (!receiver) {
      return res.status(404).json({ success: false, message: 'Receiver not found' });
    }

    if (!sender) {
      return res.status(404).json({ success: false, message: 'Sender not found' });
    }

    if (sender.balance < amount) {
      return res.status(400).json({ success: false, message: 'Insufficient balance' });
    }

    const transaction = await Transaction.create({
      senderId: sender._id,
      receiverId: receiver._id,
      amount,
    });

    await sender.deductBalance(amount);
    await receiver.incrementBalance(amount);

    res.status(200).json({ success: true, message: 'Transfer successful', transaction, status: transaction.status });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

