import moment from "moment";
import Cart from "../models/cartModel.js"
import Order from "../models/orderModel.js"

const orderController = {
    orders : async(req, res) => {
        const {cartId, phone, address} = req.query;
        try{
            const cart = await Cart.findOne({owner : req.user.id, _id : cartId});
            const order = new Order({
                owner : req.user.id,
                order : cart.products,
                phone : phone,
                address : address,
            })
            await order.save();
            // after placing an order we need to clear the cart items
            await Cart.findByIdAndDelete(cartId);
            res.redirect("/orders")
        }catch(err){
            console.log(err.message)
            res.render("message", {
                title : "Error",
                message : "Page not found",
                link : "/cart",
                linkTitle : "Go to Cart"
            })
        }
    },

    renderOrders : async(req, res) => {
            const orders = await Order.find({owner : req.user.id}).sort({createdAt : -1});
            res.render("orders", {
                orders : orders
            })
    },
    renderOrder : async(req, res) => {
        const {id} = req.params;
        try{
            const order = await Order.findOne({owner : req.user.id, _id : id}).populate({
                path : "order",
                populate : {
                    path : "product"
                }
            });
            let totalAmount=0;
            order.order.forEach((product) => {
                totalAmount += product.price;
            })
            const orderTime = moment(order.createdAt).format("llll");
            res.render("order", {
                order : order,
                totalAmount: totalAmount,
                orderTime : orderTime
            });
        }catch(err){
            res.render("message", {
                title : "Error",
                message : "Page not found",
                link : "/orders",
                linkTitle : "Go to Orders"
            })
        }
    }
}

export default orderController;