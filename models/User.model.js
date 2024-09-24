import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true, index: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  balance: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  bankAccountDetails: {
    accountHolderName: { type: String },
    accountNumber: { 
      type: String, 
    
      validate: {
        validator: function(v) {
            return /^\d{9,18}$/.test(v); // Allow 9 to 18 digits
        },
        message: props => `${props.value} is not a valid account number! It must be between 9 and 18 digits.`
     }
    },
    ifscCode: { 
        type: String, 
   
        validate: {
            validator: function(v) {
                return /^[A-Z]{4}0[A-Z0-9]{6}$/.test(v); // Validate IFSC code format
            },
            message: props => `${props.value} is not a valid IFSC code! It must follow the format 'ABCD0000123'.`
        }
    },
    bankName: { type: String},
    accountType: { 
      type: String, 
      enum: ['checking', 'savings', 'business'], 
     
    }
  }
});

// Hashing the password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Password verification method
UserSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Method to deduct balance
UserSchema.methods.deductBalance = async function(amount) {
  if (this.balance < amount) {
    throw new Error('Insufficient balance');
  }
  this.balance -= amount;
  await this.save();
};

// Method to increment balance
UserSchema.methods.incrementBalance = async function(amount) {
  this.balance += amount;
  await this.save();
};

export const User = mongoose.model("User", UserSchema);
