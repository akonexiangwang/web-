const express = require("express");
const router = express.Router();

//导入验证数据的中间件
const expressJoi = require("@escook/express-joi");
const {
  add_purchase_schema,
  edit_purchase_schema,
  delete_purchase_schema,
  pass_purchase_schema,
  reject_purchase_schema,
  add_amoPurchase_schema,
} = require("../schema/purchase");

const purchase_handler = require("../router_handler/purchase_assets");
//超级管理员获取采购资产的接口
router.get("/purchase", purchase_handler.getPurchase);
//普通管理员获取采购资产的接口
router.get("/managerPurchase", purchase_handler.managerGetPurchase);

//普通管理员添加采购资产的接口
router.post(
  "/add/purchase",
  expressJoi(add_purchase_schema),
  purchase_handler.addPurchase
);

//超级管理员添加采购资产的接口
router.post(
  "/add/amoPurchase",
  expressJoi(add_amoPurchase_schema),
  purchase_handler.addAmoPurchase
);

//普通管理员修改采购资产的接口
router.post(
  "/edit/purchase",
  expressJoi(edit_purchase_schema),
  purchase_handler.editPurchase
);

//普通管理员删除采购资产的接口
router.get(
  "/delete/purchase/:id",
  expressJoi(delete_purchase_schema),
  purchase_handler.deletePurchase
);

//超级管理员通过资产采购的申请
router.get(
  "/pass/:id",
  expressJoi(pass_purchase_schema),
  purchase_handler.passPurchase
);

//超级管理员驳回资产采购的申请
router.get(
  "/reject/:id",
  expressJoi(reject_purchase_schema),
  purchase_handler.rejectPurchase
);

module.exports = router;
