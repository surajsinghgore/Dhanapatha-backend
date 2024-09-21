import { getRegisterUserHandler } from "../handlers/User.hanlder.js"



export const loginUser=async(req,res)=>{
    await getRegisterUserHandler(req,res)
}