var mongoose =require('mongoose'),
    Schema= mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var GoodsSchema = new Schema({
    s_name : {type:String},
    g_id : {type:ObjectId}, //商品id
    g_name : {type:String},//商品名称
    g_cost : {type:Number},//商品价格（单价）
    g_kind : {type:String},//商品大类
    g_kp : {type : String},//商品大类的图片
    g_picture : {type:String},//商品图片
    g_picture_2 : {type:String},
    g_picture_3 : {type:String},
    g_picture_4: {type:String},
    g_ft : {type:Number},//上架时间
    g_et : {type:Number},//下架时间
    g_number : {type: Number},//商品数量
    g_clicks :  {type:Number},//商品点击量
    g_sales :  {type:Number},//商品销量
    g_state :  {type:Boolean},//商品状态
    g_sc : {type : String},     //商品副类别
    g_scp : {type : String},  //商品副类图片
    g_buy : {type : Number},
    "g_comment":{type : Array}
});
module.exports=mongoose.model('goods',GoodsSchema);