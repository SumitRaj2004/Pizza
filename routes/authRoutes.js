import express from "express"
import authController from "../controllers/authContoller.js";
import auth from "../middlewares/authMiddleware.js";

const router = new express.Router();

router.get("/register", authController.renderRegister)
router.post("/register", authController.register)
router.get("/login", authController.renderLogin)
router.post("/login", authController.login)
router.get("/logout", auth, authController.logout)


export default router;