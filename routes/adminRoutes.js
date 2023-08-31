import express from "express"
import adminController from "../controllers/adminController.js"
import admin from "../middlewares/adminMiddleware.js"

const router = new express.Router();

router.get("/login", adminController.renderAdminLogin);
router.post("/login", adminController.adminLogin);
router.get("/orders", admin, adminController.renderAdminOrders);
router.get("/orders/:id", admin, adminController.renderAdminOrder);
router.patch("/orders/:id", admin, adminController.adminOrderUpdate);

export default router;