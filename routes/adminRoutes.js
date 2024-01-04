const express = require('express');
const router = express.Router()
const adminController = require('../controllers/adminController');
const adminauth = require("../middleware/adminauth");
const categoryController=require("../controllers/categoryController");
const productController=require("../controllers/productController");
const multer=require("../middleware/multer");
const adminorderController=require('../controllers/adminorderController');
const couponController=require('../controllers/couponController')
const offerController=require("../controllers/offerController")

router.get('/adminHome',adminauth.isLogin,adminController.getHome);
 router.get('/',adminauth.isLogout, adminController.getLogin);
 router.post('/',adminauth.isLogout, adminController.postLogin);
 router.get('/logout',adminauth.isLogin,adminController.adminLogout ); 

//user
router.get("/userData",adminauth.isLogin,adminController.loadUserpage);
router.get('/unlistUser',adminauth.isLogin,adminController.listUser);

//add Category
router.get("/category",adminauth.isLogin,categoryController.loadCategory)
router.get("/addcategory",adminauth.isLogin,categoryController.loadCategoryform);
router.post("/addCategory",multer.uploadCategory.single('image'), categoryController.addCategory);
router.get("/unlistCategory",adminauth.isLogin,categoryController.unlistUser);
router.get("/editCategory",adminauth.isLogin,categoryController.loadEditCategory);
router.post("/editCategory",multer.uploadCategory.single('image'), categoryController.CategoryEdit);


//add Product
router.get("/products",adminauth.isLogin, productController.loadProducts);
router.get("/addproduct",adminauth.isLogin, productController.loadPorductForm);
router.post("/addproduct",multer.uploadProduct.array('image'), productController.addProduct);
router.get("/deleteProduct/:id",adminauth.isLogin, productController.deleteProduct);
router.get("/editProduct",adminauth.isLogin, productController. loadEditPorductForm);
router.post("/editProduct",multer.uploadProduct.array('image'), productController.storeEditProduct);

//order
router.get("/alluserorders", adminauth.isLogin, adminorderController.listUserOrders);
router.get("/orderDetails", adminauth.isLogin, adminorderController.listOrderDetails);
router.put("/orderStatusChange", adminauth.isLogin,adminorderController.orderStatusChange);
router.get("/salesReport", adminauth.isLogin, adminorderController.loadSalesReport);


//coupon
router.get("/couponAdd",adminauth.isLogin,couponController.loadCouponAdd);
router.post("/couponAdd",couponController.addCoupon);
router.get("/couponList",adminauth.isLogin,couponController.loadCouponList);
router.get("/couponEdit", adminauth.isLogin,couponController.loadEditCoupon );
router.put("/couponEdit",couponController.editCoupon );
router.get("/couponUnlist", adminauth.isLogin, couponController.unlistCoupon);
router.get("/couponDetails", adminauth.isLogin, couponController.couponDetails);


//offer
router.get("/offerAdd", adminauth.isLogin,offerController.loadOfferAdd );
router.post("/offerAdd",offerController.addOffer );
router.get("/offerlist", adminauth.isLogin,offerController.OfferList );
router.get("/offerEdit", adminauth.isLogin,offerController.loadOfferEdit );
router.put("/offerEdit", adminauth.isLogin,offerController.editOffer );
router.get("/blockOffer", adminauth.isLogin,offerController.offerBlock );


module.exports = router;
