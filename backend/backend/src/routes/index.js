const express = require("express");
const router = express.Router();

const authRoutes = require("./authRoutes");

router.use("/auth", authRoutes);
// router.use("/search", require("./searchRoutes"));
router.use("/suggest", require("./suggestRoutes"));
router.use("/cart", require("./listRoutes"));
router.use("/product", require("./productRoutes"));
router.use("/order", require("./orderRoutes"));
router.use("/voice", require("./voiceRoutes"));
router.use("/find", require("./searchRoutes"));
router.use("/category", require("./categoryRoutes"));

// Test route to verify routing
router.get("/test", (req, res) => {
    res.json({ msg: "Auth route working!" });
});

module.exports = router;
