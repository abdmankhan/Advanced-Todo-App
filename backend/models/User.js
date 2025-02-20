import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema({
  name : {
    type : String,
    required : true
  }, 
  email : {
    type : String,
    required : true,
    unique : true
  },
  password : {
    type : String,
  },
  googleId : {
    type : String
  }, 
  otpVerified : {
    type : Boolean,
    default : false
  }
},
{
  timestamps : true
});


userSchema.pre("save", async function (next) {
  // middleware to hash the password before saving it to the database

  if (!this.isModified("password")) {
    // if the password is not modified, call the next middleware
    next(); // call the next middleware
  }

  const salt = await bcrypt.genSalt(10); // generate a salt to hash
  this.password = await bcrypt.hash(this.password, salt); // hash the password
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  // compare the entered password with the hashed password
  return await bcrypt.compare(enteredPassword, this.password); 
};


const User = mongoose.model("User", userSchema);

export default User;