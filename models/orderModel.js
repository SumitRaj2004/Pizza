import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    order : [
        {
            product : {type : mongoose.Schema.Types.ObjectId, ref : "Menu"},
            quantity : {type : Number, required : true},
            price : {type : Number, required : true}
        }
    ],
    phone : {
        type : String,
        required : true
    },
    address : {
        type : String,
        required : true
    },
    paymentType : {
        type : String,
        default : "Online"
    },
    status : {
        type : String,
        default : "placed"
    }
}, {
    timestamps : true
})

const Order = mongoose.model("Order", orderSchema);

export default Order;