import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

import {
  registerUser,
  loginUser,
  logoutUser,
  sendMailForChangePasswordWhenUserAuthenticated,
  changePassword,
  currentUser,
  updateAccountDetails,
  updateAvatar,
} from "../controllers/user.controller.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

// secure routes
router.route("/logout").post(verifyJWT, logoutUser);
router
  .route("/change-password-email")
  .get(verifyJWT, sendMailForChangePasswordWhenUserAuthenticated);
router.route("/change-password").post(verifyJWT, changePassword);

router.route("/current-user").get(verifyJWT, currentUser);
router.route("/update-user").patch(verifyJWT, updateAccountDetails);
router.route("/update-avatar").patch(verifyJWT, updateAvatar);

export default router;
