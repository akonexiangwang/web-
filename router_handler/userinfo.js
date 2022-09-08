//导入数据库操作模块
const db = require("../db/index");
var multiparty = require("multiparty");
//导入生成Token的包
const jwt = require("jsonwebtoken");
const config = require("../config");
const fs = require("fs");
// const Buffer = require("buffer");
//获取用户信息的路由处理函数
exports.getUserInfo = (req, res) => {
  let sql = `select * from users where id != 11`;
  if (req.query.pattern !== undefined || req.query.pattern.length > 0) {
    sql += ` and name like '%${req.query.pattern}%'`;
  }
  sql += ` order by id asc`;
  db.query(sql, (err, results) => {
    if (err) return res.cc(err);
    res.send({
      status: 0,
      message: "获取用户信息成功",
      data: results,
    });
  });
};

//用户权限分配的路由处理函数
exports.setAuthority = (req, res) => {
  const sql = `update users set identify =? where name = ? `;
  db.query(sql, [req.body.type, req.body.name], (err, results) => {
    if (err) return res.cc(err);
    if (results.affectedRows !== 1) return res.cc("权限分配失败!");
    res.cc("权限分配成功！", 0);
  });
};

//更换头像的路由处理函数
exports.changeAvatar = (req, res) => {
  // const sql = `update users set user_pic=? where name=?`;
  // db.query(sql, [req.body.avatar, req.body.name], (err, results) => {
  //   if (err) return res.cc(err);
  //   if (results.affectedRows !== 1) return res.cc("更换头像失败!");
  //   res.cc("更换头像成功！", 0);
  // });
  var form = new multiparty.Form();
  form.on("part", function (part) {
    if (!part.filename) return;
    if (part.name !== "file") return part.resume();
    image = {};
    image.filename = part.filename;
    image.size = 0;
    image.buf = [];
    part.on("data", function (buf) {
      image.size += buf.length;
      image.buf.push(...buf);
    });
    Buffer.from(image.buf);

    form.on("close", function () {
      fs.writeFileSync(
        `upload/${image.filename}`,
        Buffer.from(image.buf),
        function (err) {
          if (err) {
            res.cc("图片上传失败！");
          }
        }
      );
      const sql = `update users set user_pic=? where id=?`;
      // console.log(req.user.id);
      db.query(sql, [image.filename, req.user.id], (err, results) => {
        if (err) return res.cc(err);
        if (results.affectedRows !== 1) return res.cc("上传图片失败！");
        const sql = `select * from users where id = ?`;
        //执行sql语句，根据用户名查询用户的信息
        db.query(sql, req.user.id, (err, results) => {
          //执行sql语句失效
          if (err) {
            return res.cc(err);
          }

          //TODO:在服务器端生成Token的字符串 password:'',user_pic:'' 快速提出密码和头像这种敏感信息
          const user = { ...results[0], password: "" };
          //   //对用户的信息进行加密，生成Token字符串
          //   //第一个参数：要加密的用户对象
          //   //第二个参数：加密时需要的秘钥的值
          //   //第三个参数：配置对象指定token有效期
          const tokenStr = jwt.sign(user, config.jwtSecretKey, {
            expiresIn: config.expiresIn,
          });
          //   console.log(tokenStr)
          //调用res.send()将token响应给客户端
          res.send({
            status: 0,
            message:
              "`图片上传成功！,文件大小：${image.size / 1024 / 1024}/mb`",
            token: "Bearer " + tokenStr,
          });
        });
      });
    });
  });
  form.parse(req);

  // console.log(req.body);
};
