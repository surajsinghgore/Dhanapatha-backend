import { Refund } from "../models/Refund.model.js";
import { Transaction } from "../models/Transaction.model.js";
import { User } from "../models/User.model.js";
import { Admin } from "../models/Admin.model.js";

export const refundTransaction = async (req, res) => {
    try {
      const { transactionId } = req.body;
      const userId = req.user._id;
  
      if (!transactionId) {
        return res.status(404).json({ success: false, message: "Please provide transaction Id" });
      }
  
      const transaction = await Transaction.findById(transactionId);
  
      if (!transaction) {
        return res.status(404).json({ success: false, message: "Transaction not found" });
      }
  
      // Check if the user is the sender of the transaction
      if (transaction.senderId.toString() !== userId.toString()) {
        return res.status(403).json({ success: false, message: "This is not your payment, you cannot refund it" });
      }
  
      const existingRefund = await Refund.findOne({ transactionId: transaction._id });
      if (existingRefund) {
        return res.status(400).json({ success: false, message: "Transaction has already been refunded", status: "refunded" });
      }
  
      const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000);
      if (transaction.createdAt < threeHoursAgo) {
        return res.status(400).json({ success: false, message: "Refund period has expired" });
      }
  
      const refundAmount = transaction.amount;
      const senderRefundAmount = refundAmount * 0.90; // 90% back to sender
      const receiverAmount = refundAmount * 0.05; // 5% back to receiver
      const adminAmount = refundAmount * 0.05; // 5% to admin
  
      const sender = await User.findById(transaction.senderId);
      const receiver = await User.findById(transaction.receiverId);
  
      // Update balances
      sender.balance += senderRefundAmount; // Add 90% back to sender
      receiver.balance -= refundAmount; // Deduct full amount from receiver
      receiver.balance += receiverAmount; // Add 5% back to receiver
  
      const admin = await Admin.findOne();
    
      const refund = new Refund({
        transactionId: transaction._id,
        amount: refundAmount,
        senderReceived: senderRefundAmount, 
        receiverReceived: receiverAmount, 
        adminReceived: adminAmount 
      });
  
      await refund.save();
  
      if (admin) {
        admin.balance += adminAmount; 
        await admin.save();
      }
  
      await sender.save();
      await receiver.save();
  
      res.status(200).json({ success: true, message: "Refund processed successfully", refund });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };
