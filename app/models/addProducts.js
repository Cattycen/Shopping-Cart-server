
var mongoose=require('mongoose');

module.exports=mongoose.model('addProducts',{
    title:String,
    price:Number,
    imageUrl: String,
    category: String,
    done:Boolean
});













