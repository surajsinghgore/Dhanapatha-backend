import { User } from "../models/User.model.js";
import jwt from 'jsonwebtoken';




export const RegisterUserHandler = async (req, res) => {
  const { username, email, password } = req.body;

  try {
      const newUser = await User.create({ username, email, password });


      const token = jwt.sign(
        { id: newUser._id, email: newUser.email, username: newUser.username }, 
        process.env.JWT_SECRET, 
        { expiresIn: '1h' } 
    );

      return res.status(201).json({
          success: true,
          message: 'User registered successfully',
          user: {
              _id: newUser._id,
              email: newUser.email,
              username: newUser.username
          },
          token
      });
  } catch (error) {
      console.error("Error creating user:", error);
      return res.status(500).json({ success: false, message: 'Server error' });
  }
};




export const loginUserHandler = async (usernameOrEmail, password) => {
  const user = await User.findOne({
      $or: [{ email: usernameOrEmail }, { username: usernameOrEmail }]
  });

  if (!user) {
      throw new Error("No account found with this username or email.");
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
      throw new Error("Incorrect password.");
  }

  // Generate a token
  const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
  );

  return { user, token };
};




export const formatDateTime = (date) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    return new Date(date).toLocaleString('en-GB', options); // Format to DD-MM-YYYY HH:MM:SS
  };