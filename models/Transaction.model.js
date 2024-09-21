import mongoose, { Schema } from "mongoose";

const TransactionSchema = new Schema({
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Sender's user ID
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Receiver's user ID
    amount: { type: Number, required: true }, // Amount of money transferred
    stripeTransactionId: { type: String, required: true }, // ID from Stripe for the transaction
    status: { type: String, enum: ['completed', 'refunded'], default: 'completed' }, // Status of the transaction
    createdAt: { type: Date, default: Date.now } // Timestamp of when the transaction was created
});

export const Transaction = mongoose.model("Transaction", TransactionSchema);
