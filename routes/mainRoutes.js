import express from "express"
import mainController from "../controllers/mainController.js";
import auth from "../middlewares/authMiddleware.js";
import Cart from "../models/cartModel.js";


const router = new express.Router();
router.get("/", mainController.renderHome);
router.get("/menu", mainController.renderMenu);
router.post("/cart/:id", auth, mainController.addCart);
router.get("/cart", auth, mainController.renderCart);
router.patch("/cart/increment/:id", auth, mainController.increaseCart);
router.patch("/cart/decrement/:id", auth, mainController.decreaseCart);
router.get("/checkout/:id", auth, mainController.checkout);
router.get("/cancel", auth, mainController.cancel);

// create-checkout-session (stripe routes)

router.post("/create-checkout-session", auth, mainController.createCheckoutSession);


export default router;