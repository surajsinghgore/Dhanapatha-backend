import mongoose, { Schema } from "mongoose";

const TransactionSchema = new Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true }, 
  amount: { type: Number, required: true }, 
  transactionId: { type: String,  unique: true }, 
  status: { type: String, enum: ['completed', 'refunded'], default: 'completed' }, 
  createdAt: { type: Date, default: Date.now } 
});

// Pre-save hook to generate a unique transactionId
TransactionSchema.pre('save', function(next) {
  if (!this.transactionId) {
    this.transactionId = new mongoose.Types.ObjectId().toString(); // Generate a unique transaction ID as a string
  }
  next();
});

export const Transaction = mongoose.model("Transaction", TransactionSchema);
