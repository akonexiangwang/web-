//导入定义验证规则的模块
const joi = require("joi");

//定义验证规则
const identifier = joi.number().integer().required();
const name = joi.string().required();
const price = joi.number().required();
const type = joi.string().required();
const date = joi.required();
const id = joi.number().integer().min(1).required();
const username = joi.string().alphanum().min(2).max(10).required();
const borrowdate = joi.required();
const status = joi.required();
const applicant = joi.required();
const lenddate = joi.required();
const jh_manager_status = joi.required();
const jh_status = joi.required();
const principal = joi.required();

//向外共享验证规则对象
//验证规则对象 - 添加资产分类
exports.add_cate_schema = {
  body: {
    identifier,
    name,
    price,
    type,
    date,
  },
};

//验证规则对象 - 编辑资产分类
exports.edit_cate_schema = {
  body: {
    identifier,
    name,
    price,
    type,
    date,
    id,
  },
};

//验证规则对象 - 删除资产
exports.delete_cate_schema = {
  params: {
    id,
  },
};

// exports.transfer_cate_schema = {
//   body: {
//     username,
//     borrowdate,
//     identifier,
//   },
// };

// exports.repair_cate_schema = {
//   id,
//   identifier,
//   name,
//   date,
//   status
// };

exports.rent_cate_schema = {
  body: {
    id,
    identifier,
    name,
    applicant,
    borrowdate,
    lenddate,
    principal,
    // jh_manager_status,
    // jh_status,
  },
};
