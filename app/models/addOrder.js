var mongoose=require('mongoose');

module.exports=mongoose.model('addOrder',{
  name: String,
  addressLine1: String,
  addressLine2: String,
  city: String
});
