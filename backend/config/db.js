// import mongoose from 'mongoose';
// import asyncHandler from 'express-async-handler';

// const connectDB = asyncHandler(async() =>{
//   const conn = await mongoose.connect(process.env.MONGO_URI);
//   console.log(`MongoDB Connected : ${conn.connection.host}/${conn.connection.name}`)
// })

// export default connectDB;

import mongoose from "mongoose";
import asyncHandler from 'express-async-handler'

const connectDB = asyncHandler( async() => {
  const conn = await mongoose.connect(process.env.MONGO_URI);
  console.log(`MongoDB Connectd : ${conn.connection.host}/${conn.connection.name}`);
  
})
export default connectDB;