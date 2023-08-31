import jwt from "jsonwebtoken"
import { config } from "dotenv";
import User from "../models/userModel.js";
config();

const auth = async(req, res, next) => {
    const {token} = req.cookies; 
    if (token){
        try{
            const payload = jwt.verify(token, process.env.SECRET_KEY);
            try{
                const user = await User.findOne({_id : payload.userId}).select("-password");
                req.user = user;
                next();
            }catch(err){
                res.redirect("/auth/login")
            }
        }catch(err){
            // res.render("message", {
            //     title : "Login",
            //     message : "You need to Login first",
            //     link : "/auth/login",
            //     linkTitle : "Login"
            // })
            res.redirect("/auth/login")
        }
    }else{
        // res.render("message", {
        //     title : "Login",
        //     message : "You need to Login first",
        //     link : "/auth/login",
        //     linkTitle : "Login"
        // })
        res.redirect("/auth/login")
    }
}

export default auth;