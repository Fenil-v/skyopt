import User from "../models/user.js";

export const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user || user.userRole !== "admin") {
      return res.status(403).json({
        status: 403,
        message: "Access denied. Admin privileges required.",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Error checking admin status",
      error: error.message,
    });
  }
};
