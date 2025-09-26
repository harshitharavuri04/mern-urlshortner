import { User } from "../models/user/user.model.js";
import { ShortURL } from "../models/shorturl.model.js";
export const getProfileOfUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const dbUser = await User.findById(userId).select("-password"); // exclude password
    if (!dbUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      id: dbUser._id,
      name: dbUser.name,
      email: dbUser.email,
      role: dbUser.role,
      avatar: dbUser.avatar || "https://via.placeholder.com/150", // fallback avatar
      createdAt: dbUser.createdAt,
    });
  } catch (error) {
    console.error("Error in fetching user profile", error);
    res.status(500).json({
      message: "Error in getting user profile",
      error: error.message,
    });
  }
};
export const getMyUrls = async (req, res) => {
  try {
    if (!req.user) return res.status(403).json({ message: "Unauthorized" });

    const userId = req.user.id || req.user._id;

    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const skip = (page - 1) * limit;

    const [totalItems, shortURLs] = await Promise.all([
      ShortURL.countDocuments({ userId }),
      ShortURL.find({ userId }).skip(skip).limit(limit).sort({ createdAt: -1 }),
    ]);

    return res.status(200).json({
      page,
      limit,
      totalPages: Math.ceil(totalItems / limit),
      totalItems,
      shortURLs,
    });
  } catch (error) {
    console.error("Error in fetching user urls", error.message);
    res.status(500).json({
      message: "Error in getting user urls",
      error: error.message,
    });
  }
};