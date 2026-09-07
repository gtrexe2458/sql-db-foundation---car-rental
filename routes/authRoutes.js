import express from "express";

import {signup, login, logout} from "../controllers/authController.js";

import { verifyToken } from "../middleware/jwt.js";
import { getProfile, updateProfile } from "../controllers/authController.js";




const router = express.Router();

// /api/auth
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.get("/profile", verifyToken, getProfile);
router.put("/profile", verifyToken, updateProfile);

export default router;
