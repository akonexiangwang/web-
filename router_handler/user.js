//导入数据库操作模块
const db = require("../db/index");

//导入bcryptjs这个包 用于对用户密码进行加密
const bcrypt = require("bcryptjs");

//导入生成Token的包
const jwt = require("jsonwebtoken");
//导入全局的配置文件
const config = require("../config");

//注册新用户的处理函数
exports.regUser = (req, res) => {
  //获取客户端提交到服务器的用户信息
  const userinfo = req.body;
  //对表单中的数据进行合法性的校验
  // if(!userinfo.username || !userinfo.password){
  //     return res.send({
  //         status:1,
  //         message:'用户名或密码不合法！'
  //     })
  // }

  //定义sql语句 查询用户名是否被占用
  const sqlStr = "select * from users where name = ?";
  db.query(sqlStr, [userinfo.name], (err, results) => {
    if (err) {
      //    return res.send({status:1,message:err.message})
      return res.cc(err);
    }
    //判断用户名是否被占用
    if (results.length > 0) {
      //    return res.send({status:1,message:'用户名被占用，请更换其他用户名！'})
      return res.cc("用户名被占用，请更换其他用户名！");
    }
    //TODO:用户名可以使用

    //调用bcrypt.hashSync()对密码进行加密
    //第二个参数10 表示随机盐的长度 一般都是10

    userinfo.password = bcrypt.hashSync(userinfo.password, 10);

    //插入数据
    //定义插入新用户的sql语句
    const sql = "insert into users set ? ";
    //调用db.query执行sql语句
    db.query(sql, userinfo, (err, results) => {
      //判断sql语句执行是否成功
      if (err) {
        //   return res.send({status:1,message:err.message})
        return res.cc(err);
      }
      //判断影响行数是否为1
      if (results.affectedRows !== 1) {
        //   return res.send({status:1,message:'注册用户失败，请稍后再试！'})
        return res.cc("注册用户失败，请稍后再试！");
      }
      //   res.send({status:0,message:'注册成功'})
      res.cc("注册成功", 0);
    });
  });
};

//登录的处理函数
exports.login = (req, res) => {
  //接收表单的数据
  const userinfo = req.body;
  //定义sql语句
  const sql = `select * from users where name = ?`;
  //执行sql语句，根据用户名查询用户的信息
  db.query(sql, userinfo.name, (err, results) => {
    //执行sql语句失效
    if (err) {
      return res.cc(err);
    }
    //执行sql语句成功，但是获取到的数据条数不等于1
    if (results.length !== 1) {
      return res.cc("您尚未注册，请注册后登录");
    }
    // TODO:判断密码是否正确
    const compareResult = bcrypt.compareSync(
      userinfo.password,
      results[0].password
    );
    if (!compareResult) {
      return res.cc("您的密码有误!");
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
      message: "登陆成功！",
      token: "Bearer " + tokenStr,
    });
  });
};

//定义获取用户信息的处理函数
