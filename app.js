//导入express
const express = require("express");

//创建服务器的实例对象
const app = express();
const joi = require("joi");

//导入并配置cors中间件，解决接口跨域问题
const cors = require("cors");
app.use(cors());

// const customBodyParse = require('./custom-body-parser')
// app.use(customBodyParse)

//设置静态目录
app.use(express.static("upload"));

//配置并解析表单数据的中间件,注意：这个中间件只能解析application/x-www-form-urlencoded 格式的表单数据
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//一定要在路由之前，封装res.cc函数
app.use((req, res, next) => {
  //status默认值为1 表示失败的情况
  //err的值，可能是一个错误对象，也可能是一个错误的描述字符串

  res.cc = function (err, status = 1) {
    res.send({
      status,
      message: err instanceof Error ? err.message : err,
    });
  };
  next();
});

//一定要在路由之前配置解析Token的中间件
const expressJWT = require("express-jwt");
const config = require("./config");

app.use(
  expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/^\/api/] })
);

//导入并使用用户路由模块
const userRouter = require("./router/user");
// '/api' 这个参数表示今后在使用router中的路由时 必须加入这个前缀
app.use("/api", userRouter);

//导入并使用资产分类的路由模块
const assetRouter = require("./router/asset");
app.use("/my/asset", assetRouter);

//导入并使用借还管理的路由模块
const borrowRouter = require("./router/borrow");
app.use("/my", borrowRouter);

//导入并使用用户信息路由模块
const userinfo = require("./router/userinfo");
app.use("/my/userinfo", userinfo);

//导入并使用采购资产路由模块
const purchase = require("./router/purchase_assets");
app.use("/my", purchase);

//导入并使用维修资产的路由模块
const repair = require("./router/repair_asset");
app.use("/my/repair", repair);

//定义错误级别的中间件
app.use((err, req, res, next) => {
  console.log(123456, joi);

  //校验失败导致的错误
  if (err instanceof joi.ValidationError) {
    return res.cc(err);
  }
  //身份认证失败后的错误(token过期)
  if (err.name === "UnauthorizedError") {
    return res.cc("身份认证失败！");
  }
  //未知的错误
  res.cc(err);
});

//启动服务器
app.listen(3007, () => {
  console.log("api server running at http://127.0.0.1:3007");
});
