var User = require('../mongodb/Schema/users');
var Goods = require('../mongodb/Schema/goods');
var express = require('express');
var router = express.Router();

//创建订单并减少库存
router.post("/payment",async function(req, res, next){
    var u_name=req.body.u_name,
        a_name=req.body.a_name,
        cartList = eval(req.body.cartList);
        var goodsitem=[];       //购物车信息
        var full = [];          //购物车中库存足够的商品
        var fullnumber = 0;
        var less = [];          //购物车中库存不足的商品
        var lessnumber =0 ;
        var middle = [];        //需要更新的g_number
        var s_middle = [];
//判定是否有库存不足情况，若没有则库存减少        
    for(let i=0 ; i<cartList.length ;i++){
        await Goods.findOne({'_id' : cartList[i].g_id},function(err,doc){        //此处所有cartList中数据皆为前端解析后数据
            goodsitem.push(doc)
            if(goodsitem[i].g_number>=cartList[i].g_cartAmount){
                full.push(cartList[i])
                fullnumber = fullnumber+1 
                middle[i]=goodsitem[i].g_number-cartList[i].g_cartAmount
                s_middle[i] =goodsitem[i].g_sales+cartList[i].g_cartAmount
            }else{
                less.push(cartList[i])
                lessnumber=lessnumber+1 ;
            }
        })
    }
    if(lessnumber>=1){
        res.json({
            status:"200",
            result_kind : 'WARNING',
            result:{
                msg:"商品库存不足，无法购买!",
                'lessList' : less
            }
        })
    }else{
        for(let i=0 ; i<cartList.length ;i++){
            await Goods.update({'_id' : cartList[i].g_id},
            {
                'g_number' : middle[i],
                'g_sales' : s_middle[i]
            },{upsert:true})            
        }
//创建订单
        await User.findOne({"u_name" : u_name},function(err,userdoc){
            if(err){
                res.json({
                    status:'500',
                    result_kind:"ERROR",
                    result:{
                        msg:"服务器发生异常，请重试！"
                    }
                })
            }else{
                var address = '';
                if(!userdoc.addressList){     //遍历前判定数组是否存在
                    return;
                }
                //获取用户地址
                userdoc.addressList.forEach(function(item){
                    if(a_name == item.a_name){
                        address = item;
                    }
                })

                //生成订单并存储到数据库
                var flag = 1;
                for(let i=0 ; i<cartList.length;i++){
                    var r=Math.random().toString(16)
                    var t=Date.now().toString(16)
                    var o_id = r+t
                    var createDate = Date.now();
                    //前端字段转换
                    var change = {
                        _id: cartList[i].g_id,
                        g_name: cartList[i].g_name,
                        s_name: cartList[i].s_name,
                        g_cost: cartList[i].g_price,
                        g_number: cartList[i].g_stock,
                        g_comment:cartList[i].g_comments,
                        g_picture : cartList[i].g_url,
                        g_buy : cartList[i].g_cartAmount
                    }


                    //生成订单
                    var order={
                        _id : o_id,
                        addressInfo : address,
                        good :  change,//cartList[i],
                        createDate : createDate,
                        flag : flag
                    }
                    userdoc.orderList.push(order);
                }
                userdoc.save()
                res.json({
                    status:"200",
                    result_kind : 'SUCCESS',
                    result:{
                        'msg' : "成功生成订单!"
                    }
                }) 
                

            }
        })
    }
})

//查询订单详情
router.post("/orderDetail",async function(req,res,next){
    var u_name = req.body.u_name
    var orderList = [];
    await User.findOne({"u_name" : u_name},function(err,userdoc){
        if(err){
            res.json({
                status:'500',
                result_kind:"ERROR",
                result:{
                    msg:"服务器发生异常，请重试！"
                }
            })
        }else{
            for(let i=0;i<userdoc.orderList.length;i++){
                orderList.push(userdoc.orderList[i].good)
            }
            for(let v=0 ; v < userdoc.orderList.length; v ++){
            //评论状态
                if(userdoc.u_comment.length!=null){
                    for(let j=0 ; j < userdoc.u_comment.length;j++){
                        if(userdoc.u_comment[j]._id == userdoc.orderList[v].good._id){
                            userdoc.orderList[v].flag = 0;
                        }
                    }
                }   
            }
            userdoc.orderList.reverse();
            userdoc.save(function(err,doc){
                if(err){
                    res.json({
                        status:"500",
                        result_kind:"ERROR",
                        result:{
                            msg:"服务器发生异常，请重试！"
                        }
                    });
                }else{
                    res.json({
                        status:"200",
                        result_kind : 'User',
                        result:{
                            'User' : {
                                'orderList' : doc.orderList
                            }
                        }
                    });
                }
            })
        }

    })
})


//立即购买功能
router.post("/QuickPayment",async function(req, res, next){
    var u_name = req.body.u_name
    var g_id = req.body.g_id
    var a_name = req.body.a_name
    var good = [];
//库存减少
    await Goods.findOne({"_id" : g_id},function(err,doc){
        if(err){
            res.json({
                status:'500',
                result_kind:"ERROR",
                result:{
                    msg:"服务器发生异常，请重试！"
                }
            })
        }else{
            if(doc.g_number < 1){
                res.json({
                    status : "200",
                    result_kind : "WARNING",
                    result : {
                        'msg' : "库存不足，无法购买!"
                    }
                })
            }else{
                doc.g_number=doc.g_number-1
                doc.g_sales = doc.g_sales+1
                doc.save();
                let middle = {
                    g_id : doc._id,
                    g_name : doc.g_name,
                    s_name : doc.s_name,
                    g_cost : doc.g_cost,
                    g_number : doc.g_number,
                    g_comment : doc.g_comment,
                    g_picture : doc.g_picture,
                    g_buy : 1

                }
                good.push(middle)

                //生成订单
                User.findOne({"u_name" : u_name},function(err,userdoc){
                    if(err){
                        res.json({
                            status:'500',
                            result_kind:"ERROR",
                            result:{
                                msg:"服务器发生异常，请重试！"
                            }
                        })
                    }else{
                        var address = '';
                        if(!userdoc.addressList){     //遍历前判定数组是否存在
                            return;
                        }
                        //获取用户地址
                        userdoc.addressList.forEach(function(item){
                            if(a_name == item.a_name){
                                address = item;
                            }
                        })
        
                        //生成订单并存储到数据库
                        var flag = 1;
                        var r=Math.random().toString(16)
                        var t=Date.now().toString(16)
                        var o_id = r+t
                        var createDate = Date.now();
                        var order={
                            _id : o_id,
                            addressInfo : address,
                            good : good,
                            createDate : createDate,
                            flag : flag
                        }
                        userdoc.orderList.push(order);
                        userdoc.save(); 
                        res.json({
                            status:"200",
                            result_kind : 'SUCCESS',
                            result:{
                                'msg' : "成功生成订单!"
                            }
                        })                
                    }
                })
            }
        }
    })

})
//订单删除功能
// router.post("/D_payment",function(req, res, next){
//     var u_name = req.body.u_name
//         o_id = req.body.o_id
//     User.update({"u_name": u_name},
//     {
//         $pull:{
//             "orderList" : {
//                 'o_id' : o_id
//             }
//         } 
//     },function(err,doc){
//         if(err){
//             res.json({
//                 status:"500",
//                 result_kind:"ERROR",
//                 result:{
//                     msg:"服务器发生异常，请重试！"
//                 }
//             })
//         }else{
//             res.json({
//                 status:'200',
//                 result_kind:"Pay",
//                 result:{
//                     msg:"订单已删除"
//                 }
//             })
//         }
//     })
// })

module.exports = router;


    