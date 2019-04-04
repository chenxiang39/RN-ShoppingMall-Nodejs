var mongoose =require('mongoose')
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var UserSchema = new Schema({
        u_id : {type : ObjectId},                              //此处定义为ObjectId
        u_name : {type:String,require : true},//个人用户账号
        u_number : {type:Number},//个人用户电话
        u_password : {type:String,require : true},//个人用户密码
        u_mail : {type:String},//个人用户账号
        u_state :  {type:Boolean},
    'cartList':[                                               
        {
            's_name' : {type : String},
            'g_id' : {type : String},     
            'g_name' : {type:String,require : true},
            'g_cost' : {type : Number},
            'g_picture' : {type : String},
            'g_state' : {type : Boolean}, // 是否被选中
            'g_sales' : {type : Number},
            'g_buy' : {type : Number},
            'g_number' : {type : Number},
            'g_comment' : {type : String}
        }
    ],

    "addressList":[   //送货地点
        {
            'u_name' : {type : String},
            'a_name' : {type : String,require : true},
            'postCode' : {type : Number},
            'tellphone' : {type : String},
            'a_state' : {type : Boolean}
        }
    ],

    "orderList":{type : Array},
    "u_comment":{type : Array},
    // goods : [{type : Schema.Types.ObjectId,ref:'goods'}]
});
module.exports=mongoose.model('users',UserSchema);