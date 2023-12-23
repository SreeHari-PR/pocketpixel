
const User=require("../models/user")
const bcrypt=require("bcrypt")


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
const getHome=async(req,res)=>{
    
  try {
      const userData = await User.findById({_id:req.session.admin_id})
      
      res.render('admin/adminHome',{admin:userData})
  } catch (error) {
      console.log(error.message)
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

    res.redirect("/adminLogin");
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
