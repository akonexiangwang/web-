//这是借还管理路由模块

//导入数据库操作模块

const db = require("../db/index");

//这是普通管理员获取借出管理数据的路由处理函数
exports.getBorrow = (req, res) => {
  const sql = `select * from borrow where principal=? order by id asc `;
  db.query(sql, req.user.name, (err, results) => {
    if (err) return res.cc(err);
    res.send({
      status: 0,
      message: "获取数据成功",
      data: results,
    });
  });
};

//这是学生获取借还管理数据的处理函数
exports.getStudentBorrow = (req, res) => {
  const sql = `select * from borrow where applicant=? order by id asc `;
  db.query(sql, req.user.name, (err, results) => {
    if (err) return res.cc(err);
    res.send({
      message: "获取数据成功！",
      status: 0,
      data: results,
    });
  });
};

//这是资产部管理员获取借还管理数据的路由处理函数
exports.getAmoBorrow = (req, res) => {
  const sql = `select * from borrow order by id asc `;
  db.query(sql, (err, results) => {
    if (err) return res.cc(err);
    res.send({
      status: 0,
      message: "获取数据成功",
      data: results,
    });
  });
};

//通过借出申请的处理函数
exports.passBorrow = (req, res) => {
  const sql = `update borrow set jh_status=1,jh_manager_status=1 where id=?`;
  db.query(sql, req.params.id, (err, results) => {
    if (err) return res.cc(err);
    if (results.affectedRows !== 1) return res.cc("通过申请失败！");
    res.cc("通过申请成功!", 0);
  });
};

//驳回借出申请的路由模块
exports.rejectBorrow = (req, res) => {
  const sql = `update borrow set jh_status=3,jh_manager_status=3 where id=?`;
  db.query(sql, req.params.id, (err, results) => {
    if (err) return res.cc(err);
    if (results.affectedRows !== 1) return res.cc("驳回申请失败！");
    // res.cc("驳回成功!", 0);
    const sql = `update asset_category set manager_status = 0 where id = ?`;
    db.query(sql, req.params.id, (err, results) => {
      if (err) return res.cc(err);
      if (results.affectedRows !== 1) return res.cc("驳回申请失败！");
      res.cc("驳回成功！", 0);
    });
  });
};

//归还资产的路由处理函数
exports.returnAsset = (req, res) => {
  const sql = `update borrow set jh_status=1,jh_manager_status=1 where id=?`;
  db.query(sql, req.params.id, (err, results) => {
    if (err) return res.cc(err);
    if (results.affectedRows !== 1) return res.cc("归还资产失败1！");
    const sql = `update asset_category set manager_status=0 where id=?`;
    // console.log(req.params);
    db.query(sql, req.params.id, (err, results) => {
      if (err) return res.cc(err);
      if (results.affectedRows !== 1) return res.cc("归还资产失败2！");
      res.cc("归还资产成功！", 0);
    });
  });
};

//删除资产的路由处理函数
exports.deleteAsset = (req, res) => {
  const sql = `delete from borrow where id=?`;
  db.query(sql, req.params.id, (err, results) => {
    // console.log(req.params.id);
    if (err) return res.cc(err);
    if (results.affectedRows !== 1) return res.cc("删除数据失败！");
    res.cc("删除数据成功！", 0);
  });
};
