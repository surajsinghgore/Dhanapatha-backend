import jwt from "jsonwebtoken";
import { User } from "../models/User.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyUserToken = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ error: "Unauthorized request: No token provided" });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decodedToken?.id).select("-password");

    if (!user) {
      return res.status(401).json({ error: "Unauthorized request: User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({status:false, error: "Token has expired" });
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ status:false,error: "Invalid access token" });
    }
    return res.status(401).json({ error: error.message || "Unauthorized request" });
  }
});
