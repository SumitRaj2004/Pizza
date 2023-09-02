import express from "express"
import auth from "../middlewares/authMiddleware.js"
import orderController from "../controllers/orderController.js";

const router = new express.Router();

router.get("/orders", auth, orderController.renderOrders);
router.get("/orders/:id", auth, orderController.renderOrder);

export default router;