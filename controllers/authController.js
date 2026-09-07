
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {
  findUserById,
  findUserByEmail, 
  createUser, 
  updateUserModel
} from '../models/userModel.js';
import { newToken } from '../middleware/jwt.js';

export const signup = async (req, res) => {

  const { name, email, contact, id, country, password } = req.body;

  if (!name || !email || !contact || !id || !country || !password) {
    
      return res.status(400).json({ error: 'All fields are required.' });
  }

  try {

    const userExists = await findUserByEmail(email);

    if (userExists) {

      return res.status(400).json({ error: 'this Email already registered!' });
    }

    if(
	password.length < 8 ||
	! /[a-z]/.test(password) ||
	! /[A-Z]/.test(password) ||
	! /[0-9]/.test(password)
    ) {
	
	return res.status(400).json({ error: 'follow password req log.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await createUser(name, email, contact, id, country, passwordHash);

    const token = await newToken(newUser.user_id, res);

    return res.status(201).json({ 
	message: 'User created successfully!',
	token,
	user: {
	    id: newUser.user_id,
	    name: newUser.full_name || name,
	    email: newUser.email,
	    contact: newUser.contact,
	    id: newUser.id,
	    country: country
	}
    });

  } 

  catch (error) {

    console.error('Signup Error:', error);

    return res.status(500).json({ error: 'Server error during signup' });
  }
};

export const login = async (req, res) => {

  const { email, password } = req.body;

  if (!email || !password) {

    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {

    const user = await findUserByEmail(email);

    if (!user) {

      return res.status(400).json({ error: 'Invalid data: email / password...' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {

      return res.status(400).json({ error: 'Invalid data: email / password...' });
    }

    const token = await newToken(user.user_id, res);

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.user_id,
        name: user.full_name,
        email: user.email,
        role: user.role || "client",
      },
    });
  } 

  catch (error) {

    console.error('Login Error:', error);

    return res.status(500).json({ error: 'Server error during login' });
  }
};

export const logout = async (req, res) => {

  // Clear the cookie from the browser
  res.clearCookie("jwt", {
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "open"
  });

  return res.status(200).json({ message: "Logged out successfully" });
};




// GET profile data for settings page
export const getProfile = async (req, res) => {

  try {

    const user = await findUserById(req.user.user_id);

    if (!user) return res.status(404).json({ success: false, error: "User not found" });

    res.json({ success: true, data: user });
  } 

  catch (err) {

    res.status(500).json({ success: false, error: err.message });
  }
};




// PUT update AS settings
export const updateProfile = async (req, res) => {

  try {

    const { full_name, contact, country, id } = req.body;

    if (!full_name || !country || !id) {

      return res.status(400).json({ success: false, error: "All fields are required" });
    }

    const updatedUser = await updateUserModel(req.user.user_id, { full_name, contact, country, id });

    res.json({ success: true, message: "Profile updated", data: updatedUser });
  } 

  catch (err) {

    res.status(500).json({ success: false, error: err.message });
  }
};
