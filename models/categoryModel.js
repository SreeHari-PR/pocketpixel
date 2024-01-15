const mongoose=require("mongoose");

const Category= new mongoose.Schema({
    name:{
    type:String,
    require:true
    },
    image:{
        type:String,
        require:true
    },
    description:{
        type:String,
        require:true
    },
    is_listed:{
        type:Boolean,
        require:true


    },
    discountStatus:{
        type:Boolean,
        default:false
      },
      discount:String,
      discountStart:Date,
      discountEnd:Date,
    categoryAddDate: {
        type: Date,
        default: Date.now, // Store the current date and time when the user is created
      },

});
module.exports=mongoose.model("Category",Category);