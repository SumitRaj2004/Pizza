import mongoose from "mongoose";

const menuSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    image : {
        type : String,
        required : true
    },
    price : {
        type : String,
        required : true
    },
})

const Menu = mongoose.model("Menu", menuSchema);

export default Menu;