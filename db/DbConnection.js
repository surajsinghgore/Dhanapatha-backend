import mongoose from "mongoose";
import {DB_NAME} from '../constants.js'
export  const DbConnection=async()=>{
    try {
        mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
    } catch (error) {
        console.log("MONGODB connection FAILED ", error);
        process.exit(1)
    }
}