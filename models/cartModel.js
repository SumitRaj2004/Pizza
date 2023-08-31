import mongoose from "mongoose"

const cartSchema = new mongoose.Schema({
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    products : [
        {
            product : {type : mongoose.Schema.Types.ObjectId, ref : "Menu"},
            quantity : {type : Number, required : true},
            price : {type : Number, required : true}
        }
    ]
})

const Cart  = mongoose.model("Cart", cartSchema);

export default Cart;