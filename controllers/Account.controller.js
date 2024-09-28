import { User } from "../models/User.model.js";
import {Transaction} from "../models/Transaction.model.js"
import AddMoney from "../models/AddMoney.model.js"
import { formatDateTime } from "../handlers/handler.js";



export const addAccount = async (req, res) => {
  try {
    const { accountHolderName, accountNumber, ifscCode, bankName, accountType } = req.body;

    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ status:false, message: "User not found" });
    }

    if (
      user.bankAccountDetails &&
      user.bankAccountDetails.accountNumber === accountNumber &&
      user.bankAccountDetails.ifscCode === ifscCode
    ) {
      return res.status(400).json({  status:false,message: "You have already added this account." });
    }

    const existingUser = await User.findOne({ 
      "bankAccountDetails.accountNumber": accountNumber, 
      "bankAccountDetails.ifscCode": ifscCode 
    });

    if (existingUser) {
      return res.status(400).json({  status:false,message: "This combination of account number and IFSC code already exists for another user." });
    }

    if (user.bankAccountDetails && user.bankAccountDetails.accountNumber) {
      return res.status(400).json({ status:false, message: "Bank account already exists. You cannot add another." });
    }

    const accountNumberRegex = /^\d{9,18}$/;
    const ifscCodeRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/; 

    if (!accountNumberRegex.test(accountNumber)) {
      return res.status(400).json({  status:false,message: "Invalid account number. Must be between 9 and 18 digits." });
    }
    if (!ifscCodeRegex.test(ifscCode)) { 
      return res.status(400).json({  status:false,message: "Invalid IFSC code. Must follow the format 'ABCD0000123'." });
    }
    if (!["checking", "savings", "business"].includes(accountType)) {
      return res.status(400).json({  status:false,message: "Invalid account type. Must be 'checking', 'savings', or 'business'." });
    }

    // Save bank account details
    user.bankAccountDetails = {
      accountHolderName,
      accountNumber,
      ifscCode,
      bankName,
      accountType
    };

    await user.save();

    return res.status(200).json({  status:true,message: "Bank details added successfully", user });

  } catch (error) {
    console.error(error);
    return res.status(500).json({  status:false,message: "Internal server error" });
  }
};


export const updateAccount = async (req, res) => {
  try {
    const { accountHolderName, accountNumber, ifscCode, bankName, accountType } = req.body;

    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({status:false, message: "User not found" });
    }

    if (!user.bankAccountDetails || !user.bankAccountDetails.accountNumber) {
      return res.status(400).json({status:false, message: "No bank account details found to update." });
    }

    const accountNumberRegex = /^\d{9,18}$/;
    const ifscCodeRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;

    if (!accountNumberRegex.test(accountNumber)) {
      return res.status(400).json({ status:false,message: "Invalid account number. Must be between 9 and 18 digits." });
    }
    if (!ifscCodeRegex.test(ifscCode)) {
      return res.status(400).json({  status:false,message: "Invalid IFSC code. Must follow the format 'ABCD0000123'." });
    }
    if (!["checking", "savings", "business"].includes(accountType)) {
      return res.status(400).json({ status:false, message: "Invalid account type. Must be 'checking', 'savings', or 'business'." });
    }

    if (
      user.bankAccountDetails.accountHolderName === accountHolderName &&
      user.bankAccountDetails.accountNumber === accountNumber &&
      user.bankAccountDetails.ifscCode === ifscCode &&
      user.bankAccountDetails.bankName === bankName &&
      user.bankAccountDetails.accountType === accountType
    ) {
      return res.status(400).json({  status:false,message: "You already have this account details. Please enter new account details." });
    }

    const existingUser = await User.findOne({ 
      "bankAccountDetails.accountNumber": accountNumber, 
      "bankAccountDetails.ifscCode": ifscCode 
    });

    if (existingUser && existingUser._id.toString() !== userId) {
      return res.status(400).json({ status:false, message: "This combination of account number and IFSC code already exists for another user." });
    }


    user.bankAccountDetails = {
      accountHolderName,
      accountNumber,
      ifscCode,
      bankName,
      accountType
    };

    await user.save();

    return res.status(200).json({  status:true,message: "Bank details updated successfully", user });

  } catch (error) {
    console.error(error);
    return res.status(500).json({  status:false,message: "Internal server error" });
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


export const transferMoney = async (req, res) => {
  try {
    const { receiverEmail, amount } = req.body;
    const senderId = req.user._id;

    const amountInt = parseInt(amount, 10); 

    if (!amountInt || amountInt <= 0) {
      return res.status(400).json({ success: false, message: 'Amount must be a positive number' });
    }
    if (!receiverEmail) {
      return res.status(400).json({ success: false, message: 'Please provide receiver email id' });
    }

    const sender = await User.findById(senderId);
    const receiver = await User.findOne({ email: receiverEmail });

    if (!receiver) {
      return res.status(404).json({ success: false, message: 'Receiver not found' });
    }

    if (!sender) {
      return res.status(404).json({ success: false, message: 'Sender not found' });
    }

    if (sender.balance < amountInt) {
      return res.status(400).json({ success: false, message: 'Insufficient balance' });
    }

    const transaction = await Transaction.create({
      senderId: sender._id,
      receiverId: receiver._id,
      amount: amountInt, // Use the converted integer amount
    });

    await sender.deductBalance(amountInt); // Use the converted integer amount
    await receiver.incrementBalance(amountInt); // Use the converted integer amount

    res.status(200).json({ success: true, message: 'Transfer successful', transaction, status: transaction.status });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};



export const fetchTransactions = async (req, res) => {
  try {
    const userId = req.user._id;

    const transactions = await Transaction.find({
      $or: [
        { senderId: userId },
        { receiverId: userId }
      ]
    })
    .sort({ createdAt: -1 })
    .populate('senderId', 'username email') 
    .populate('receiverId', 'username email')  
    .exec();


    const addMoneyTransactions = await AddMoney.find({ userId })
      .sort({ createdAt: -1 })
      .exec();

 
    const formattedTransactions = transactions.map(transaction => ({
      transactionId: transaction.transactionId,
      amount: transaction.amount,
      type: 'Transfer', 
      senderUsername: transaction.senderId.username, 
      receiver: transaction.receiverId, 
      status: transaction.status,
      createdAt: transaction.createdAt
    }));


    const formattedAddMoneyTransactions = addMoneyTransactions.map(addMoney => ({
      transactionId: addMoney.transactionId,
      amount: addMoney.amount,
      type: 'Add Money',
      status: addMoney.status,
      createdAt: addMoney.createdAt
    }));

    const allTransactions = [...formattedTransactions, ...formattedAddMoneyTransactions];
    allTransactions.sort((a, b) => b.createdAt - a.createdAt);

    res.status(200).json({ success: true, transactions: allTransactions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};



export const getBankDetails = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ status:false,message: "User not found" });
    }

    if (!user.bankAccountDetails || !user.bankAccountDetails.accountNumber) {
      return res.status(404).json({ status:true,message: "No bank account details found." });
    }

    return res.status(200).json({ message: "Bank account details retrieved successfully", bankAccountDetails: user.bankAccountDetails });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ status:false,message: "Internal server error" });
  }
};



export const uniqueReceivers = async (req, res) => {
  try {
    const userId = req.user._id;

    // Use aggregation to group by receiverId and get unique receivers
    const transactions = await Transaction.aggregate([
      {
        $match: {
          senderId: userId,
          receiverId: { $ne: userId } // Ensure the receiver is not the same as the sender
        }
      },
      {
        $group: {
          _id: '$receiverId', // Group by receiverId
          lastTransaction: { $max: '$createdAt' }, // Get the latest transaction date
          amount: { $first: '$amount' }, // Get the amount (you can adjust this based on your needs)
          status: { $first: '$status' }, // Get the status (you can adjust this based on your needs)
        }
      },
      {
        $lookup: {
          from: 'users', // The collection name for users
          localField: '_id',
          foreignField: '_id',
          as: 'receiverDetails'
        }
      },
      {
        $unwind: '$receiverDetails' 
      },
      {
        $project: {
          _id: 0,
          receiverId: '$_id',
          username: '$receiverDetails.username',
          email: '$receiverDetails.email',
          lastTransaction: 1,
          amount: 1,
          status: 1
        }
      },
      {
        $sort: { lastTransaction: -1 }
      }
    ]);

    return res.status(200).json({ receivers: transactions });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};




export const getTransactionsByReceiverEmail = async (req, res) => {
  try {
    const { email } = req.query;

       const receiver = await User.findOne({ email });

    if (!receiver) {
      return res.status(404).json({ message: "Receiver not found." });
    }

    const transactions = await Transaction.find({
      $or: [
        { receiverId: receiver._id },  
        { senderId: receiver._id }      
      ]
    }).sort({ createdAt: 1 }); 


    const groupedTransactions = transactions.reduce((acc, transaction) => {
      const formattedDate = formatDateTime(transaction.createdAt).split(",")[0]; 
      const formattedTime = formatDateTime(transaction.createdAt).split(",")[1].trim(); 
      if (!acc[formattedDate]) {
        acc[formattedDate] = [];
      }
      acc[formattedDate].push({
        transactionId: transaction._id,
        senderId: transaction.senderId,
        receiverId: transaction.receiverId,
        amount: transaction.amount,
        status: transaction.status,
        date: formattedDate,
        time: formattedTime,
      });
      return acc;
    }, {});

    const formattedResponse = Object.entries(groupedTransactions).map(([date, trans]) => ({
      date,
      transactions: trans,
    }));

    return res.status(200).json({ transactions: formattedResponse });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
