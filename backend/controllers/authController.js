import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";


// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
const signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
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
  });

  if (user) {
    generateToken(res, user._id);
    res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
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
  const {email, password} = req.body;
  const user = await User.findOne({email})
  if(user && (await user.matchPassword(password))){
    generateToken(res, user._id)
    res.status(201).json({
      user : {
        _id : user._id,
        name : user.name,
        email : user.email
      }
    })
    console.log("User logged in")
  } else {
    res.status(401)
    throw new Error("Invalid email or password")
  }
});

// @desc UserProfile
// @route GET /api/auth/profile
// @access Private
const getProfile = asyncHandler(async (req, res) => {
  // this req.user is coming from the protect middleware not from the react frontend
  res.status(200).json(req.user)
})

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private

const updateProfile = asyncHandler(async (req, res) => {
  
  const user = req.user;
  if(user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if(req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    res.status(200).json({
      _id : updatedUser._id,
      name : updatedUser.name,
      email : updatedUser.email
    })
  }
})

//  @desc    Logout user
//  @route   GET /api/auth/logout
//  @access  Private
const logout = asyncHandler( async(req, res) => {
  // const token = req.cookies.jwt;
  // const decoded = jwt.verify(token, process.env.JWT_SECRET);
  res.cookie('jwt', "Logged out clicked", {
    httpOnly : true,
    expires : new Date(0),
  })
  res.status(200).json({message : 'Logout Successful'})
})

// @desc    Dummy route
// @route   GET /api/auth/dummy
// @access  Public
const dummy = asyncHandler(async (req, res) => {
  res.send("Dummy world");
});

export { signup, login, dummy, getProfile, updateProfile, logout };
