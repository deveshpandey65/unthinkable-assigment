const {Router} = require("express");
const { placeOrderFromCart, getAllOrders, getUserOrders, updateOrderStatus } = require("../controllers/orderController");
const auth= require("../middlewares/authMiddleware");
const authorize= require("../middlewares/roleMiddleware");
const router = Router();
router.use(auth);
router.post("/from-cart", placeOrderFromCart);
router.get("/my-order", getUserOrders);
router.get("/", authorize('admin'), getAllOrders);
router.put("/:orderId/status", authorize('admin'), updateOrderStatus);

module.exports= router;
