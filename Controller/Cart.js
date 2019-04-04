var User = require('../mongodb/Schema/users');
var express = require('express');
var Goods = require('../mongodb/Schema/goods')
var router = express.Router();
//查询当前用户购物车数据(旧)
// router.post("/F_cartList",function(req,res,next){
//     var u_name = req.body.u_name;   // 获取用户Id
//     User.findOne({"u_name":u_name},function(err,doc){
//         if(err){
//             res.json({
//                 status:"500",
//                 result_kind : "ERROR",
//                 result:{
//                     msg:"服务器发生异常，请重试！"
//                 }
//             })
//         }else{
//             if(doc){
//                 var total = 0
//                 for (let i=0 ; i<doc.cartList.length; i++){
//                     total = total + doc.cartList[i].g_buy*doc.cartList[i].g_cost
//                 }
//                 res.json({
//                     status:'200',
//                     result_kind:"User",
//                     result:{
//                         cartList:doc.cartList,
//                         total : total
//                     }
//                 })
//             }
//         }
//     })
// })


//查看购物车商品数量
router.post("/checkCartAmount",async function(req,res){
    var u_name = req.body.u_name
    await User.findOne({"u_name" : u_name},function(err,doc){
        if(err){
            res.json({
                status:"500",
                result_kind:"ERROR",
                result:{
                    msg:"服务器发生异常，请重试！"
                }
            })
        }else{
            var length = doc.cartList.length
            res.json({
                status : "200",
                result_kind  : "SUCCESS",
                result : {
                    msg : length
                }
            })
        }        
    })
})

//购物车商品删除功能(已改)
router.post("/D_cartList",function(req,res,next){
    var u_name = req.body.u_name,
        g_id = req.body.g_id;
    User.update({         //update方法（｛查询条件｝,｛操作｝，｛回调函数｝）
        "u_name" : u_name
    },{
        $pull : {        //&pull 删除
            'cartList' : {
                '_id' : g_id
            }
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
                result_kind:'SUCCESS',
                result:{
                    msg:"已移除购物车"
                }
            });
        }
    })
})




//商品数量修改(已改)
router.post("/C_cartList",function(req,res,next){
    var u_name = req.body.u_name,
        g_id = req.body.g_id,
        g_buy = req.body.g_buy
    User.update({         //update方法（｛查询条件｝,｛操作｝，｛回调函数｝）
        "u_name":u_name,
        "cartList._id":g_id
    },{
        $set : {        
            "cartList.$.g_buy"  : g_buy            
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
                result_kind:'SUCCESS',
                result:{
                    "cartList" : doc
                }
            });
        }
    })
    
    // User.findOne(parameter,function(err,doc){
    //     if(err){
    //         res.json({
    //             status:"500",
    //             result_kind:"ERROR",
    //             result:{
    //                 msg:"服务器发生异常，请重试！"
    //             }
    //         })
    //     }else{
    //         doc.save({"cartList.g_number" : g_number},function(err,doc1){
    //             if(err){
    //                 res.json({
    //                     status:"500",
    //                     result_kind:"ERROR",
    //                     result:{
    //                         msg:"服务器发生异常，请重试！"
    //                     }
    //                 })
    //             }else{
    //                 res.json({
    //                     status:"200",
    //                     result_kind:"SUCCESS",
    //                     result:{
    //                         "cartList" : doc1
    //                     }
    //                 })
    //             }
    //         })
    //     }
    // });
})

//清空购物车(已改)
router.post('/C_delate',function(req,res){
    var u_name = req.body.u_name;
    User.update({"u_name" : u_name},
	{
		$set : {
			"cartList" : []
		}
    },
    {upsert:true},
	function(err,doc){
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
				result_kind:"SUCCESS",
				result:{   
                    msg:"已清空购物车"
                }
			})
        }
    })
    
})


//单次加减商品数量（已改）
router.post("/CartNumber",async function(req,res){
	var u_name = req.body.u_name;
    var g_id = req.body.g_id;
    var scode =req.body.scode;   //  1为用户点击加号 ,0为用户点击减号
    
    var gooditem = [];
    await Goods.findOne({'_id' : g_id},function(err,gdoc){
		if(err){
			res.json({
				status : "500",
				result_kind :  "ERROR",
				result:{
					msg: "服务器发生异常，请重试！"
				}
			})
		}else{
            gooditem.push(gdoc.g_number)
        }        
    })


    await User.findOne({
        "u_name" : u_name
    },function(err,doc){
		if(err){
			res.json({
				status : "500",
				result_kind :  "ERROR",
				result:{
					msg: "服务器发生异常，请重试！"
				}
			})
		}else{
            var middle = 0;
            var add ;
            var minus ;
            for(let i=0 ; i<doc.cartList.length;i++){
                if(doc.cartList[i]._id == g_id){
                    if(scode == 1){
                        if(doc.cartList[i].g_buy >= gooditem){
                            middle ++ ;
                        }else{
                            middle = 0
                            add = i 
                            break;
                        }
                    }else{
                        middle--
                        minus = i
                        break;
                    }
                }
            }

            if(middle>0){
                res.json({
                    status : "200",
                    result_kind : "WARNING",
                    result : {
                        'msg' : "已超过库存,无法添加!"
                    }
                })
            }else if(middle == 0){
                doc.cartList[add].g_buy++
                doc.save();
                res.json({
                    status : "200",
                    result_kind : "SUCCESS",
                    result : {
                       'msg' : "商品数量添加成功!"
                    }
                })
            }else{
                doc.cartList[minus].g_buy--
                if(doc.cartList[minus].g_buy==0){
                    doc.cartList.splice(minus,1)
                }
                doc.save();
                res.json({
                    status : "200",
                    result_kind : "SUCCESS",
                    result : {
                        'msg': "商品数量减少成功！"
                    }
                })
            }
		}
	})
})

//查询当前购物车数据(已改)
router.post("/F_cartList",function(req,res){
	var u_name = req.body.u_name	
	User.findOne({"u_name" : u_name},function(err,doc){
		if(err){
			res.json({
				status : "500",
                result_kind:"ERROR",
                result:{
                    'msg' : "服务器发生异常，请重试！"
                }
			})
		}else{
            var total = 0
            for (let i=0 ; i<doc.cartList.length; i++){
                total = total + doc.cartList[i].g_buy*doc.cartList[i].g_cost
            }
			var cartlist = []
			doc.cartList.forEach(function(el,index){
				for(var i=0;i<cartlist.length;i++){
					if(cartlist[i].s_name == el.s_name){
						cartlist[i].goodInfo.push({
						_id : el._id,
						g_name : el.g_name,
						g_cost : el.g_cost,
						g_picture : el.g_picture,
						g_number : el.g_number,
						g_buy : el.g_buy,
						g_sales : el.g_sales,
						g_picture_2 : el.g_picture_2,
						g_picture_3 : el.g_picture_3,
						g_picture_4 : el.g_picture_4
						});
						return;
					}
				}
			cartlist.push({
				s_name : el.s_name,
				goodInfo : [{
					_id : el._id,
					g_name : el.g_name,
					g_cost : el.g_cost,
					g_picture : el.g_picture,
					g_number : el.g_number,
					g_buy : el.g_buy,
					g_sales : el.g_sales,
					g_picture_2 : el.g_picture_2,
					g_picture_3 : el.g_picture_3,
					g_picture_4 : el.g_picture_4
				}]
			});
			});
			res.json({
				status : "200",
                result_kind:"User",
                result:{
                    'User' : {
                        cartList : cartlist,
                        total : total
                    }

                }				
		
		})
		}
	
	})
})
module.exports = router;