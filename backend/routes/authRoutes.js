import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  login,
  signup,
  dummy,
  getProfile,
  updateProfile,
  logout,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);
router.get("/getProfile", protect, getProfile);
router.put("/updateProfile", protect, updateProfile);
router.post("/logout", logout);

router.get("/dummy", dummy);

export default router;
