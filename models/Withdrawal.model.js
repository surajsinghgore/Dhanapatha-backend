import mongoose, { Schema } from "mongoose";

const WithdrawalSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  bankAccountDetails: {
    accountHolderName: { type: String, required: true },
    accountNumber: { type: String, required: true },
    routingNumber: { type: String, required: true },
    bankName: { type: String, required: true },
    accountType: { type: String, required: true }
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const Withdrawal = mongoose.model("Withdrawal", WithdrawalSchema);
