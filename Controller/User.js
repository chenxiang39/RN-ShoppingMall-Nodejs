var User = require('../mongodb/Schema/users');
var Shop = require('../mongodb/Schema/shop');
const crypto = require('crypto');
const hash = crypto.createHash('md5');
var express = require('express');
var router = express.Router();

//用户登录接口（已改）
router.post('/u_login',function(req,res){
    var u_name = req.body.u_name;
    var u_password = req.body.u_password;       //通过req.body获取用户账号和密码的参数
    var parameter = {
        'u_name': u_name,
        'u_password' : u_password
    }
    User.findOne(parameter,function(err,doc){
        if(err){
            res.json({
                status:"500",
                result_kind:"ERROR",
                result:{
                    'msg' : "服务器发生异常，请重试！"
                }
            })
        }else{
            if(doc){
                res.json({
                    status:"200",
                    result_kind:"User",
                    result:{
                        // User:{
                        //     u_id:doc._id,                             //起名理由同下
                        //     u_name:doc.u_name,
                        //     u_password:doc.u_password,   
                        //     u_cartList:doc.cartList,                  //u_cartList是方便前端查看的，与后端起名无关，数据库里依然是cartList
                        //     u_addressList:doc.addressList,             //起名理由同上
                        //     u_orderList : doc.orderList,
                        //     u_comment : u_comment
                        // }  
                        "User" : doc                           
                    }
                })
            }else{
                res.json({
                    status:"200",
                    result_kind:"WARNING",
                    result:{
                        'msg' : "用户名或密码错误"
                    }
                })  
            }
        }
    })
    
})


//用户注册接口（已改）
router.post("/u_register",function(req,res){
    var u_name = req.body.u_name;
    var u_password = req.body.u_password;                 //通过req.body获取用户账号和密码的参数
    var parameter = {
        'u_name': u_name
    }
    User.findOne(parameter,function(err,doc){   // 同理 /login 路径的处理方式
        if(err){
            res.json({
                status:"500",
                result_kind:"ERROR",
                result:{
                    'msg' : "服务器发生异常，请重试！"
                }
            })  
        }else if(doc){ 
            res.json({
                status:"200",
                result_kind:"WARNING",
                result:{
                    'msg' : "该用户名已存在，请更换用户名！"
                }
            })
        }else{ 
            // u_password = hash.update(u_password)
            User.create({                             // 创建一组user对象置入model
                "u_name" : u_name,
                "u_password": u_password
            },function(err,doc){ 
                 if (err) {
                    res.json({
                        status:"500",
                        result_kind:"ERROR",
                        result:{
                            'msg' : "服务器发生异常，请重试！"
                        }
                    })  
                    } else {
                        res.json({
                            status:"200",
                            result_kind:"SUCCESS",
                            result:{
                                'msg' :"用户创建成功",
                            }
                        })
                    }
                  });
        }
    });
});


//用户登出
router.post('/u_logout',function(req,res,next){
    res.cookie("u_id","",{
        path:"/",
        maxAge:-1  // 生命周期
    })
    res.json({
        status:"0",
        msg:'',
        result:''
    })
})


//商店注册接口
router.post("/s_register",function(req,res){
    var s_name=req.body.s_name
    var s_code = req.body.s_code
    var s_location = req.body.s_location
    var s_linkname =req.body.s_linkname//联系人姓名
    var s_pnumber =req.body.s_pnumber//手机号
    var s_picture =req.body.s_picture
    var s_state =req.body.s_state
    var s_score =req.body.s_score
    var parameter = {
        's_name': s_name,
        's_code' : s_code,
        's_location' : s_location,
        's_linkname' : s_linkname,
        's_pnumber' : s_pnumber,
        's_picture' : s_picture,
        's_state' : s_state,
        's_score ' : s_score 
    }
    Shop.findOne(parameter,function(err,doc){   // 同理 /login 路径的处理方式
        if(err){
            res.json({
                status:"500",
                result_kind:"ERROR",
                result:{
                    'msg' : "服务器发生异常，请重试！"
                }
            })  
        }else if(doc){ 
            res.json({
                status:"200",
                result_kind:"WARNING",
                result:{
                    'msg' : "该商铺已注册",
                }
            })
        }else{ 
            Shop.create({                             
                's_name': s_name,
                's_code' : s_code,
                's_location' : s_location,
                's_linkname' : s_linkname,
                's_pnumber' : s_pnumber,
                's_picture' : s_picture,
                's_state' : s_state,
                's_score ' : s_score 
            },function(err,doc){ 
                 if (err) {
                    res.json({
                        status:"500",
                        result_kind:"ERROR",
                        result:{
                            'msg' : "服务器发生异常，请重试！",
                        }
                    })
                    } else {
                        res.json({
                            status:"200",
                            result_kind:"SUCCESS",
                            result:{
                                'msg' : "商铺创建成功"
                            }
                        })
                    }
                  });
        }
    });
});

//先不做商铺登陆！！！！！！！！！！！！！！！！！！！！！
//上面的判断用户登录登出我来做，前端可以做！！！！！！！！！！！！！！！！！




// //商铺登录
// router.post('/s_login',function(req,res,next){
//     var parameter={
//         s_name:req.body.s_name,
//         s_password:req.body.s_password,       //通过req.body获取用户账号和密码的参数
//         s_code : req.body.s_code
//     }
//     Shop.findOne(parameter,function(err,doc){
//         if(err){
//             res.json({
//                 status:"1",
//                 result_kind:err.message
//             })
//         }else{
//             if(doc){
//                 res.cookie("s_id",doc.s_id,{
//                     path:'/',
//                     maxAge:100*60*60      //最大缓存时间
//                 });
//                 res.cookie("s_name",doc.s_name,{
//                     path:'/',
//                     maxAge:100*60*60      //最大缓存时间
//                 });

//                 res.cookie("s_code",doc.s_code,{
//                     path:'/',
//                     maxAge:100*60*60      //最大缓存时间
//                 });

//                 res.json({
//                     status:"0",
//                     result_kind:"成功登录",
//                     result:{
//                         s_name:doc.s_name
//                     }
//                 })
//             }
//         }
//     })
    
// })

// //店铺登出
// router.post('/s_logout',function(req,res,next){
//     res.cookie("s_id","",{
//         path:"/",
//         maxAge:-1 //生命周期
//     })
//     res.json({
//         status:"0",
//         result_kind:'',
//         result:''
//     })
// })

// // 店铺校验是否登录接口
// router.post('/s_check',function(req,res,next){
//     if(req.cookies.s_id){
//         res.json({
//             status:'0',
//             result_kind:'',
//             result:req.cookies.userName || ''
//         }); 
//     }else{
//         res.json({
//             status:'1',
//             result_kind:'未登录',
//             result:''
//         })
//     }
// })

//返回所有用户信息
router.post('/AllUserDoc',function(req,res){
    var u_name = req.body.u_name;
    User.findOne({"u_name" : u_name},function(err,doc){
        if(err){
            res.json({
                status:"500",
                result_kind:"ERROR",
                result:{
                    'msg' : "服务器发生异常，请重试！"
                }
            })
        }else{
			res.json({
				status:"200",
				result_kind:"User",
				result:{   
					"User" : doc
                }
            })
        }
    })
    
})
module.exports = router;