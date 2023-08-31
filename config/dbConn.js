import mongoose from "mongoose";
import {config} from "dotenv";
config();

const connectDB = async() => {
    try{
        await mongoose.connect(process.env.DATABASE_URL);
        console.log("successfully connected to database")
    }catch(err){
        console.log("not connected to database")
    }
}

connectDB();