const express = require("express");
const router = express.Router();

const passport = require("../config/passport");
const {register, login, getMe, googleSuccess} = require("../controllers/authController");
const {protect} = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", 
    passport.authenticate("google",{
        failureRedirect: `${process.env.CLIENT_URL}/login?error=failed`, 
        session: false
    }),
    googleSuccess
);
module.exports = router;