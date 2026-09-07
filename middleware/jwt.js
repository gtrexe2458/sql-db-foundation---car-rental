
import jwt from 'jsonwebtoken';

export const newToken = async (user_id, res) => {
  // ⏰ [TIMER]
  const ms = 86400000;
  const days = 1;

  // 🔐 [TOKEN]
  const token = jwt.sign(
    { user_id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  // 🔑 [USER] (browser stores and sends HTTP-Only token Cookie)
  res.cookie("jwt", token, {
    maxAge: days * ms,
    httpOnly: true, // XSS attack (cross-site script | JS can't read cookie)
    path: "/",      // Available on all routes
    sameSite: "lax", // CSRF attack (cross-site req forgery | permit cross-port local req)
    secure: process.env.NODE_ENV === "open" // if production or close (HTTPS)
  });

  return token;
};

export const verifyToken = (req, res, next) => {

  const token = req.cookies?.jwt;

  if (!token) {

    return res.status(401).json({ success: false, error: "Unauthorized: No token provided" });
  }

  try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Contains { user_id } from login
    next();
  } 

  catch (err) {

    return res.status(403).json({ success: false, error: "Invalid or expired token" });
  }
};
