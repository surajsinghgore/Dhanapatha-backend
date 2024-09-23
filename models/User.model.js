import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new Schema({
    username: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    accountNumber: { 
        type: String, 
        unique: true, 
        sparse: true, 
        validate: {
            validator: function(v) {
                return /^\d{16}$/.test(v);
            },
            message: props => `${props.value} is not a valid 16-digit account number!`
        }
    },
    balance: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
});

UserSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

export const User = mongoose.model("User", UserSchema);
