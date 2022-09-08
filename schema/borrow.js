const joi = require("joi");

// const id = joi.number().integer().min(1).required();
const identifier = joi.number().integer().required();
const borrowdate = joi.required();
const lenddate = joi.required();
const username = joi.string().alphanum().min(2).max(10).required();
const id = joi.number().integer().min(1).required();
const principal = joi.required();

//向外共享验证规则对象
//验证规则对象 - 借出资产
exports.get_borrow_schema = {
  body: {
    identifier,
    borrowdate,
    lenddate,
    username,
    principal,
  },
};

//归还资产
exports.return_schema = {
  params: {
    id,
  },
};
