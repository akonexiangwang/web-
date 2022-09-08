//导入数据库操作模块
const db = require("../db/index");

//超级管理员获取维修管理的数据的处理函数
exports.getRepair = (req, res) => {
  const sql = `select * from repair_assets`;
  db.query(sql, (err, results) => {
    if (err) return res.cc(err);
    res.send({
      message: "获取维修数据成功！",
      status: 0,
      data: results,
    });
  });
};

//普通管理员获取维修管理的数据的处理函数
exports.managerGetRepair = (req, res) => {
  const sql = `select * from repair_assets where applicant=?`;
  db.query(sql, req.user.name, (err, results) => {
    if (err) return res.cc(err);
    res.send({
      message: "获取维修数据成功！",
      status: 0,
      data: results,
    });
  });
};

//通过维修资产的路由处理函数
exports.passRepair = (req, res) => {
  const sql = `update repair_assets set status='1',amo_status='1' where id=?`;
  db.query(sql, req.params.id, (err, results) => {
    if (err) return res.cc(err);
    res.cc("维修申请已通过！", 0);
  });
};

//驳回维修申请
exports.rejectRepair = (req, res) => {
  const sql = `update repair_assets set status='2',amo_status='2' where id=?`;
  db.query(sql, req.params.id, (err, results) => {
    if (err) return res.cc(err);
    if (results.affectedRows !== 1) return res.cc("驳回失败1！");
    const sql = `update asset_category set status =1,manager_status=0 where id=?`;
    db.query(sql, req.params.id, (err, results) => {
      if (err) return res.cc(err);
      if (results.affectedRows !== 1) return res.cc("驳回失败2！");
      res.cc("维修申请已驳回！", 0);
    });
  });
};

//完成维修
exports.finishRepair = (req, res) => {
  const sql = `update repair_assets set status=4,amo_status=4 where id=?`;
  db.query(sql, req.params.id, (err, results) => {
    if (err) return res.cc(err);
    if (results.affectedRows !== 1) return res.cc("完成维修失败！");
    const sql = `update asset_category set manager_status=0,status=0,principal='' where id=?`;
    db.query(sql, req.params.id, (err, results) => {
      if (err) return res.cc(err);
      if (results.affectedRows !== 1) return res.cc("完成维修失败！");
      res.cc("维修完成！", 0);
    });
  });
};

//删除维修管理的路由处理函数
exports.deleteRepair = (req, res) => {
  const sql = `delete from repair_assets where id=?`;
  db.query(sql, req.params.id, (err, results) => {
    if (err) return res.cc(err);
    if (results.affectedRows !== 1) return res.cc("删除数据失败！");
    res.cc("删除数据成功！", 0);
  });
};
