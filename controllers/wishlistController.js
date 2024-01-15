
const Wishlist = require("../models/wishlistModel");
const Cart = require("../models/cartModel");
const User=require("../models/user")
const Product=require("../models/productModel")
// load wishlist page

const loadWishlist = async(req,res)=>{
    try {

    const userId = req.session.user_id;
    const userData = await User.findById(userId);

    const userWishlist = await Wishlist.findOne({user:userId}).populate("items.product")

    const userWishlistItems = userWishlist?userWishlist.items:[]

    const wishList = await Wishlist.find({user:userId})
    const cartCount = await Cart.find({user:userId})
    const product=await Product.find({user:userId})
    
    

    res.render("user/wishList",{userData,Wishlist:userWishlistItems,wishList,cartCount,product})
    
        
    } catch (error) {
        console.log(error.message);
    }
}

// add to wishlist

const addToWishList = async(req,res)=>{
    try {

        const userId = req.session.user_id
        const productId = req.body.productId

        let userWishlist = await Wishlist.findOne({user:userId})

        if(!userWishlist){
            userWishlist = new Wishlist({
                user:userId,
                items:[
                    {product:productId}
                ]
            })
            await userWishlist.save()
        }else{
            const existingWishlistitem = userWishlist.items.find((item)=>item.product.toString()===productId)

            if(existingWishlistitem){
                return res.status(400).json({success:false,error:"the product is alredy wishlist"})
            }else{
                userWishlist.items.push({product:productId})
                await userWishlist.save()

            }

           
        }
        res.status(200).json({success:true,message:"product is added to wishlist"})
        // res.redirect("/loadWishList")

        
       
        
    } catch (error) {
        console.log("error to add to wishlist",error);
    }
}

// remove wishlist

const removeWishlist = async(req,res)=>{
    try {
        const userId = req.session.user_id
        const productId = req.query.productId

        const existingWishlist = await Wishlist.findOne({user:userId})

        if(existingWishlist){
            const updatedItems = existingWishlist.items.filter(
                (item)=> item.product.toString()!==productId
            )
            existingWishlist.items = updatedItems
            await existingWishlist.save()
            res.json({ success: true, toaster: true });

        }else{
            res.json({ success: false, error: "wishlist not found" });
        }


        
    } catch (error) {
        console.log("error romoving wishlist",error);
        res.json({success:false, error:"internal server error"})
    }
}



module.exports = {
    loadWishlist,
    addToWishList,
    removeWishlist
}