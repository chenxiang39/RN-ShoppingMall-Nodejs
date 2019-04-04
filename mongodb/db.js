
const database = ()=>{
var mongoose = require('mongoose');
/* 连接*/
mongoose.connect('mongodb://127.0.0.1:3000/sc', { useNewUrlParser: true });   
     

/**连接成功 */
mongoose.connection.on('connected',function(){
    console.log('Mongoose connection open to' +'mongodb://127.0.0.1:3000/sc'); 
});

/**连接失败 */
 mongoose.connection.on('error',function(){
     console.log('Mongoose connection error' +Error); 
 });

 /**连接断开 */
 mongoose.connection.on('disconnected',function(){
     console.log('Mongoose connection disconnected'); 
 });

}
// var MongoClient = require('mongodb').MongoClient;
// var url = 'mongodb://localhost:3000/exercise';
// MongoClient.connect(url, function (err, db) {
//     if (err) throw err;
//     console.log('数据库已创建');
//     var dbase = db.db("runoob");
//     dbase.createCollection('site', function (err, res) {
//         if (err) throw err;
//         console.log("创建集合!");
//         db.close();
//     });
// });
module.exports = database;