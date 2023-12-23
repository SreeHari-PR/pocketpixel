const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
 
 name: {
    type: String,
    required: true,
  
  },
  email:{
    type:String,
    required:true
},
mobile:{
  type:String,
  required:true

},
  password: {
    type: String,
    required: true,
  },
  isAdmin:{
    type:Number,
    default:0,
  },
  image:{
    type:String,
  },
  is_blocked:{
    type:Number,
    default:1,
}
});

const User = mongoose.model('User', userSchema);

module.exports = User;
