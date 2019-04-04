var User = require('../mongodb/Schema/users');
var express = require('express');
var router = express.Router();

//查询用户地址（已改）
router.post("/findAddressListByUsername",function(req, res, next){
    var u_name=req.body.u_name;
    User.findOne({"u_name":u_name},function(err,doc){
        if(err){
            res.json({
                status:'500',
                result_kind:"ERROR",
                result:{
                    msg:"服务器发生异常，请重试！"
                }
            })
        }else{
            res.json({
                status:'200',
                result_kind:"User",
                result:{
                    'User':{
                      addressList : doc.addressList
                    }
                }
            })
        }
    })
})

//删除地址
router.post("/D_addressList",function(req, res, next){
    var u_name = req.body.u_name,
        a_name = req.body.a_name;
    User.update({ 
      "u_name":u_name
    },{
      $pull:{
        'addressList':{ 
          'a_name':a_name 
        }
      } 
    }, function (err,doc) {
        if(err){
          res.json({
              status:'500',
              result_kind:"ERROR",
              result:{
                  msg:"服务器发生异常，请重试！"
              }
          });
        }else{
          res.json({ 
            status:'200',
            result_kind:'SUCCESS',
            result:{
                msg:"删除成功！"
            }
          });
        }
    });
})


//添加用户地址（已改）
router.post("/A_addressList",function(req, res){
    var u_name = req.body.u_name
        a_name = req.body.a_name
        tellphone = req.body.tellphone
    User.findOne({ "u_name": u_name},function(err,doc){
        if(err){
          res.json({
              status:"500",
              result_kind:"ERROR",
              result:{
                 msg:"服务器发生异常，请重试！"
              }
          })
        }else{
          if(doc.addressList != ""){
            let middle=0;
              for(let i=0 ; i<doc.addressList.length;i++){
                if(doc.addressList[i].a_name==a_name){
                  middle++;
                }
              }
              if(middle !=0){
                res.json({
                  status : "200",
                  result_kind : "WARNING",
                  result:{
                    msg:"地址已存在，请换地址！"
                  }
                })
              }else{
                doc.addressList.push({
                  a_name : a_name,
                  tellphone : tellphone,
                  a_state : 0
                })
                doc.save();
                res.json({
                  status : "200",
                      result_kind:"SUCCESS",
                      result:{
                          msg:"地址添加成功！"
                      }
                })
              }  
          }else{
              doc.addressList.push({
                a_name : a_name,
                tellphone : tellphone,
                a_state : 1
              })
              doc.save();
              res.json({
                status : "200",
                        result_kind:"SUCCESS",
                        result:{
                          msg:"地址添加成功！"
                      }
              })
          }

        }
    });        

})


//更改默认地址(已改)
router.post("/changeDefaultAddress",function(req,res){
	var u_name = req.body.u_name
	var a_name = req.body.a_name
	User.findOne({"u_name" : u_name},function(err,doc){
        if(err){
          res.json({
              status:'500',
              result_kind:"ERROR",
              result:{
                  msg:"服务器发生异常，请重试！"
              }
          })
      }else{
          for(let i=0;i<doc.addressList.length;i++){
            if(doc.addressList[i].a_state == true){
                doc.addressList[i].a_state=false;
          }
            if(doc.addressList[i].a_name == a_name){
            doc.addressList[i].a_state=true;
            doc.save();
            }
          }
            res.json({
            status : "200",
            result_kind : "SUCCESS",
            result:{
              'msg' : "已成功设置为默认地址"
            }
      })  
      }	
	})
 })





//编辑地址(已改)
router.post("/EXchangeAddress",function(req,res){
  var u_name =req.body.u_name
  var a_name =req.body.a_name
  var a_exchange = req.body.a_exchange
  var t_exchange = req.body.t_exchange
  User.findOne({"u_name" : u_name},function(err,doc){
    if(err){
      res.json({
        status:'500',
        result_kind:"ERROR",
        result:{
            msg:"服务器发生异常，请重试！"
        }
    })      
    }else{
      var middle = 0;
      for(let i=0;i<doc.addressList.length;i++){
        if(a_exchange == doc.addressList[i].a_name){
          middle++;
        }
      }
      if(middle !=0){
        res.json({
          status : "200",
          result_kind : "WARNING",
          result : {
            'msg' : "地址已存在,请更换地址！"
          }
        })
      }else{
        for(let i=0;i<doc.addressList.length;i++){
          if(a_name == doc.addressList[i].a_name){
            doc.addressList[i].a_name = a_exchange
            doc.addressList[i].tellphone=t_exchange
          }
        }
        doc.save();
        res.json({
          status : "200",
          result_kind : "SUCCESS",
          result : {
            'msg' : "成功更改地址"
          }
        })
      }
    }
  })
})

//获取默认地址(已改)
router.post("/loadDefaultAddress",function(req,res){
  var u_name =req.body.u_name
  User.findOne({"u_name" : u_name},function(err,doc){
      if(err){
        res.json({
          status:'500',
          result_kind:"ERROR",
          result:{
              msg:"服务器发生异常，请重试！"
          }
      })   
      }else{
        if(doc){
          var middle =0;
          var address = [];
          if(doc.addressList.length == 0){
              address.push({})
          }
          else{
            for(let i=0;i<doc.addressList.length;i++){
                if(doc.addressList[i].a_state == 1){
                  address.push(doc.addressList[i])
                }
            }
          }
          res.json({
            status : "200",
            result_kind : "User",
            result : {
              'User' : {
                'addressList' : address
              }
            }
          })      
        }else{
          res.json({
            status : "200",
            result_kind : "User",
            result : ""
          })
        }
      }
  })
})
module.exports = router;