import moment from "moment";
import Order from "../models/orderModel.js"
import jwt from "jsonwebtoken"

const adminController = {
    renderAdminLogin : async(req, res) => {
        res.render("adminLogin")
    },
    adminLogin : async(req, res) => {
        const {email, password} = req.body;
        if (email && password){
            if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASS){
                const token = jwt.sign({userEmail : email}, process.env.ADMIN_SECRET_KEY, {expiresIn : "24h"});
                res.cookie("token", token, {maxAge : 86400000, httpOnly : true})
                res.redirect("/admin/orders");
            }else{
                res.render("message", {
                    title : "Invalid",
                    message : "No user found with this email/password",
                    link : "/admin/login",
                    linkTitle : "Go Back"
                })
            }
        }else{
            res.render("message", {
                title : "Required",
                message : "All fields are required",
                link : "/admin/login",
                linkTitle : "Go Back"
            })
        }
    },
    renderAdminOrders : async(req, res) => {
        try{
            const orders = await Order.find({}).sort({createdAt : -1});
            res.render("adminOrders", {
                orders : orders
            })
        }catch(err){
            res.render("message", {
                title : "Error",
                message : "Page not found",
                link : "/admin/orders",
                linkTitle : "Go to Admin Orders"
            })
        }
    },
    renderAdminOrder : async(req, res) => {
        const {id} = req.params;
        try{
            const order = await Order.findOne({_id : id}).populate({
                path : "owner"
            }).populate({
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
            res.render("adminOrder", {
                order : order,
                totalAmount : totalAmount,
                orderTime : orderTime
            })
        }catch(err){
            res.render("message", {
                title : "Error",
                message : "Page not found",
                link : "/admin/orders",
                linkTitle : "Go to Admin Orders"
            })
        }
    },
    adminOrderUpdate : async(req, res) => {
        const {id} = req.params;
        const {status} = req.body;
        try{
            await Order.findByIdAndUpdate({_id : id}, {
                status : status
            });
            res.redirect("/admin/orders")
        }catch(err){
            res.render("message", {
                title : "Error",
                message : "Page not found",
                link : "/admin/orders",
                linkTitle : "Go to Admin Orders"
            })
        }
    }
}

export default adminController;