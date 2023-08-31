import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const authController = {
    renderRegister : async(req, res) => {
        res.render("register")
    },

    register : async(req, res) => {
        const {name, email, password} = req.body;
        if (name && email && password){
            const user = await User.findOne({email : email});
            if (user){
                res.render("message", {
                    title : "Already Exists",
                    message : "An account with this email already exists",
                    link : "/auth/register",
                    linkTitle : "Go Back"
                })
            }else{
                const user = new User({
                    name : name,
                    email : email,
                    password : await bcrypt.hash(password, 10)
                })
                await user.save();
                res.redirect("/auth/login")
            }
        }else{
            res.render("message", {
                title : "Required",
                message : "All fields are required",
                link : "/auth/register",
                linkTitle : "Go Back"
            })
        }
    },

    renderLogin : async(req, res) => {
        res.render("login")
    },

    login : async(req, res) => {
        const {email, password} = req.body;
        if (email && password){
            const user = await User.findOne({email : email});
            if (user){
                const isPassSame = await bcrypt.compare(password, user.password);
                if (isPassSame){
                    // setting the jwt token into cookie
                    const token = jwt.sign({userId : user.id}, process.env.SECRET_KEY, {expiresIn : "24h"});
                    res.cookie("token", token, {maxAge : 86400000, httpOnly : true})
                    res.redirect("/menu")
                }else{
                    res.render("message", {
                        title : "Invalid",
                        message : "No user found with this email/password",
                        link : "/auth/login",
                        linkTitle : "Go Back"
                    })
                }
            }else{
                res.render("message", {
                    title : "Invalid",
                    message : "No user found with this email/password",
                    link : "/auth/login",
                    linkTitle : "Go Back"
                })
            }
        }else{
            res.render("message", {
                title : "Required",
                message : "All fields are required",
                link : "/auth/login",
                linkTitle : "Go Back"
            })
        }
    },
    
    logout : async(req, res) => {
        res.clearCookie("token");
        res.redirect("/menu")
    }
}

export default authController;