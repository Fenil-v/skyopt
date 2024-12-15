import express from "express";
import {
  registerUser,
  loginUser,
  userMetaData,
  logoutUser,
  editUser,
} from "../controllers/userController.js";
import { verify } from "../middleware/jwt_auth.js";

const router = express.Router();

router.route("/sign-up").post(registerUser);
router.route("/login").post(loginUser);
router.route("/user-meta-data").get(verify, userMetaData);
router.route("/logout").get(verify, logoutUser);
router.route("/user-meta-data").get(verify, userMetaData);
router.route("/edit-user").put(verify, editUser);

export default router;
