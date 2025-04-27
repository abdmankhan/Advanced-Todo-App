import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  login,
  signup,
  forgetPassword,
  resetPassword,
  dummy,
  getProfile,
  updateProfile,
  logout,
  googleSignIn,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);
router.post("/forgot-password", forgetPassword);
router.post("/reset-password", resetPassword);
router.get("/getProfile", protect, getProfile);
router.put("/updateProfile", protect, updateProfile);
router.post("/logout", logout);
router.get("/dummy", dummy);
router.post('/google', googleSignIn);

export default router;
