const joi = require("joi");

const id = joi.number().integer().min(1).required();
const name = joi.string().required();
const price = joi.number().required();
const type = joi.string().required();
const date = joi.required();
const applicant = joi.required();
const reason = joi.required();
const amo_status = joi.required();

//向外共享验证规则对象

//申请资产 -- 普通管理员
exports.add_purchase_schema = {
  body: {
    name,
    price,
    type,
    date,
    applicant,
    reason,
  },
};

//申请资产--超级管理员
exports.add_amoPurchase_schema = {
  body: {
    name,
    price,
    type,
    date,
    applicant,
    reason,
    amo_status,
  },
};

//修改资产
exports.edit_purchase_schema = {
  body: {
    id,
    name,
    price,
    type,
    date,
    applicant,
    reason,
  },
};

//删除采购资产
exports.delete_purchase_schema = {
  params: {
    id,
  },
};

//通过资产
exports.pass_purchase_schema = {
  params: {
    id,
  },
};
//驳回资产
exports.reject_purchase_schema = {
  params: {
    id,
  },
};
