import express from "express"
import mainController from "../controllers/mainController.js";
import auth from "../middlewares/authMiddleware.js";
import Cart from "../models/cartModel.js";
import Stripe from "stripe";

const router = new express.Router();
router.get("/", mainController.renderHome);
router.get("/menu", mainController.renderMenu);
router.post("/cart/:id", auth, mainController.addCart);
router.get("/cart", auth, mainController.renderCart);
router.patch("/cart/increment/:id", auth, mainController.increaseCart);
router.patch("/cart/decrement/:id", auth, mainController.decreaseCart);
router.get("/checkout/:id", auth, mainController.checkout);
router.get("/cancel", auth, mainController.cancel);
router.get("/success", mainController.success);


// create-checkout-session (stripe routes)
const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY)
router.post("/create-checkout-session", auth, async(req, res) => {
    const {phone, address, cartId} = req.body;
    const cart  = await Cart.findOne({_id : cartId}).populate("products.product");
    const lineItems = cart.products.map((product) => ({
        price_data : {
            currency : "inr",
            product_data : {
                name : product.product.name,
            },
            unit_amount : (product.price * 100)/product.quantity
        },
        quantity : product.quantity
    }))
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: `${process.env.DOMAIN}/orders/add?cartId=${cartId}&phone=${phone}&address=${address}`,
        cancel_url: `${process.env.DOMAIN}/cancel`,
      });
    
    res.json({id : session.id}); 
})



export default router;