import express from "express";
import hbs from "hbs"
import { config } from "dotenv";
config();
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import moment from "moment/moment.js";
import "./config/dbConn.js"
import Stripe from "stripe";
import cors from "cors"
import mainRouter from "./routes/mainRoutes.js"
import authRouter from "./routes/authRoutes.js"
import orderRouter from "./routes/orderRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import cookieParser from "cookie-parser";
import methodOverride from "method-override";


const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));
const publicPath = path.join(__dirname, "./public")
const viewsPath = path.join(__dirname, "./templates/views")
const partialsPath = path.join(__dirname, "./templates/partials")
app.use(cors())
app.options("*", cors())
app.use(express.json());
app.use(express.static(publicPath));
app.use(express.urlencoded({extended : false}));
app.use(methodOverride("_method"));
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);
app.use(cookieParser())

const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY)
app.post("/webhook-checkout", async(req, res) => {
    console.log("something should work..")
    const signature = req.headers["stripe-signature"];
    let event;
    try{
        event = stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET);
        console.log(event)
    }catch(err){
        return "something"
    }
})

app.use("/", mainRouter)
app.use("/auth", authRouter)
app.use("/", orderRouter);
app.use("/admin", adminRouter)
app.use((req, res, next) => {
    res.render("message", {
        title : "Not found",
        message : "404 Page Not Found",
        linkTitle : "Go to Home",
        link : "/"
    })
})

app.listen(process.env.PORT, () => {
    console.log(`server started listening to ${process.env.PORT}`)
})