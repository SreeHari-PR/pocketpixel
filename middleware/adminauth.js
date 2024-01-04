const User = require("../models/user");

const isLogin = async (req, res, next) => {
  try {
    console.log(req.session.admin_id);

    const adminData = await User.findOne({ _id: req.session.admin_id });

    if (req.session.admin_id && adminData.isAdmin == 1 ) {
      next();
    } else {
      res.redirect("/admin"); 
    }
  } catch (error) {
    console.log(error.message);
  }
};

const isLogout = async (req, res, next) => {
  try {
   
    const adminData = await User.findOne({ _id: req.session.admin_id });

  
    if (req.session.admin_id && adminData.isAdmin == 1) {
      res.redirect("/admin/adminHome");
    } else {
      next();
    }
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  isLogin,
  isLogout,
};
