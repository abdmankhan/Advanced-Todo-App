import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import { verifyGoogleToken } from "../config/googleOAuth.js";
import sendEmail from "../utils/sendEmail.js";
import jwt from "jsonwebtoken";


// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
const signup = asyncHandler(async (req, res) => {
  const { name, email, password, googleId, otpVerified } = req.body;
  console.log(req.body);

  const userExits = await User.findOne({ email });
  if (userExits) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    googleId,
    otpVerified,
  });

  if (user) {
    generateToken(res, user._id);
    // send email
    await sendEmail(
      user.email,
      "Welcome to Brevo",
      `<p>Hi ${user.name},</p>
        <p>Thank you for signing up with Brevo. We're excited to have you on board!</p>
        <p>Feel free to explore our platform and let us know if you have any questions.</p>
        <p>Best,<br />The Brevo Team</p>`
    );
    res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        googleId: user.googleId,
        otpVerified: user.otpVerified,
      },
    });
    console.log("User created");
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  // Check if password exists
  if (!user.password) {
    return res.status(401).json({
      message:
        "You signed up with Google. Please use Google Sign-In or set a password via Forgot Password.",
    });
  }
  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);
    res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
    console.log("User logged in");
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc    Forget Password
// @route   POST /api/auth/forgetpassword
// @access  Public
const forgetPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Generate reset token (valid for 15 mins)
  const resetToken = jwt.sign(
    { id: user._id },
    process.env.JWT_FORGET_PASSWORD_SECRET,
    { expiresIn: "15m" }
  );

  // Reset URL
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
  // Email content
  const message = `
      <h2>Password Reset Request</h2>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>If you didn’t request this, ignore this email.</p>
    `;

  // Send email
  await sendEmail(email, "Password Reset", message);

  return res.json({ message: "Reset link sent to email" });
});

// @desc   Reset Password
// @route  POST /api/auth/resetPassword
// @access Public

const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;
  console.log(req.body)
  // Verify reset token
  const decoded = jwt.verify(token, process.env.JWT_FORGET_PASSWORD_SECRET);
  const user = await User.findById(decoded.id);
  if (!user) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  console.log("New Password", password);
  // Hash new password
  user.password = password;
  await user.save();
  return res.json({ message: "Password reset successful" });
  // return res.json({ message: "Reset Password" });
});

// @desc UserProfile
// @route GET /api/auth/profile
// @access Private
const getProfile = asyncHandler(async (req, res) => {
  // this req.user is coming from the protect middleware not from the react frontend
  res.status(200).json({
    user: {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      googleId: req.user.googleId,
    },
  });
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private

const updateProfile = asyncHandler(async (req, res) => {
  const user = req.user;
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
    });
  }
});

//  @desc    Logout user
//  @route   GET /api/auth/logout
//  @access  Private
const logout = asyncHandler(async (req, res) => {
  // const token = req.cookies.jwt;
  // const decoded = jwt.verify(token, process.env.JWT_SECRET);
  res.cookie("jwt", "Logged out clicked", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logout Successful" });
});

// @desc    Dummy route
// @route   GET /api/auth/dummy
// @access  Public
const dummy = asyncHandler(async (req, res) => {
  res.send("Dummy world");
});

// @desc Google OAuth
// @route GET /api/auth/google
// @access Public

const googleSignIn = asyncHandler(async (req, res) => {
  try {
    const { token } = req.body;
    // console.log( REQUEST.BODY,req.body);
    // console.log("Received Google token:", token);

    const googleUser = await verifyGoogleToken(token);
    // console.log("Google user payload:", googleUser);

    // Check existing users with same email or googleId
    let user = await User.findOne({ email: googleUser.email });

    // console.log("USERID", user);
    // Case 1: Existing email user without googleId (merge accounts)
    if (user && !user.googleId) {
      console.log("Merging accounts for:", user.email);
      user.googleId = googleUser.sub;
      user.otpVerified = true;
      await user.save();
    }

    // Case 2: New Google user
    if (!user) {
      console.log("Creating new user for:", googleUser.email);
      user = await User.create({
        name: googleUser.name,
        email: googleUser.email,
        googleId: googleUser.sub,
        otpVerified: true,
        password: undefined, // Explicitly set as undefined
      });
      // console.log("USER", user);
      // console.log(New Google user created, user._id);
    }
    // console.log("USER ID", user._id);
    // Reuse your existing token generation
    generateToken(res, user._id);
    // console.log("JWT TOKEN", jwttoken);
    console.log("Google user logged in:", user.email);

    const response = res.status(200).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        googleId: user.googleId,
        otpVerified: user.otpVerified,
      },
    });
  } catch (error) {
    console.error("Google authentication error:", error);
    res
      .status(401)
      .json({ message: "Google authentication failed", error: error.message });
  }
});

export {
  signup,
  login,
  forgetPassword,
  resetPassword,
  dummy,
  getProfile,
  updateProfile,
  logout,
  googleSignIn,
};
