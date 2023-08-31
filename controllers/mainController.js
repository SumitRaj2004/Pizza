import Menu from "../models/menuModel.js";
import Cart from "../models/cartModel.js";

const mainController = {
    renderHome : async(req, res) => {
        res.render("home");
    },
    renderMenu : async(req, res) => {
        try{
            const menu = await Menu.find({});
            res.render("menu", {
                menu : menu
            });
        }catch(err){
            res.render("message", {
                title : "Not Found",
                message : "Page not Found",
                link : "/home",
                linkTitle : "Home"
            })
        }
    },
    addCart : async(req, res) => {
        const {id} = req.params;
        try{
            const menu = await Menu.findOne({_id : id});
            const cart = await Cart.find({owner: req.user.id});
            if (cart.length === 0){
                const cart = new Cart({
                    owner : req.user.id,
                    products : [
                        {
                            product : menu.id,
                            quantity : 1,
                            price : menu.price
                        }
                    ]
                });
                await cart.save()
            }else{
                const cart = await Cart.findOne({owner : req.user.id});
                const filteredProducts = cart.products.filter((product) => product.product.toString() === menu.id);
                if (filteredProducts.length !== 0){
                    // that menu already exist, just need to update the price and quantity
                    await Cart.updateOne({owner : req.user.id, 'products.product' : filteredProducts[0].product}, {
                        $set : {
                            'products.$.quantity' : filteredProducts[0].quantity + 1,
                            'products.$.price' : (filteredProducts[0].price/filteredProducts[0].quantity)*(filteredProducts[0].quantity + 1)
                        }
                    });
                }else{
                    cart.products.push({
                        product : menu.id,
                        quantity : 1,
                        price : menu.price
                    })
                    cart.save();
                }
            }
            res.redirect("/cart")
        }catch(err){
            console.log(err)
            res.render("message", {
                title : "Not Found",
                message : "Page not Found",
                link : "/menu",
                linkTitle : "Menu"
            })
        }
    },
    renderCart : async(req, res) => {
        const cart = await Cart.findOne({owner : req.user.id}).populate({
            path : "products",
            populate : {
                path : "product"
            }
        })
        if (cart){
            if (cart.products.length === 0){
                res.render("emptyCart")
            }else{
                let totalPrice = 0;
                cart.products.forEach((product) => {
                    totalPrice += product.price;
                })
                res.render("cart", {
                    cart : cart.products,
                    totalPrice : totalPrice,
                    id : cart.id
                })
            }
        }else{
            res.render("emptyCart")
        }
    },
 
    increaseCart : async(req, res) => {
        // so this is now working
        const {id} = req.params;
        try{
            const cart = await Cart.findOne({owner : req.user.id, "products.product" : id});
            const cartItem = cart.products.find((product) => product.product.toString() === id);
            await Cart.updateOne({owner : req.user.id, "products.product" : id}, {
                $set : {
                    "products.$.quantity" : cartItem.quantity + 1,
                    "products.$.price" : (cartItem.price/cartItem.quantity) * (cartItem.quantity+1)
                }
            })
            res.redirect("/cart")
        }catch(err){
            res.render("message", {
                title : "Not Found",
                message : "Page not Found",
                link : "/menu",
                linkTitle : "Menu"
            })
        }
    },
    decreaseCart : async(req , res) => {
        const {id} = req.params;
        try{
            const cart = await Cart.findOne({owner : req.user.id, "products.product" : id});
            // cart is an whole document
            const cartItem = cart.products.find((product) => product.product.toString() === id);
            if (cartItem.quantity === 1){
                await Cart.updateOne({owner : req.user.id}, {
                    $pull : {products : {product : id}}
                })
            }else{
                await Cart.updateOne({owner : req.user.id, "products.product" : id}, {
                    $set : {
                        "products.$.quantity" : cartItem.quantity - 1,
                        "products.$.price" : (cartItem.price/cartItem.quantity) * (cartItem.quantity - 1)
                    }
                })
            }
        res.redirect("/cart")
        }catch(err){
            res.render("message", {
                title : "Not Found",
                message : "Page not Found",
                link : "/menu",
                linkTitle : "Menu"
            })
        }
    },
    
    checkout : async(req, res) => {
        const {id} = req.params;
        try{
            const cart  = await Cart.findOne({owner : req.user.id, _id : id});
            res.render("checkout", {cart});
        }catch(err){
            res.render("message", {
                title : "Not Found",
                message : "Page not Found",
                link : "/home",
                linkTitle : "Home"
            })
        }
    },
    cancel : async(req, res) => {
        res.render("message", {
            title : "Failed",
            message : "Payment Failed",
            link : "/cart",
            linkTitle : "Go to cart"
        })
    },
    success : async(req, res) => {
        res.send("payment successfull")
    }
}

export default mainController;