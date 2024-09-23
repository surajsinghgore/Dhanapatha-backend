import { User } from "../models/User.model.js";




export const addAccount = async (req, res) => {
  try {
    const { _id } = req.user;
    const { accountNumber } = req.body;

    if (!accountNumber || !_id) {
      return res.status(400).json({ message: "Account number and User ID are required" });
    }

    if (!/^\d{16}$/.test(accountNumber)) {
      return res.status(400).json({ message: "Account number must be a 16-digit number" });
    }

    const existingAccount = await User.findOne({ accountNumber });

    if (existingAccount && !existingAccount._id.equals(_id)) {
      console.log(existingAccount._id.toString(),_id)
      return res.status(400).json({ message: "Account number is already registered with another user" });
    }

    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.accountNumber === accountNumber) {
      return res.status(200).json({
        success: true,
        message: "You have already added this account number",
        accountNumber,
      });
    }

    if (user.accountNumber !== accountNumber) {
      user.accountNumber = accountNumber;
      await user.save();

      return res.status(200).json({
        success: true,
        message: "Account number updated successfully",
        accountNumber,
      });
    }

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};







export const fetchAccountBalance = async (req, res) => {
  try {
    const { _id } = req.user;

const balance=await User.findById(_id).select("balance");

if(!balance){
  return res.status(404).json({ success: false, message: "User not found" });
}

return res.status(200).json({ success: true, data:balance });


  } catch (error) {
    console.error("Stripe balance get:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
