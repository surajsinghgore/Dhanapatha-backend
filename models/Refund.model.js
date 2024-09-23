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
    refundTransaction: { 
        type: String, 
        unique: true
    },
    senderReceived: { 
        type: Number, 
        required: true 
    },
    receiverReceived: { 
        type: Number, 
        required: true 
    },
    adminReceived: { 
        type: Number, 
        required: true 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

RefundSchema.pre('save', function(next) {
    if (!this.refundTransaction) {
        this.refundTransaction = new mongoose.Types.ObjectId().toString();  
    }
    next();
});

export const Refund = mongoose.model("Refund", RefundSchema);
