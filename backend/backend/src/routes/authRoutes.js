const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const upload = require('../middlewares/upload');
const auth= require('../middlewares/authMiddleware')
// Routes
router.post('/signup', upload.single('companyLogo'), authController.signup);
router.post('/login', authController.login);
router.post('/signout', authController.signOut);
router.get("/verify", auth, (req, res) => {
    if (req.user) {
        return res.status(200).json({
            success: true,
            message: "Token is valid",
            user: req.user, // optional: send user info
        });
    } else {
        return res.status(401).json({
            success: false,
            message: "Invalid token",
        });
    }
});

module.exports = router;
