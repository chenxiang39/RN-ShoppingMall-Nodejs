var mongoose =require('mongoose'),
    Schema= mongoose.Schema;

var ObjectId = Schema.Types.ObjectId;
var ShopSchema = new Schema({
    s_id : {type:ObjectId},
    s_name : {type:String},//店铺名称
    s_location : {type:String},//公司地址
    s_linkname : {type:String},//联系人姓名
    s_code : {type:String},//公司代码
    s_pnumber : {type:String},//手机号
    s_password : {type:String},//密码
    s_score : {type:String},//评分
    s_state :  {type:String},
    s_picture : {type : String},
});
module.exports=mongoose.model('shop',ShopSchema);
