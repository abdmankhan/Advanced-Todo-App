import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import { verifyGoogleToken } from "../config/googleOAuth.js";

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
    const jwttoken = await generateToken(res, user._id);
    // console.log("JWT TOKEN", jwttoken);
    // console.log("Google user logged in:", user.email);

    const response = res.status(200).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        googleId: user.googleId,
        otpVerified: user.otpVerified,
      },
    });
    console.log(response.user);
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
  dummy,
  getProfile,
  updateProfile,
  logout,
  googleSignIn,
};
