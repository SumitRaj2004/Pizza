import moment from "moment";
import Cart from "../models/cartModel.js"
import Order from "../models/orderModel.js"
import User from "../models/userModel.js"

const orderController = {
    createOrder : async(session) => {
        const {customer_email, client_reference_id, metadata} = session;
        const {phone, address} = metadata;
        console.log(customer_email, client_reference_id, phone, address)
        // const user = await User.findOne({email : customer_email});
        // const cart = await Cart.findOne({_id : client_reference_id});
        // const order = new Order({
        //     owner : user.id,
        //     order : cart.products,
        //     phone : metadata.phone,
        //     address : metadata.address
        // })   
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