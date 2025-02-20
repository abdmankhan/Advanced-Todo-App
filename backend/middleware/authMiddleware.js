import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/User.js";

const protect = asyncHandler(async (req, res, next) => {
  let token;

  token = req.cookies.jwt; // get the token from the cookie

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // verify the token with the secret key
      // console.log(decoded); // log the decoded
      
      req.user = await User.findById(decoded.userId).select("-password"); // get the user by id and exclude the password
      
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, invalid token");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

export { protect }; // export the protect function
