var mongoose=require('mongoose');

module.exports=mongoose.model('addFood',{
  title: String,
  price: Number,
  quantity: Number,
  totalQuantity: Number,
  totalMoney: Number
});
