const router = require("express").Router();
const {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  updateUserDetails,
  updatePassword,
  logout
} = require("../controllers/auth");

//Middleware and Model
const { protect } = require("../middlewares/auth");

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/getme").get(protect, getMe);
router.route("/logout").get(protect, logout);
router.route("/forgotpassword").post(forgotPassword);
router.route("/resetpassword/:resettoken").put(resetPassword);
router.route("/updateuserdetails").put(protect, updateUserDetails);
router.route("/updatepassword").put(protect, updatePassword);

module.exports = router;
