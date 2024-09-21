import mongoose, { Schema } from "mongoose";

const RefundSchema = new Schema({
    transactionId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Transaction', 
        required: true 
    },
    amount: { 
        type: Number, 
        required: true
    },
    stripeRefundId: { 
        type: String, 
        required: true 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

// Exporting the Refund model
export const Refund = mongoose.model("Refund", RefundSchema);
