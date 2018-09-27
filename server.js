const express = require('express');
const config = require('./config/index');
var port = process.env.PORT || config.build.port;
var app = express();
var router = express.Router();
router.get('/',function(req,res,next) {
	req.url = '/index.html';
	next();
});
app.use(router);
var appData = require('./data.json');//加载本地数据
// 本地数据里面的分类
var seller = appData.seller;
var goods = appData.goods;
var ratings = appData.ratings;
app.get('/api/seller',(req,res) => {
  // 返回json格式的数据
  res.json({
    errno:0,
    data:seller
  })
}),
app.get('/api/goods',(req,res) => {
  res.json({
    errno:0,
    data:goods
  })
}),
app.get('/api/ratings',(req,res) => {
  res.json({
    errno:0,
    data:ratings
  })
})


app.use(express.static('./dist'));
app.listen(port);