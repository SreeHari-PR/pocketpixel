const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const categoryController=require('../controllers/categoryController');
const cartController=require('../controllers/cartController');
const multer=require("../middleware/multer");
const addressController=require("../controllers/addressController");
const orderController=require("../controllers/orderController");
const couponController=require("../controllers/couponController");
const {islogin,islogout}=require("../middleware/userauth");

//registration
router.get('/', userController.getHome);
router.get('/login',islogout, userController.getLogin);
router.post('/login', userController.postLogin);
router.get('/register',islogout, userController.getSignup);
router.get('/otp', userController.loadOtp );
router.post('/otp',userController.verifyOtp );
router.get('/resendOtp', userController.resendOtp );
router.post('/register', userController.postSignup);
router.get('/logout',islogin,userController.userLogout ); 
router.get('/forgotPassword',islogout,userController.laodForgetpassword);
router.post('/forgotPassword',userController.forgotPasswordOTP);
router.get('/resetPassword',userController.loadResetPassword);
router.post('/changePassword',userController.resetPassword);


//user profile
router.get('/userprofile',userController.loadprofile );
router.post('/userprofile',multer.uploadUser.single('image'), userController.userEdit );
router.get('/userAddress',islogin,addressController.loadAddress );
router.get('/addAddress',islogin,addressController.loadAddAddress );
router.post('/addAddress',islogin,addressController.addAddress );
router.get('/editAddress',islogin,addressController.loadEditAddress );
router.post('/editAddress',islogin,addressController.editAddress );
router.get('/deleteAddress',islogin,addressController.deleteAddress );
router.post('/resetPassword',islogin,userController.resetPassword);

//shop
router.get('/shop',islogin,userController.loadShopCategory);
router.get('/singleProduct/:id',islogin,userController.loadSingleshop);
router.get('/shopCategoryFilter',islogin,userController.loadShopCategory);
router.get('/filterProducts',islogin,userController.filterProducts);
router.get('/sorting',islogin,userController.loadShopCategory);

//cart
 router.get('/cart',islogin,cartController.loadCartPage);
 router.post('/cart',islogin,cartController.addTocart );
 router.put("/updateCart",islogin, cartController.updateCartCount);
router.delete("/removeCartItem",islogin, cartController.removeFromCart);

//checkout
router.get('/checkout',islogin,orderController.loadCheckout );
router.post('/checkout',islogin,orderController.checkOutPost );
router.post('/razorpayOrder',islogin,orderController.razorpayOrder );
router.get('/orderSuccess',islogin,orderController.loadOrderDetails );
router.get('/orderDetails/:id',islogin,orderController.loadOrderHistory );
router.post('/orderCancel',islogin,orderController.orderCancel );
router.post('/return',islogin,orderController.returnData );
router.get('/coupons',islogin,couponController.userCouponList);
router.post('/applyCoupon',islogin,orderController.applyCoupon);







module.exports = router;
