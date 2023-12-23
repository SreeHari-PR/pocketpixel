const path=require('path');
const User=require("../models/user");
const sharp=require('sharp');
const Products=require("../models/productModel");
const Category =require("../models/categoryModel")


// loading products
const loadProducts=async (req,res)=>{
    try {
        const products=await Products.find();
        const categories=await Category.find();
        res.render('admin/products',{products,categories});

        
    } catch (error) {
        console.log(error.message);
    }
};

//form of adding products
const loadPorductForm = async (req, res) => {
    try {
      const userData = await User.findById({ _id: req.session.admin_id });
      let categories = await Category.find({})
      res.render("admin/addProducts", { categories,admin: userData });
  } catch (error) {
    console.log(error.message);
  }
};

//adding product

const addProduct = async (req, res) => {
    try {
      const imageData = [];
      const imageFiles = req.files;
  
      for (const file of imageFiles) {
        console.log(file, "File received");
  
        const randomInteger = Math.floor(Math.random() * 20000001);
        const imageDirectory = path.join('public', 'adminassets', 'imgs', 'productIMG');
        const imgFileName = "cropped" + randomInteger + ".jpg";
        const imagePath = path.join(imageDirectory, imgFileName);
  
      
 
        const croppedImage = await sharp(file.path)
          .resize(200, 200, {
            fit: "cover",
          })
          .toFile(imagePath);
  
        if (croppedImage) {
          imageData.push(imgFileName);
        }
      }
  
      const { name, category, price,discount_price,storage,ram,quantity,description } = req.body;
      
      const addProducts = new Products({
        name,
        category,
        price,
        discount_price,
        description,
        storage,
        ram,
        quantity,
        
        image: imageData,
      });
  
      await addProducts.save();
      res.redirect("/admin/products");
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Error while adding product");
    }
  };

  //delete product
  
const deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id, "kkkkkk");
    const productData = await Products.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          is_listed: false,
        },
      }
    );
    res.redirect("/admin/products");
  } catch (error) {
    console.log(error.message);
  }
};

const loadEditPorductForm = async (req, res) => {
  try {
    const id = req.query.id;
    const product = await Products.findOne({ _id: id });
    let categories = await Category.find({});
    if (product) {
      res.render("admin/editProduct", { categories, product });
    } else {
      res.redirect("/admin/products");
    }
  } catch (error) {
    console.log(error.message);
  }
};
const storeEditProduct = async (req, res) => {
  try {
    const product = await Products.findOne({ _id: req.body.product_id  });
    let images=[],deleteData=[]

    const {
      name,
      category,
      price,
      discountPrice,
      ram,
      storage,
      quantity,
      description,
    } = req.body;

    if (req.body.deletecheckbox) {
   
      deleteData.push(req.body.deletecheckbox); 
     
     
      
      deleteData = deleteData.flat().map(x=>Number(x))
      
      images = product.image.filter((img, idx) => !deleteData.includes(idx));
    }else{
      images = product.image.map((img)=>{return img});
    }
    if(req.files.length!=0){
      for (const file of req.files) {
        console.log(file, "File received");
  
        const randomInteger = Math.floor(Math.random() * 20000001);
        const imageDirectory = path.join('public', 'adminassets', 'imgs', 'productIMG');
        const imgFileName = "cropped" + randomInteger + ".jpg";
        const imagePath = path.join(imageDirectory, imgFileName);
  
        console.log(imagePath, "Image path");
  
        const croppedImage = await sharp(file.path)
          .resize(580, 320, {
            fit: "cover",
          })
          .toFile(imagePath);
  
        if (croppedImage) {
          images.push(imgFileName);
        }
      }
  
    }

 




    await Products.findByIdAndUpdate(
      { _id: req.body.product_id },
      {
        $set: {
          name,
          category,
          price,
           discountPrice,
          ram,
          storage,
          quantity,
          description,
          
          image:images,
        },
      }
    );
    res.redirect("/admin/products");
  } catch (error) {
    console.log(error.message);
  }
};



  module.exports={
    loadProducts,
    loadPorductForm,
    addProduct,
    deleteProduct,
    loadEditPorductForm,
    storeEditProduct,

  };