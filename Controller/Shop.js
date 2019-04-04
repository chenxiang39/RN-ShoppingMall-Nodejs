var Shop = require('../mongodb/Schema/shop');
var Good = require('../mongodb/Schema/goods');
var express = require('express');
var router = express.Router();

//店商产品下架功能
router.post("/D_shopList",function(req, res, next){
    var g_name = req.body.g_name,
        s_name = req.cookies.s_name;
    Good.update({         
        "s_name" : s_name,
        "g_name" : g_name
    },{
        $pull : {        
            "g_id" : g_id
        }
    },function(err,doc){
        if(err){
            res.json({
                status:"500",
                result_kind:"ERROR",
                result:{
                    msg:"服务器发生异常，请重试！"
                }
            })
        }else{
            res.json({
                status:'200',
                result_kind:"ERROR",
                result:{
                    msg:"商品已删除"
                }
            });
        }
    })
})



//新商品上架   //可能同一家商店的商品的名字不能一样（到时候再说）
router.post("/C_shopList",function(req, res, next){
    var s_name =req.body.s_name,
        g_name = req.body.g_name,
        g_cost = req.body.g_cost,
        g_kind = req.body.g_kind,
        g_kp = req.body.g_kp,
        g_picture = req.body.g_picture,
        g_number = req.body.g_number,
        g_sc = req.body.g_sc,
        g_scp = req.body.g_scp,
        g_sales = req.body.g_sales
        g_picture_2 = req.body.g_picture_2
        g_picture_3 = req.body.g_picture_3
        g_picture_4 = req.body.g_picture_4
        g_buy = req.body.g_buy
    Good.update({ 
        "s_name": s_name, 
        "g_name": g_name            
    },{                    
        'g_name' : g_name,
        'g_cost' : g_cost,
        'g_kind' : g_kind,
        'g_kp' : g_kp,
        'g_picture' : g_picture,
        'g_picture_2' : g_picture_2,
        'g_picture_3' : g_picture_3,
        'g_picture_4' : g_picture_4,
        'g_number' : g_number,
        'g_sales' : g_sales,
        'g_sc' : g_sc,
        'g_scp' : g_scp,
        'g_buy' : g_buy,
        'g_comment' : []
    },{upsert:true},function(err,doc){
        if(err){
            res.json({
                status:"500",
                result_kind:"ERROR",
                result:{
                    msg:"服务器发生异常，请重试！"
                }
            })
        }else{
          res.json({
            status:'200',
            result_kind:"SUCCESS",
            result:{
                msg:"已成功添加商品！"       //result_kind不是具体类型的话就返回msg!!!!!!!!!!!!(111，112行要改)
            }
          });
        }
    });
})



//商品数量修改
router.post("/E_shopList",function(req, res, next){
    var s_name = req.body.s_name,
        g_name = req.body.g_name,
        g_number = req.body.g_number,
        g_state = req.body.g_state;
    Good.update({             // 查询条件
        "s_name" : s_name,
        "g_name":g_name
    },{                      // 修改的数据
        'g_number':g_number,
        'g_state':g_state
    },function(err,doc){
        if(err){
            res.json({
                status:"500",
                result_kind:"服务器发生异常，请重试！",
                result:{}
            })
        }else{
          res.json({
            status:'200',
            result_kind:'Shop',
            result:{
                g_number : doc.g_number,
                g_state : doc.g_state
            }
          });
        }
    });
})

module.exports = router;