import jwt from "jsonwebtoken";
import PersonalAccessToken from "../models/personalAcessToken.js";
import dotenv from "dotenv";
dotenv.config();
const tokenSecret = process.env.TOKEN_KEY;

export const verify = async (req, res, next) => {
  try {
    let token;
    const authHeader = req.headers.authorization;

    // Extract token from Authorization header
    if (authHeader && authHeader.startsWith("Bearer")) {
      token = authHeader.split(" ")[1];
    }

    if (!token) {
      return res.status(400).json({
        status: 400,
        message: "Authorization header missing or invalid",
      });
    }

    // Verify the token
    const decodedToken = jwt.verify(token, tokenSecret);
    req.user = decodedToken; // Attach user info from the token payload to the request object
    next();
  } catch (error) {
    return res.status(500).json({
      status: 500,
      error: "Failed to authenticate token",
      message: error.message,
    });
  }
};

export const updateAccessTokenTable = async (req, res, next) => {
  try {
    const user = req.user; // Extract user info from the request object
    if (user) {
      // Update token information in the database
      await PersonalAccessToken.findOneAndUpdate(
        { tokenable_id: user.userId },
        {
          $set: {
            last_used_at: new Date(),
            updated_at: new Date(),
          },
        }
      );
    } else {
      throw new Error("User not found");
    }
    next();
  } catch (error) {
    res.status(500).json({
      status: 500,
      error: "Failed to update access token",
      message: error.message,
    });
  }
};
