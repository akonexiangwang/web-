//导入数据库操作模块
const db = require("../db/index");
const moment = require("moment");

//超级管理员获取采购资产路由的处理函数
exports.getPurchase = (req, res) => {
  const sql = `select * from purchase_assets order by id asc`;
  db.query(sql, (err, results) => {
    if (err) return res.cc(err);
    res.send({
      status: 0,
      message: "获取采购数据成功！",
      data: results,
    });
  });
};

//普通管理员获取采购管理的路由处理函数
exports.managerGetPurchase = (req, res) => {
  const sql = `select * from purchase_assets where applicant=? order by id asc`;
  console.log(req.user);
  db.query(sql, req.user.name, (err, results) => {
    if (err) return res.cc(err);
    res.send({
      status: 0,
      message: "获取采购数据成功！",
      data: results,
    });
  });
};

//普通管理员采购资产的路由处理函数
exports.addPurchase = (req, res) => {
  req.body.date = moment(req.body.date).format("YYYY-MM-DD HH:mm:ss");
  const sql = `insert into purchase_assets set ?`;
  db.query(sql, req.body, (err, results) => {
    if (err) return res.cc(err);
    if (results.affectedRows !== 1) return res.cc("申请资产失败！");
    res.cc("申请资产成功！", 0);
  });
};

//超级管理员采购资产的路由处理函数
exports.addAmoPurchase = (req, res) => {
  req.body.date = moment(req.body.date).format("YYYY-MM-DD HH:mm:ss");
  console.log(req.body);
  const sql = `insert into purchase_assets set ?`;
  db.query(sql, req.body, (err, results) => {
    if (err) return res.cc(err);
    if (results.affectedRows !== 1) return res.cc("申请资产失败！");
    res.cc("申请采购资产成功！", 0);
  });
};

//修改资产的路由处理函数
exports.editPurchase = (req, res) => {
  req.body.date = moment(req.body.date).format("YYYY-MM-DD HH:mm:ss");
  const sql = `update purchase_assets set ? where id = ?`;
  db.query(sql, [req.body, req.body.id], (err, results) => {
    if (err) return res.cc(err);
    if (results.affectedRows !== 1) return res.cc("编辑采购资产失败！");
    res.cc("编辑采购资产成功!", 0);
  });
};

//删除采购资产的路由处理函数
exports.deletePurchase = (req, res) => {
  const sql = `delete from purchase_assets where id =?`;
  db.query(sql, req.params.id, (err, results) => {
    if (err) return res.cc(err);
    if (results.affectedRows !== 1) return res.cc("删除采购资产失败！");
    res.cc("删除采购资产成功！", 0);
  });
};

//通过采购资产的路由
exports.passPurchase = (req, res) => {
  const sql = `update purchase_assets set amo_status='1',status='1' where id=?`;
  db.query(sql, req.params.id, (err, results) => {
    if (err) return res.cc(err);
    if (results.affectedRows !== 1) return res.cc("操作失败！");
    res.cc("采购资产通过！", 0);
  });
};

//驳回采购资产的路由
exports.rejectPurchase = (req, res) => {
  const sql = `update purchase_assets set amo_status='2',status='2' where id=?`;
  db.query(sql, req.params.id, (err, results) => {
    if (err) return res.cc(err);
    if (results.affectedRows !== 1) return res.cc("操作失败！");
    res.cc("采购资产驳回！", 0);
  });
};
