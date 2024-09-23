import mongoose, { Schema } from "mongoose";

const AdminSchema = new Schema({
    username: { 
        type: String, 
        required: true, 
        unique: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    balance: { 
        type: Number, 
        default: 0 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});


export const Admin = mongoose.model("Admin", AdminSchema);
