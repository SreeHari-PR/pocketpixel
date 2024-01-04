const User = require("../models/user");
const bcrypt = require('bcrypt');
const message = require("../config/mailer");
const Product=require("../models/productModel")
const Category=require("../models/categoryModel");
const Wallet=require("../models/walletModel")



//securing password
const securePassword = async(password)=>{
  try {
       const passwordHash =await bcrypt.hash(password,10)
       
       return passwordHash
  } catch (error) {
      console.log(error.message)
  }

};

//homepage
const getHome =async (req, res) => {
  try {
    const userId = req.session.user_id;
     const userData = await User.findById(userId);
     const productData = await Product.find({is_listed:true});
    const categories = await Category.find();


      res.render('user/home', { products:productData, userData,categories});

  } catch (error) {
    console.log(error.message);
    
  }
  
   
  };

  //login

const getLogin = (req, res) => {

  res.render('user/login',{message:''});

};

//validating login 

const postLogin = async (req, res) => {

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.render("user/login", {
        message: "Please fill in all the fields",
      });
    }

    const userData = await User.findOne({ email: email });

    if (userData) {
      const passwordMatch = await bcrypt.compare(password, userData.password);
      if (passwordMatch && userData.isAdmin === 0 && userData.is_blocked == 1) {
     
        req.session.user_id = userData._id;
        res.redirect("/");
      }else if (userData.is_blocked == 0) {
            res.render("user/login", {
          message: "Your account is blocked",
        })}
      
     else {
        res.render("user/login", {
          message: "email and password is incorrect",
        });
      }
    } else {
      res.render("user/login");
    }
  } catch (error) {
    console.log(error.message);
  }
};


//signup

const getSignup = (req, res) => {
  
  res.render('user/register');

};

//registering

const postSignup = async (req, res) => {

   try {
    const { email,mobile, name, password } = req.body;
    if (!email || !mobile || !name || !password) {
      return res.status(400).json({ error: 'Name, and password are required' });
    }
    const existMail = await User.findOne({ email: email });

    if (existMail) {
      res.render("user/register", { message: "this user already exists" });
    } else {
      req.session.userData = req.body;
      req.session.register = 1;
      req.session.email = email;
      if (req.session.email) {
        const data = await message.sendVarifyMail(req, req.session.email);
        res.redirect("/otp");
      }
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

//otp

const verifyOtp = async (req, res) => {
  try {
    const userData = req.session.userData;
    const firstDigit = req.body.first;
    const secondDigit = req.body.second;
    const thirdDigit = req.body.third;
    const fourthDigit = req.body.fourth;
    const fullOTP = firstDigit + secondDigit + thirdDigit + fourthDigit;

    if (!req.session.user_id) {
      if (fullOTP == req.session.otp) {
        const secure_password = await securePassword(userData.password);
        const user = new User({
          name: userData.name,
          email: userData.email,
          mobile: userData.mobile,
          password: secure_password,
          image:'',
          isAdmin: 0,
          is_blocked: 1,
        });
        const userDataSave = await user.save();
        if (userDataSave && userDataSave.isAdmin === 0) {
          req.session.user_id = userDataSave._id;
          res.redirect("/");
        } else {
          res.render("user/otp", { message: "Registration Failed" });
        }
      } else {
        res.render("user/otp", { message: "invailid otp" });
      }
    } else {
      if (fullOTP == req.session.otp) {
        res.redirect("/resetPassword");
      } else {
        res.render("user/otp", { message: "invailid otp" });
      }
    }
  } catch (error) {
    console.log(error.message);
  }
};

//otp page

const loadOtp = async (req, res) => {
  try {
    res.render("user/otp");
  } catch (error) {
    console.log(error.message);
  }
};
const resendOtp=async (req,res)=>{
  try {
    const userData=req.session.userData;
    if(!userData){
      res.status(400).json({ message: "Invalid or expired session" });
    }else{
      delete req.session.otp;
      const data = await message.sendVarifyMail(req, userData.email);
    }
    res.render("user/otp", { message: "OTP resent successfully" });
    
  } catch (error) {
    console.log(error.message);
    res.render("user/otp", { message: "Failed to send otp" });
    
  }

};

const laodForgetpassword=async(req,res)=>{
  try {
    res.render("user/forgotPassword");
    
  } catch (error) {
    console.log(error.message);
    
  }
};
const forgotPasswordOTP=async(req,res)=>{
  try {
    const emaildata = req.body.email;

    const userExist = await User.findOne({ email: emaildata });
    req.session.userData=userExist;
    req.session.user_id = userExist._id;
    if (userExist) {
      const data = await message.sendVarifyMail(req, userExist.email);
      return res.redirect("/otp");
    } else {
    
      res.render("user/forgotPassword", {
        error: "Attempt Failed",
        User: null,
      });
    }
    
  } catch (error) {
    console.log(error.message);
  }
};

const loadResetPassword=async(req,res)=>{
  try {
    if (req.session.user_id) {
      const userId = req.session.user_id;
      const user = await User.findById(userId);

      res.render("user/resetPassword", { User: user });
    } else {
      res.redirect("/forgotPassword");
    }
  } catch (error) {
    console.log(error.message);
  }
};


const loadprofile = async (req, res) => {
  try {
    const userId = req.session.user_id;
    const userData = await User.findById(userId);
    if (userData) {
      res.render("user/userProfile", { userData });
    } else {
      res.redirect("/login");
    }
  } catch (error) {
    console.log(error.message);
  }
};
const userEdit = async (req, res) => {
  try {
    const id = req.body.user_id;

    if (!id) {
      return res.status(400).json({ success: false, message: 'User ID is missing or invalid' });
    }

    const userData = await User.findById(id);

    if (!userData) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { name, mobile } = req.body;

    let updateData;

    if (!req.file) {
      updateData = await User.findByIdAndUpdate(
        { _id: id },
        {
          $set: {
            name,
            mobile,
          },
        },
        { new: true } 
      );
    } else {
      updateData = await User.findByIdAndUpdate(
        { _id: id },
        {
          $set: {
            name,
            mobile,
            image: req.file.filename,
          },
        },
        { new: true }
      );
    }

    res.status(200).json({ success: true, message: 'Profile updated successfully', user: updateData });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};



const resetPassword = async (req, res) => {
  try {
    const user_id = req.session.user_id;
    const current_password = req.body.currentPassword;
    const new_password = req.body.newPassword;

    const user = await User.findById(user_id);
    if (!user) {
      return res.status(400).json({ success: false, message: 'User not found' });
    }
    const isPasswordMatch = await bcrypt.compare(current_password, user.password);

    if (!isPasswordMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }

    const secure_new_password = await securePassword(new_password);
    const updateData = await User.findByIdAndUpdate(
      { _id: user_id },
      { $set: { password: secure_new_password } }
    );

    if (updateData) {
      return res.json({ success: true, message: 'Password updated successfully' });
    } else {
      return res.status(500).json({ success: false, message: 'Error updating password' });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};




//user side shop

const loadShop=async (req,res)=>{
  try {
    const userId = req.session.user_id;
    const userData = await User.findById(userId);
    const productData = await Product.find({is_listed:true});
    const categories = await Category.find();
    res.render("user/shop", { products: productData, userData, categories });
    
  } catch (error) {
    console.log(error.message)
    
  }
};

//single product view

const loadSingleshop=async (req,res)=>{
   try {
    const userId = req.session.user_id;
    const userData = await User.findById(userId);
    const productId = req.params.id;
    const product = await Product.findById(productId);
    const categories = await Category.find();

    res.render("user/singleProduct", { userData, product, categories });


    
   } catch (error) {
    console.log(error.message);
    
   }
};
const loadShopCategory = async (req, res) => {
  try {
    const userId = req.session.user_id;
    const userData = await User.findById(userId);
    const categoryId = req.query.id;
 
    let totalProducts;


    const sort = req.query.sort
    let sortOption = {};
    if (sort === 'asc') {
        sortOption = { discount_price: 1 }; 
    } else if (sort === 'dsc') {
        sortOption = { discount_price: -1 }; 
    } else {
        
        sortOption = {};
    }

    const findQuery = categoryId ? { category: categoryId } : {};

    totalProducts = await Product.countDocuments(findQuery);

    const categories = await Category.find();
    const page = req.query.page || 1;
    const itemsPerPage = 6;
    const totalPages = Math.ceil(totalProducts / itemsPerPage);

    const options = {
      page: page,
      limit: itemsPerPage,
      sort:sortOption,
      findQuery
    };
    console.log(options);

    const paginatedProducts =  await Product.paginate(findQuery, options)
    

    res.render("user/shop", {
      products: paginatedProducts.docs,
      userData,
      totalPages: totalPages,
      currentPage: paginatedProducts.page,
      categories,
      
      
    
      
    });
  } catch (error) {
    console.log(error.message);
  }
};







const filterProducts = async (req, res) => {
  try {
    const { minPrice, maxPrice } = req.body;

    if (!minPrice || !maxPrice) {
      return res.status(400).json({ error: 'Minimum and maximum prices are required' });
    }

    const products = await Product.find({
      price: { $gte: parseFloat(minPrice), $lte: parseFloat(maxPrice) },
      is_listed: true, // Assuming you only want to filter listed products
    });

    res.render('user/shop', { products, userData, categories });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
const loadWallets = async (req, res) => {
  try {
    const userId = req.session.user_id;

    const userData = await User.findById(userId);
    if (!userData) {
      return res.render("user/login", { userData: null });
    }

    const walletData = await Wallet.findOne({ user: userId });
  
    if (!walletData) {
   console.log(walletData,"walletDataada");
      return res.render("user/wallets", { userData, wallet: [] });
    }
    console.log(walletData,"walletData");

    res.render("user/wallets", { userData, wallet: walletData });
  } catch (err) {   
  
    console.error("Error in loadWallets route:", err);
    res.status(500).send("Internal Server Error");
  }
};











const userLogout = async (req, res) => {
  try {
    req.session.destroy();

    res.redirect("/login");
  } catch (error) {
    console.log(error.message);
  }
};
  module.exports={
postLogin,
userLogout,
postSignup,
getHome,
getLogin,
getSignup,
loadOtp,
verifyOtp,
resendOtp,
loadShop,
loadSingleshop,
loadShopCategory,
filterProducts,
loadprofile,
userEdit,
resetPassword,
laodForgetpassword,
forgotPasswordOTP,
loadResetPassword,
loadWallets,


 }