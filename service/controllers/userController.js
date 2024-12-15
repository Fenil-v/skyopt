import User from "../models/user.js";
import bcrypt from "bcrypt";
const saltRounds = 10;
import JWT from "jsonwebtoken";
import sha256 from "sha256";
import PersonalAccessToken from "../models/personalAcessToken.js";
import Booking from "../models/booking.js";

// Controller function for user registration
export const registerUser = async (req, res) => {
  try {
    const {
      username,
      email,
      phone,
      firstName,
      lastName,
      password,
      gender,
      dateOfBirth,
    } = req.body;

    // Check for missing fields
    const missingFields = [];
    if (!username) missingFields.push("username");
    if (!email) missingFields.push("email");
    if (!phone) missingFields.push("phoneNumber");
    if (!firstName) missingFields.push("firstName");
    if (!lastName) missingFields.push("lastName");
    if (!password) missingFields.push("password");
    if (!gender) missingFields.push("gender");
    if (!dateOfBirth) missingFields.push("dateOfBirth");

    // Validate dateOfBirth for age
    const today = new Date();
    const dob = new Date(dateOfBirth);
    const age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    const isAdult =
      age > 18 ||
      (age === 18 && monthDiff > 0) ||
      (age === 18 && monthDiff === 0 && today.getDate() >= dob.getDate());

    if (!isAdult) {
      return res.status(400).json({
        status: 400,
        message: "User must be at least 18 years old",
      });
    }

    if (missingFields.length > 0) {
      return res.status(400).json({
        status: 400,
        message: `${missingFields.join(", ")} ${
          missingFields.length > 1 ? "are" : "is"
        } missing`,
      });
    }

    // Check if a user with the same email or phone already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { phone }],
    });
	
    if (existingUser) {
      return res.status(409).json({
        status: 409,
        message: "A user with this email or phone already exists",
      });
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create a new user
    const newUser = new User({
      firstName,
      lastName,
      phone,
      username,
      email,
      passwordHash, // Store the hashed password
      gender,
      dateOfBirth,
    });

    // Save the user to the database
    await newUser.save();
    return res.status(201).json({
      status: 201,
      message: "User registered successfully",
      data: newUser,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      // Handle Mongoose validation errors
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message
      );
      return res.status(400).json({
        status: 400,
        message: validationErrors, // Array of specific validation error messages
        errors: "Validation failed",
      });
    }
    res.status(500).json({
      status: 500,
      message: "Error registering user",
      error: error.message,
    });
  }
};

// Controller function for User Login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for missing fields
    if (!email || !password) {
      return res.status(400).json({
        status: 400,
        message: "Email and password are required",
      });
    }

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        status: 404,
        message: "Invalid email or password",
      });
    }

    // Verify the password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: 401,
        message: "Invalid email or password",
      });
    }

    // Create a JWT token
    const tokenPayload = { id: user._id };
    const accessToken = JWT.sign(tokenPayload, process.env.TOKEN_KEY);
    const hashedToken = sha256(accessToken, "accesstoken");

    // Save the token in the PersonalAccessToken collection
    const newAccessToken = new PersonalAccessToken({
      tokenable_type: "auth_token",
      tokenable_id: user._id,
      token: hashedToken,
    });

    await newAccessToken.save();

    // Respond with success and token
    res.status(200).json({
      status: 200,
      message: "Login successful",
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
        token: accessToken,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      message: "Error logging in",
      error: error.message,
    });
  }
};

//logged user metadata
export const userMetaData = async (req, res) => {
  try {
    const userId = req?.user?.id;
    if (!userId) {
      return res.status(401).json({
        status: 401,
        message: "Unauthorized: User ID not found in request",
      });
    }

    // Fetch user details
    const loggedUser = await User.findById(userId);

    if (!loggedUser) {
      return res.status(404).json({
        status: 404,
        message: "User not found",
      });
    }

    // Check booking count for the user
    const bookingCount = await Booking.countDocuments({ userId });
    const isFirstTimeCustomer = bookingCount === 0;

    res.status(200).send({
      status: 200,
      message: "Record found successfully",
      data: {
        id: loggedUser._id,
        username: loggedUser.username,
        email: loggedUser.email,
        phone: loggedUser.phone,
        firstName: loggedUser.firstName,
        lastName: loggedUser.lastName,
        gender: loggedUser.gender,
        dateOfBirth: loggedUser.dateOfBirth,
        isFirstTimeCustomer,
        preferences: loggedUser.preferences,
        userRole: loggedUser.userRole,
        createdAt: loggedUser.createdAt,
        updatedAt: loggedUser.updatedAt,
      },
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Controller function for User Edit
export const editUser = async (req, res) => {
  try {
    const userId = req?.user?.id;
    if (!userId) {
      return res.status(401).json({
        status: 401,
        message: "Unauthorized: User ID not found in request",
      });
    }

    const { username, email, phone, firstName, lastName, gender, dateOfBirth } =
      req.body;

    // Check for missing fields
    const missingFields = [];
    if (!username) missingFields.push("username");
    if (!email) missingFields.push("email");
    if (!phone) missingFields.push("phone");
    if (!firstName) missingFields.push("firstName");
    if (!lastName) missingFields.push("lastName");
    if (!gender) missingFields.push("gender");
    if (!dateOfBirth) missingFields.push("dateOfBirth");

    if (missingFields.length > 0) {
      return res.status(400).json({
        status: 400,
        message: `${missingFields.join(", ")} ${
          missingFields.length > 1 ? "are" : "is"
        } missing`,
      });
    }

    // Check if a user with the same email or phone already exists (excluding the current user)
    const existingUser = await User.findOne({
      $or: [{ email }, { phone }],
      _id: { $ne: userId }, // Exclude the current user
    });
    if (existingUser) {
      return res.status(409).json({
        status: 409,
        message: "A user with this email or phone already exists",
      });
    }

    // Update user details
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        username,
        email,
        phone,
        firstName,
        lastName,
        gender,
        dateOfBirth,
      },
      { new: true }
    ); // Return the updated user

    if (!updatedUser) {
      return res.status(404).json({
        status: 404,
        message: "User not found",
      });
    }

    return res.status(200).json({
      status: 200,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Error updating user",
      error: error.message,
    });
  }
};

//controller function for user logout
export const logoutUser = async (req, res) => {
  try {
    //Get user ID from the verify middleware function
    const userId = req.user.id;

    // Validate that the user ID exists
    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    // Find all tokens associated with the user ID in the PersonalAccessToken model
    const userTokens = await PersonalAccessToken.find({
      tokenable_id: userId,
    });

    // return a 404 response if no tokens are found
    if (!userTokens || userTokens.length === 0) {
      return res
        .status(404)
        .json({ message: "No active sessions found for the user." });
    }

    //for all tokens found, update the deleted_at field
    const currentTimeStamp = new Date();
    const updateResult = await PersonalAccessToken.updateMany(
      { tokenable_id: userId },
      { deleted_at: currentTimeStamp }
    );

    // Respond with a success message
    res.status(200).json({
      status: 200,
      message: "User successfully logged out from all sessions.",
    });
  } catch (error) {
    // Handle the errors that could occur
    console.error("Error logging out user:", error);
    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};
