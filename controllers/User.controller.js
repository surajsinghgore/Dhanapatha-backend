import { getRegisterUserHandler } from "../handlers/User.hanlder.js";
import { User } from "../models/User.model.js";
export const RegisterUser = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const newUser = await User.create({ username, email, password });
    res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Server error" });
  }
};
export const loginUser = async (req, res) => {
  await getRegisterUserHandler(req, res);
};
