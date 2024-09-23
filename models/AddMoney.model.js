import mongoose from 'mongoose';
const { Schema } = mongoose;

const AddMoneySchema = new Schema({
  user: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  amount: { 
    type: Number, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'completed', 'failed'], 
    default: 'pending' 
  },
  transactionId: { 
    type: String, 
    required: true 
  },
  paymentMethod: { 
    type: String, 
    enum: ['card', 'bank_transfer', 'wallet'], 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date 
  }
});

AddMoneySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const AddMoney = mongoose.model('AddMoney', AddMoneySchema);
export default AddMoney;
