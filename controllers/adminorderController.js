const Order = require("../models/orderModel");

const Address = require("../models/addressModel");
const User = require("../models/user");
const Cart = require("../models/cartModel");

const Product = require("../models/productModel");



const listUserOrders = async (req, res) => {
  try {
    const admin = req.session.adminData;

  

    const orders = await Order.find()
      .populate("user")
      .populate({
        path: "address",
        model: "Address",
      })
      .populate({
        path: "items.product",
        model: "Product",
      })

    res.render("admin/allOrder", { order:orders });
  } catch (error) {
    console.log(error.message);
  }
};
const listOrderDetails=async(req,res)=>{

      try {
   
        const orderId = req.query.id;
  
        const order = await Order.findById(orderId)
        .populate("user")
        .populate({
          path: "address",
          model: "Address",
        })
        .populate({
          path: "items.product",
          model: "Product",
        })
   console.log(order,"order");
   let orderData=order
    res.render("admin/orderDetails", { order:orderData });
      } catch (error) {
        console.log(error.message);
      }
    

}
const orderStatusChange = async (req, res) => {
  try {

    const orderId = req.query.id;
    const {status,productId}=req.body
   



 
console.log(req.body,"req.body");
    const order = await Order.findOne({ _id: orderId })
      .populate("user")
      .populate({
        path: "address",
        model: "Address",
      })
      .populate({
        path: "items.product",
        model: "Product",
      });

console.log(order,"orderorder");



const product = order.items.find(
  (item) => item.product._id.toString() === productId
);

if (product) product.status = status;
if (product.status=='Delivered') product.paymentStatus = 'success';
 


const updateData = await Order.findByIdAndUpdate(
  orderId,
  {
    $set: {
      items: order.items,
      
    },
  },
  { new: true }
);
  


    return res.status(200).json({success: true, message: "Order status change successfully" });
 

  } catch (error) {
    return res
    .status(500)
    .json({ error: "An error occurred while change status the order" });

  }
}; 

  
  module.exports={
    listUserOrders,
    listOrderDetails,
    orderStatusChange,
  }