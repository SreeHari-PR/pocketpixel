const User = require("../models/user");
const Address = require("../models/addressModel");
// get register
const loadAddress = async (req, res) => {
  try {
    const userId = req.session.user_id;

    const userData = await User.findById(userId);

    if (userData) {
      const addressData = await Address.find({ user: userId });
      res.render("user/userAddress", { userData, addressData });
    } else {
      res.redirect('/login');
    }

  } catch (error) {
    console.log(error.message);
  }
};


const loadAddAddress = async (req, res) => {
  try {
    const userId = req.session.user_id;

    const userData = await User.findById(userId);
    if (userData) {
      res.render("user/addAddress", { userData, });
    } else {
      res.redirect('/login');
    }


  } catch (error) {
    console.log(error.message);
  }
};







const addAddress = async (req, res) => {
  try {
    const userId = req.session.user_id;

    const { houseName, street, city, state, pincode } = req.body;




    const address = new Address({
      user: userId,
      houseName,
      street,
      city,
      state,
      pincode,
      is_listed: true

    });
    const addressData = await address.save();



    res.status(200).json({ success: true, message: "return sucessfully" });


  } catch (error) {
    console.log(error.message);
  }
};

const loadEditAddress = async (req, res) => {
  try {
    const userId = req.session.user_id;

    const userData = await User.findById(userId);
    const id = req.query.id;
    const address = await Address.findById(id);

    res.render("user/editAddress", { userData, Address: address });
  } catch (error) {
    console.log(error.message);
  }
};

const loadEditAddresss = async (req, res) => {
  try {
    const userId = req.session.user_id;
    const userData = await User.findById(userId);
    const id = req.query.id;
    const address = await Address.findById(id);
    res.status(200).json({ success: true, message: "return successfully", userData, address });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


const editAddress = async (req, res) => {
  try {

    const { houseName, street, city, state, pincode, address_id } = req.body;
    const updateData = await Address.findByIdAndUpdate(
      { _id: address_id },
      {
        $set: {
          houseName,
          street,
          city,
          state,
          pincode,
          is_listed: true
        },
      }
    );
    // res.redirect("/userAddress");
    res.status(200).json({ success: true, message: "return sucessfully" });
  }
  catch (error) {
    console.log(error.message);
  }


}



const deleteAddress = async (req, res) => {
  try {
    const id = req.query.id;
    const addressData = await Address.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          is_listed: false,
        },
      }
    );
    res.redirect("/userAddress");
  } catch (error) {
    console.log(error.message);
  }
};






module.exports = {
  loadAddress,
  loadAddAddress,
  addAddress,
  loadEditAddress,
  editAddress,
  deleteAddress,
  loadEditAddresss

};