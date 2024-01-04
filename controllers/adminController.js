
const User=require("../models/user")
const bcrypt=require("bcrypt");
const Order=require("../models/orderModel");
const Product=require("../models/productModel");
const Category=require("../models/categoryModel");
const {
  getMonthlyDataArray,
  getDailyDataArray,
  getYearlyDataArray,
} = require("../config/chartData");


//adminlogin

const getLogin = async (req, res) => {
  try {
    res.render("admin/adminLogin");
  } catch (err) {
    console.error(err);

  }
};

//admin validation

const postLogin= async(req,res)=>{
  try {
      const email=req.body.email
      const password=req.body.password

      const userData = await User.findOne({email:email})
  

      if(userData){

          const passwordMatch = await bcrypt.compare(password,userData.password)
   
          if(passwordMatch && userData.isAdmin==1 ){
  
              req.session.admin_id = userData._id;
              res.redirect('/admin/adminHome')

          }
          else{
              res.render('admin/adminLogin',{message:"Invalid User"})
          }


      }
      else{
          res.render('admin/adminLogin',{message:"Invalid User"})
      }
  } catch (error) {
      console.log(error.message)
  }
};

//admin homepage
const getHome=async (req, res) => {
  try {
    let query = {};
    const adminData = await User.findById(req.session.admin_id);
   
    const totalRevenue = await Order.aggregate([
      { $match: {    "items.status": "Delivered"  } }, // Include the conditions directly
      { $group: { _id: null, totalAmount: { $sum: "$totalAmount" } } },
    ]);

    const totalUsers = await User.countDocuments({ is_blocked: 1});
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalCategories = await Category.countDocuments();
    const orders = await Order.find().populate("user").limit(10).sort({ orderDate: -1 });

    const monthlyEarnings = await Order.aggregate([
      {
        $match: {
          "items.status": "Delivered" ,
          orderDate: {
            $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      },
      { $group: { _id: null, monthlyAmount: { $sum: "$totalAmount" } } },
    ]);
    const totalRevenueValue =
    totalRevenue.length > 0 ? totalRevenue[0].totalAmount : 0;
  const monthlyEarningsValue =
    monthlyEarnings.length > 0 ? monthlyEarnings[0].monthlyAmount : 0;

    const newUsers = await User.find({ is_blocked: 1,isAdmin:0  })
      .sort({ date: -1 })
      .limit(5);

      // Get monthly data
      const monthlyDataArray = await getMonthlyDataArray();

      // Get daily data
      const dailyDataArray = await getDailyDataArray();
    
      // Get yearly data
      const yearlyDataArray = await getYearlyDataArray();

    const monthlyOrderCounts= monthlyDataArray.map((item) => item.count)
  
    const dailyOrderCounts= dailyDataArray.map((item) => item.count)

    const yearlyOrderCounts= yearlyDataArray.map((item) => item.count)

    res.render("admin/adminHome", {
      admin: adminData,
      totalRevenue:totalRevenueValue,
      totalOrders,
      totalCategories,
      totalProducts,
      totalUsers,
      newUsers,
      orders,
      monthlyEarningsValue,
      monthlyOrderCounts,
      dailyOrderCounts,
      yearlyOrderCounts,
    });
  } catch (error) {
    console.log(error.message);
    // Handle errors appropriately
  }
};
//user page
const loadUserpage=async (req,res)=>{
  try{
    const adminData=await User.findById(req.session.admin_id);
    const userData=await User.find({
      isAdmin:0
    });
    res.render('admin/userDashboard',{users:userData,admin:adminData});

  }catch(error){
    console.error(error.message);
    res.status(500).send("Internal Server Error: " + error.message);
  }
};

//list user

const listUser = async (req, res) => {


  try {
    const id = req.query.id;
    const Uservalue = await User.findById(id);
    
    if (Uservalue.is_blocked) {
      const UserData = await User.updateOne(
        {_id:id},
        {
          $set: {
            is_blocked: 0
          },
        }
      );
      if (req.session.user_id) delete req.session.user_id;
    }else{
    
      const UserData = await User.updateOne(
        {_id:id},
        {
          $set: {
            is_blocked: 1
          },
        }
      );
    }
    
    res.redirect("/admin/userData");
  } catch (error) {
    console.log(error.message);
  }


};
const adminLogout = async (req, res) => {
  try {
    req.session.destroy();

    res.redirect("/admin");
  } catch (error) {
    console.log(error.message);
  }
};






module.exports = {
  getHome,
  getLogin,
  postLogin,
  loadUserpage,
  listUser,
  adminLogout,
};
