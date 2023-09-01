import moment from "moment";
import Cart from "../models/cartModel.js"
import Order from "../models/orderModel.js"

const orderController = {
    createOrder : async(session) => {
        console.log(session)
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