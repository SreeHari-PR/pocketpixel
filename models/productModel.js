const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2')

const Product = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image:[{
    type:String,
    required:true
}],
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
 

  price:{
    type:Number, 
    required:true
  },
  discount_price:{
    type:Number, 
    required:true
  },
  storage:{
    type:String,
    required:true
  },
  ram:{
    type:String,
    required:true
  },
  quantity:{
    type:String,
    require:true
  },

  productAddDate: {
    type: Date,
    default: Date.now, // Store the current date and time when the user is created
  },
  is_listed:{
    type:Boolean,
    default:true
}
 

  
});
Product.plugin(mongoosePaginate)
module.exports = mongoose.model('Product', Product);

