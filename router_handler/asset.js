//这是路由处理函数模块

//导入数据库操作模块
const db = require("../db/index");
const moment = require("moment");

//获取资产分类列表的处理函数
exports.getAsset = (req, res) => {
  //定义查询分类的sql语句
  const sql = `select * from asset_category order by id asc `;
  // req.body.date = moment(req.body.date).format("YYYY-MM-DD HH:mm:ss");
  console.log(req);
  console.log(res);
  db.query(sql, (err, results) => {
    if (err) return res.cc(err);

    res.send({
      status: 0,
      message: "获取资产分类成功",
      data: results,
    });
  });
};

//普通管理员获取资产分类列表的处理函数
exports.managerGetAsset = (req, res) => {
  //定义查询分类的sql语句
  const sql = `select * from asset_category where status=1 and principal=? order by id asc `;
  // console.log(req.user.name);
  db.query(sql, req.user.name, (err, results) => {
    if (err) return res.cc(err);
    res.send({
      status: 0,
      message: "获取资产分类成功",
      data: results,
    });
  });
};

//新增资产分类的处理函数
exports.addAssetCates = (req, res) => {
  //定义查重的语句
  const sql = `select * from asset_category where identifier=?`;
  db.query(sql, req.body.identifier, (err, results) => {
    //判断是否执行sql语句失败
    if (err) return res.cc(err);

    //判断数据的length
    if (results.length === 1) return res.cc("资产编号被占用,请重新输入");

    //定义插入资产分类的sql语句
    const sql = `insert into asset_category set ?`;
    req.body.date = moment(req.body.date).format("YYYY-MM-DD HH:mm:ss");
    //执行插入资产分类的sql语句
    db.query(sql, req.body, (err, results) => {
      if (err) return res.cc(err);
      if (results.affectedRows !== 1) return res.cc("新增资产分类失败！");
      res.cc("新增资产分类成功！", 0);
    });
  });
};

//编辑资产分类的处理函数
exports.editAssetCates = (req, res) => {
  //定义查重的sql语句
  const sql = `select * from asset_category where id<>? and identifier=?`;
  //调用db.query()执行查重的sql语句
  db.query(sql, [req.body.id, req.body.identifier], (err, results) => {
    //执行sql语句失败
    if (err) return res.cc(err);
    //执行成功 给判断
    if (results.length === 1) return res.cc("资产编号被占用");

    //定义更新资产分类的sql语句
    const sql = `update asset_category set ? where id = ?`;
    req.body.date = moment(req.body.date).format("YYYY-MM-DD HH:mm:ss");
    //执行sql
    db.query(sql, [req.body, req.body.id], (err, results) => {
      if (err) return res.cc(err);
      if (results.affectedRows !== 1) return res.cc("更新资产分类失败！");
      res.cc("更新资产分类成功！", 0);
    });
  });
};

//删除资产分类的接口
exports.deleteById = (req, res) => {
  //定义删除的sql语句
  const sql = `delete from asset_category where id=?`;
  //执行sql
  db.query(sql, req.params.id, (err, results) => {
    if (err) return res.cc(err);
    if (results.affectedRows !== 1) return res.cc("资产报废失败！");
    res.cc("资产报废成功！", 0);
  });
};

//划拨资产分类的处理函数
exports.transferAssetCates = (req, res) => {
  const sql = `select * from users where name=? and identify='manager' `;
  db.query(sql, req.body.principal, (err, results) => {
    if (err) return res.cc(err);
    if (results.length === 0) return res.cc("数据库中没有此人！");
    const sql = `update asset_category set status =1,manager_status=0,principal=? where id =?`;
    db.query(sql, [req.body.principal, req.body.id], (err, results) => {
      console.log(req.body);
      if (err) return res.cc(err);
      if (results.affectedRows !== 1) return res.cc("划拨资产失败！");
      res.cc("划拨资产成功", 0);
    });
  });
};

//报修资产的处理函数
exports.serviceAssetCates = (req, res) => {
  const sql = `select * from repair_assets where id=?`;
  db.query(sql, req.body.id, (err, results) => {
    if (err) return res.cc(err);
    if (results.length === 1) {
      const sql = `delete from repair_assets where id=?`;
      db.query(sql, req.body.id, (err, results) => {
        if (err) return res.cc(err);
        if (results.affectedRows !== 1) return res.cc("报修失败1");
        const sql = `update asset_category set status =2,manager_status=2 where id=?`;
        // console.log(req.body);
        db.query(sql, req.body.id, (err, results) => {
          if (err) return res.cc(err);
          if (results.affectedRows !== 1) return res.cc("报修失败2");
          console.log(req.body);
          const sql = `insert into repair_assets set ?`;
          db.query(sql, req.body, (err, results) => {
            if (err) return res.cc(err);
            if (results.affectedRows !== 1) return res.cc("报修失败3！");
            res.cc("报修成功", 0);
          });
        });
      });
    } else {
      const sql = `update asset_category set status =2,manager_status=2 where id=?`;
      // console.log(req.body);
      db.query(sql, req.body.id, (err, results) => {
        if (err) return res.cc(err);
        if (results.affectedRows !== 1) return res.cc("报修失败2");
        console.log(req.body);
        const sql = `insert into repair_assets set ?`;
        db.query(sql, req.body, (err, results) => {
          if (err) return res.cc(err);
          if (results.affectedRows !== 1) return res.cc("报修失败3！");
          res.cc("报修成功", 0);
        });
      });
    }
  });
};

//借出资产的处理函数;
exports.rentAssetCates = (req, res) => {
  const sql = `select * from users where name=? and identify='student' `;
  db.query(sql, req.body.applicant, (err, results) => {
    if (err) return res.cc(err);
    if (results.length === 1) {
      const sql = `select * from borrow where id=? `;
      db.query(sql, req.body.id, (err, results) => {
        if (err) return res.cc(err);
        if (results.length === 1) {
          const sql = `delete from borrow where id=?`;
          db.query(sql, req.body.id, (err, results) => {
            console.log(3);
            if (err) return res.cc(err);
            if (results.affectedRows !== 1) return res.cc("借出资产失败！");
            const sql = `update asset_category set manager_status=1 where id=?`;
            db.query(sql, req.body.id, (err, results) => {
              req.body.borrowdate = moment(req.body.borrowdate).format(
                "YYYY-MM-DD HH:mm:ss"
              );
              req.body.lenddate = moment(req.body.lenddate).format(
                "YYYY-MM-DD HH:mm:ss"
              );

              if (err) return res.cc(err);
              if (results.affectedRows !== 1) return res.cc("借出资产失败2！");
              //插入到借还管理表格
              const sql = `insert into borrow set ?`;
              db.query(sql, req.body, (err, results) => {
                // console.log(req.body);
                if (err) return res.cc(err);
                if (results.affectedRows !== 1)
                  return res.cc("借出资产失败3！");
                res.cc("借出资产成功！", 0);
              });
            });
          });
        } else {
          const sql = `update asset_category set manager_status=1 where id=?`;
          db.query(sql, req.body.id, (err, results) => {
            req.body.borrowdate = moment(req.body.borrowdate).format(
              "YYYY-MM-DD HH:mm:ss"
            );
            req.body.lenddate = moment(req.body.lenddate).format(
              "YYYY-MM-DD HH:mm:ss"
            );

            if (err) return res.cc(err);
            if (results.affectedRows !== 1) return res.cc("借出资产失败2！");
            //插入到借还管理表格
            const sql = `insert into borrow set ?`;
            db.query(sql, req.body, (err, results) => {
              console.log(req.body);
              if (err) return res.cc(err);
              if (results.affectedRows !== 1) return res.cc("借出资产失败3！");
              res.cc("借出资产成功！", 0);
            });
          });
        }
      });
    } else {
      if (results.length !== 1) return res.cc("系统中没有此用户！");
    }
  });
};

exports.managerUsername = (req, res) => {
  let sql = `select name from users where identify = 'manager'`;
  if (req.body.principal != undefined && req.body.principal.length > 0) {
    sql += ` and name like '%${req.body.principal}%'`;
  }
  db.query(sql, (err, results) => {
    if (err) return res.cc(err);
    res.send({
      status: 0,
      message: "获取管理员名称成功",
      data: results,
    });
  });
};
exports.studentUsername = (req, res) => {
  let sql = `select name from users where identify = 'student'`;
  if (req.body.applicant != undefined && req.body.applicant.length > 0) {
    sql += ` and name like '%${req.body.applicant}%'`;
  }
  db.query(sql, (err, results) => {
    if (err) return res.cc(err);
    res.send({
      status: 0,
      message: "获取教职工名称成功",
      data: results,
    });
  });
};
