import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies?.jwt; // lowercase cookie name

    if (!token) {
      return res.status(403).json({ message: "Token is Invalid" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      console.log("Decoded JWT:", decoded);
    } catch (error) {
      console.error("Invalid token", error.message);
      return res.status(403).json({ message: "Token is Invalid" });
    }

    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
