import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const admin = (req, res, next) => {
    const {token} = req.cookies;
    if (token){
        try{
            jwt.verify(token, process.env.ADMIN_SECRET_KEY);
            next()
        }catch(err){
            res.redirect("/admin/login")
        }
    }else{
        res.redirect("/admin/login")
    }
}

export default admin;