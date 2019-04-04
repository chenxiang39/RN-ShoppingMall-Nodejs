var Goods = require('../mongodb/Schema/goods');
var User = require ('../mongodb/Schema/users');
var Shop = require('../mongodb/Schema/shop');
var express = require('express');
var router = express.Router();


//直接返回所有商品（已改）
router.get("/findAllGoodList",function(req,res){ 
    Goods.find({'g_name' : {$regex : ""}},function(err,doc){
        // console.log(doc)
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
                let gooditem = [];                               //查询并返回多个数组
                for(let i=0 ; i<doc.length;i++){
                    gooditem.push(doc[i])
                }
                res.json({
                    status:"200",
                    result_kind:"Goods",
                    result:{
                       'goods' : gooditem
                    }
                })
            }
        }
    })
})

//查询商品列表（随意String类型）（已改）
router.post("/findGoodListByString",function(req,res){
    var g_name = req.body.name
    var s_name = req.body.name
    var g_kind = req.body.name
    var g_sc = req.body.name
    Goods.find({"$or": [{'g_name':{$regex : g_name}}, {'s_name':{$regex : s_name}},{'g_kind':{$regex : g_kind}},{'g_sc':{$regex : g_sc}}]},function(err,doc){//模糊查询,查询条件为4个,或连接   (goods search)
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
                let gooditem = [];                               //查询并返回多个数组
                for(let i=0 ; i<doc.length;i++){
                    gooditem.push(doc[i])
                }
                res.json({
                    status:"200",
                    result_kind:"Goods",
                    result:{
                        'goods' : gooditem
                    }
                })
            }else{
                res.json({
                    status:"200",
                    result_kind:"WARNING",
                    result:{
                        msg:"查无此商品"
                    }
                })
            }
        }
    })
}) 

   

//加入购物车(已改)
router.post("/addCart",async function(req, res,next){
    var u_name = req.body.u_name; 
    var g_id = req.body.g_id;
    var number =0;
    await Goods.findOne({"_id" : g_id},function(err,gdoc){
        if(err){
            res.json({
                status:"500",
                result_kind:"ERROR",
                result:{
                    msg:"服务器发生异常，请重试！"
                }
            })
        }else{
            number=gdoc.g_number
        }        
    })

    User.findOne({"u_name": u_name},function(err,userdoc){
        if(err){
            res.json({
                status:"500",
                result_kind:"ERROR",
                result:{
                    msg:"服务器发生异常，请重试！"
                }
            })
        }else{
            if(userdoc){
                //若商品存在
//                console.log(userdoc);    // 测试
                let goodsItem='';
                let middle =0;
                userdoc.cartList.forEach(function(item){   //forEach一一遍历
                    if(item._id == g_id){
                        if(item.g_buy < number){
                            goodsItem=item;
                            item.g_buy++
                        }else{
                            middle++
                        }
                    }
                })
                if(middle != 0){
                    res.json({
                        status : "200",
                        result_kind : "WARNING",
                        result : {
                            'msg' : "库存不足,无法添加!"
                        }
                    })
                }else{
                    if(goodsItem){              //若购物车商品存在，把数据保存到数据库
                        userdoc.save(function(err,doc){
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
                                    result: {
                                        'msg' : "成功加入购物车"
                                    }
                                })
                            }
                        })
                    }else{                  //若购物车商品不存在
                        Goods.findOne({"_id":g_id},function(err1,doc1){     //查询购物车
                            if(err1){
                                res.json({
                                    status:"500",
                                    result_kind:"ERROR",
                                    result:{
                                        msg:"服务器发生异常，请重试！"
                                    }
                                })
                            }else{
                                if(doc1){                        //
                                    if(doc1.g_number <= 0){
                                        res.json({
                                            status : "200",
                                            result_kind : "WARNING",
                                            result : {
                                                'msg' : "库存不足,无法添加!"
                                            }
                                        })
                                    }else{
                                        doc1.g_buy=1;
                                        userdoc.cartList.push(doc1);
                                        userdoc.save(function(err2,doc2){
                                            if(err2){
                                                res.json({
                                                    status:"500",
                                                    result_kind:"ERROR",
                                                    result:{
                                                        msg : "服务器发生异常，请重试！"
                                                    }
                                                })
                                            }else{
                                                res.json({
                                                    status:'200',
                                                    result_kind:'SUCCESS',
                                                    result: {
                                                        'msg' : "成功加入购物车"
                                                    }
                                                })
                                            }
                                        })
                                    }

                                }
                            }
                        })
                    }
                }

//购物车中number++ ,库存中number--
/*
                Goods.find({"g_name" : g_name},function(err,goodsdoc){
                    if(err){
                        res.json({
                            status:"500",
                            result_kind:"ERROR",
                            result:{
                                msg:"服务器发生异常，请重试！"
                            }
                        })
                    }else{
                        console.log(goodsdoc);
                        if(goodsdoc.g_number>0){
                            if(goodsdoc.g_name == g_name){
                                goodsdoc.g_number--;
                            }
                        }else{
                            res.json({
                                status:"200",
                                result_kind:"WARNING",
                                result:{
                                    msg:"商品已售完"
                                }
                            })
                        }
                    }
                })
*/




                // userdoc.save(function(err,doc){       //保存到数据库测试
                //     if(err){
                //         res.json({
                //             status:"500",
                //             result_kind:"ERROR",
                //             result:{
                //                 msg:"服务器发生异常，请重试！"
                //             }
                //         })
                //     }else{
                //         res.json({
                //             status:'200',
                //             result_kind :'SUCCESS',
                //             result: {
                //                 'cartList' : goodsItem
                //             }
                
                //         })
                //     }
                // })
 

            }
        }
    })
})


//销量升序排列(已改)
router.post("/g_sales_upfind",async function(req, res,next){
    var goods = eval(req.body.goods)
    var gooditem = [];
    var num=0;
    for(let i=0 ; i<goods.length ;i++){
        await Goods.findOne({'_id' : goods[i].g_id},function(err,doc){
                 gooditem.push(doc)
         })
     }
    for(let j=0 ; j<gooditem.length-1;j++)
    {
        for(var t=0;t<gooditem.length-1-j;t++)
        {
            if(gooditem[t].g_sales>gooditem[t+1].g_sales)
            {
                num = gooditem[t];
                gooditem[t] = gooditem[t+1];
                gooditem[t+1] = num;
            }
        }
    }
    res.json({
        status:"200",
        result_kind:"Goods",
        result:{
           'goods' : gooditem
        }
    })
}) 
//销量降序排列(已改)
router.post("/g_sales_downfind",async function(req, res,next){
    var goods = eval(req.body.goods)
    var gooditem = [];
    var num=0;
    for(let i=0 ; i<goods.length ;i++){
        await Goods.findOne({'_id' : goods[i].g_id},function(err,doc){
                 gooditem.push(doc)
         })
     }
    for(let j=0 ; j<gooditem.length-1;j++)
    {
        for(var t=0;t<gooditem.length-1-j;t++)
        {
            if(gooditem[t].g_sales<gooditem[t+1].g_sales)
            {
                num = gooditem[t];
                gooditem[t] = gooditem[t+1];
                gooditem[t+1] = num;
            }
        }
    }
    res.json({
        status:"200",
        result_kind:"Goods",
        result:{
           'goods' : gooditem
        }
    })
}) 



//价格升序排列(已改)
router.post("/g_cost_upfind",async function(req, res,next){
    var goods = eval(req.body.goods)
    var gooditem = [];
    var num=0;
    for(let i=0 ; i<goods.length ;i++){
        await Goods.findOne({'_id' : goods[i].g_id},function(err,doc){
                 gooditem.push(doc)
         })
     }
    for(let j=0 ; j<gooditem.length-1;j++)
    {
        for(var t=0;t<gooditem.length-1-j;t++)
        {
            if(gooditem[t].g_cost>gooditem[t+1].g_cost)
            {
                num = gooditem[t];
                gooditem[t] = gooditem[t+1];
                gooditem[t+1] = num;
            }
        }
    }
    res.json({
        status:"200",
        result_kind:"Goods",
        result:{
           'goods' : gooditem
        }
    })
}) 



//价格降序排列(已改)
router.post("/g_cost_downfind",async function(req, res,next){
    var goods = eval(req.body.goods)
    var gooditem = [];
    var num=0;
    for(let i=0 ; i<goods.length ;i++){
        await Goods.findOne({'_id' : goods[i].g_id},function(err,doc){
                 gooditem.push(doc)
         })
     }
    for(let j=0 ; j<gooditem.length-1;j++)
    {
        for(var t=0;t<gooditem.length-1-j;t++)
        {
            if(gooditem[t].g_cost<gooditem[t+1].g_cost)
            {
                num = gooditem[t];
                gooditem[t] = gooditem[t+1];
                gooditem[t+1] = num;
            }
        }
    }
    res.json({
        status:"200",
        result_kind:"Goods",
        result:{
           'goods' : gooditem
        }
    })
}) 



//返回库存不为0的商品(已改)
router.post('/findGoodsByNumber_notNull',async function(req,res){
    var goods = eval(req.body.goods)
    var goodsitem = []
    for(let i=0 ; i<goods.length ;i++){
       await Goods.findOne({'_id' : goods[i].g_id},function(err,doc){
            if(doc.g_number !=0){
                goodsitem.push(doc)
            }
        })
    }
    res.json({
        status:"200",
        result_kind:"Goods",
        result:{
            'goods' : goodsitem
        }
    })
})
//通过id查询具体商品信息(已改)
router.post("/findGoodByGoodId",function(req,res){
    var g_id = req.body.g_id
    Goods.find({'_id': g_id},function(err,doc){//模糊查询,查询条件为三个,或连接   (goods search)
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
                    result_kind:"Goods",
                    result:{
                        'goods' : doc
                    }
                })
            }else{
                res.json({
                    status:"200",
                    result_kind:"WARNING",
                    result:{
                        msg:"查无此商品"
                    }
                })
            }
        }
    })
}) 



 
//根据商店名查询当前商店商品数据及商店信息 (旧)
// router.post("/findShopDetailByShopName",function(req, res, next){
//     var s_name = req.body.s_name;
//     var shopList=[];
//     Shop.find({"s_name": s_name},function(err,doc){
//         if(err){
//             res.json({
//                 status:"500",
//                 result_kind:"ERROR",
//                 result:{
//                     msg:"服务器发生异常，请重试！"
//                 }
//             })
//         }else{
//             shopList.push(doc)
//         }        
//     })

//     Goods.find({"s_name" : s_name},function(err,gdoc){
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
//                 status:"200",
//                 result_kind:"Goods",
//                 result:{
//                     "shops" : shopList,
//                     "goods" : gdoc
//                 }
//             })
//         }
//     })
    
// })

//查询商品大类，请求任何东西（已改）
router.get("/findAllKind",function(req,res){ 
    Goods.find({'g_kind' : {$regex : ""}},function(err,doc){
        if(err){
            res.json({
                status:"500",
                result_kind:"ERROR",
                result:{
                    'msg' : "服务器发生异常，请重试！"
                }
            })
        }else{             
            let gooditem = []; 
            let kind=[];
            for(let i=0;i<doc.length;i++){
                gooditem.push(doc[i].g_kind)
            }

            for(var i = 0; i < gooditem.length; i++) {
                if (gooditem.indexOf(gooditem[i]) == i)
                kind.push({'g_kind':gooditem[i]});
                }
            res.json({
                status:"200",
                result_kind:"Goods",
                result:{
                    'goods' : kind
                }
            })
        }
    })
})

//通过商店名返回小类和图(已改)
router.post("/findScAndScpByShopname",function(req,res){ 
    var s_name = req.body.s_name;
    var sc=[];
    Goods.find({"s_name" : s_name},function(err,doc){
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
                let gooditem = [];                               //查询并返回多个数组
                let gooditemPic = []
                for(let i=0 ; i<doc.length;i++){
                    gooditem.push(doc[i].g_sc)
                    gooditemPic.push(doc[i].g_scp)
                }
                for(let i = 0; i < gooditem.length; i++) {
                    if (gooditem.indexOf(gooditem[i]) == i)
                    sc.push({'g_sc':gooditem[i],'g_scp':gooditemPic[i]});
                  }
                res.json({
                    status:"200",
                    result_kind:"Goods",
                    result:{
                       'goods' : sc
                    }
                })
            }
        }
    })
})

//通过大类检索小类(前端要求)（已改）
router.post("/kindAndSc",function(req,res,next){
    var g_kind = req.body.g_kind;
    var sc=[];
	Goods.find({"g_kind" : g_kind},function(err,doc){
		if(err){
			res.json({
				status:"500",
				result_kind : "ERROR",
				result : {
					msg:"与服务器连接失败"
				}
			})
		}else{
            let gooditem = {};
            gooditem.g_sc = []
            gooditem.g_scp = []    
            for(let i=0 ; i<doc.length;i++){
                gooditem.g_sc.push(doc[i].g_sc)
                gooditem.g_scp.push(doc[i].g_scp)
            }
            
            for(var i = 0; i < gooditem.g_sc.length; i++) {
                if (gooditem.g_sc.indexOf(gooditem.g_sc[i]) == i)
                sc.push({'g_sc':gooditem.g_sc[i],'g_scp':gooditem.g_scp[i]});
              }
			res.json({
				status:"200",
				result_kind : "Goods",
				result : {
					"goods" : sc
				}
			})
		}
	})
})	

//通过小类检索商品（已改）
router.post("/findGoodsBySC",function(req,res){
    var g_sc = req.body.g_sc
    Goods.find({"g_sc" : g_sc},function(err,doc){
     if(err){
      res.json({
       status:"500",
       result_kind : "ERROR",
       result : {
        msg:"与服务器连接失败"
       }
      })
     }else{
      res.json({
       status : "200",
       result_kind : "Goods",
       result : {
        'goods' : doc
       }
      })
     }
    })
})
//通过商店名返商品（已改）
router.post("/findShopDetailByShopName",function(req,res){
	var s_name = req.body.s_name	
	Goods.find({"s_name" : s_name},function(err,doc){
		if(err){
			res.json({
				status : "500",
                result_kind:"ERROR",
                result:{
                    'msg' : "服务器发生异常，请重试！"
                }
			})
		}else{
			var GoodsList = []
			doc.forEach(function(el,index){
				for(var i=0;i<GoodsList.length;i++){
					if(GoodsList[i].g_sc == el.g_sc){
						GoodsList[i].goodInfo.push({
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
            GoodsList.push({
				g_sc : el.g_sc,
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
                result_kind:"Goods",
                result:{
                    'goods' : {
                        GoodsList : GoodsList
                    }
                }				
		})
		}
	
	})
})
module.exports = router;
