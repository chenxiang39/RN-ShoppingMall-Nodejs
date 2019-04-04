var Goods = require('../mongodb/Schema/goods');
var User = require('../mongodb/Schema/users')
var express = require('express');
var router = express.Router();
//用户添加评论
router.post('/AddComment',async function(req,res){
    var u_name = req.body.u_name
    var g_id =req.body.g_id
    var comment = req.body.comment
    await Goods.findOne({"_id" : g_id},function(err,doc){
        if(err){
            res.json({
                status:'500',
                result_kind : "ERROR",
                result : {
                    'msg' : "服务器发生异常，请重试！"
                }
            })
        }else{

            var goodsitem = eval(doc.g_comment)
            if(doc.g_comment == ""){
                var createDate = Date.now()
                var c_id = createDate.toString(16)
                var g_comment = {
                    u_name : u_name,
                    c_id : c_id,
                    c_ct : createDate,
                    c_comment : comment,
                }
                doc.g_comment.push(g_comment)
                doc.save(function(err1,doc1){
                    if(err1){
                        res.json({
                            status:'500',
                            result_kind : "ERROR",
                            result : {
                                'msg' : "服务器发生异常，请重试！"
                            }
                        })
                    }else {
                        res.json({
                            status:"200",
                            result_kind:"SUCCESS",
                            result:{
                                'msg' : "您已成功评论！"
                            }
                        })
                    }
                })                 
            }else{
                let middle = 0;
                for(let i=0 ; i<goodsitem.length;i++){
                    if(goodsitem[i].u_name == u_name){
                        middle=0; 
                        break;
                    }else{
                        middle++;
                    }   
                }
                if(middle==0){
                    res.json({
                        status:"200",
                        result_kind:"WARNING",
                        result:{
                            msg:"您已评论过该商品"
                        }
                    })
                }else{
                    var createDate = Date.now()
                    var c_id = createDate.toString(16)
                    var g_comment = {
                        c_id : c_id,
                        u_name : u_name,
                        c_ct : createDate,
                        c_comment : comment,
                    }
            
                    doc.g_comment.push(g_comment)
                    doc.save(function(err1,doc1){
                        if(err1){
                            res.json({
                                status:'500',
                                result_kind : "ERROR",
                                result : {
                                    'msg' : "服务器发生异常，请重试！"
                                }
                            })
                        }else {
                            res.json({
                                status:"200",
                                result_kind:"SUCCESS",
                                result:{
                                    'msg' : "您已成功评论！"
                                }
                            })
                        }
                    })
                }
            }

        }
    })

    await User.findOne({"u_name" : u_name},function(err,userdoc){
        if(err){
            res.json({
                status:'500',
                result_kind : "ERROR",
                result : {
                    'msg' : "服务器发生异常，请重试！"
                }
            })
        }else{
            var commentitem = eval(userdoc.u_comment)
            if(commentitem == ""){
                var createDate = Date.now()
                var c_id = createDate.toString(16)
                var u_comment = {
                    u_name : u_name,
                    c_ct : createDate,
                    c_comment : comment,
                    c_id : c_id,
                    _id : g_id
                }
        
                userdoc.u_comment.push(u_comment)
                userdoc.save()                
            }else{
                let middle = 0;
                for(let i=0 ; i<commentitem.length;i++){
                    if(commentitem[i]._id == g_id){
                        middle=0; 
                        break;
                    }else{
                        middle++;
                    }   
                }
                if(middle!=0){
                    var createDate = Date.now()
                    var c_id = createDate.toString(16)
                    var u_comment = {
                        name : u_name,
                        c_ct : createDate,
                        c_comment : comment,
                        c_id : c_id,
                        _id : g_id
                    }
            
                    userdoc.u_comment.push(u_comment)
                    userdoc.save()
                }
            }

        }
    })
})


module.exports = router;