//这是资产分类的路由模块

const express = require("express");
const router = express.Router();

//导入资产分类的路由模块
const asset_handler = require("../router_handler/asset");

//导入验证数据的中间件
const expressJoi = require("@escook/express-joi");
//导入需要的验证规则对象
const {
  add_cate_schema,
  edit_cate_schema,
  delete_cate_schema,
  transfer_cate_schema,
  rent_cate_schema,
} = require("../schema/asset");

//这是超级管理员获取资产分类列表数据的路由
router.get("/cates", asset_handler.getAsset);

//这是普通管理员获取资产分类的数据
router.get("/manager/cates", asset_handler.managerGetAsset);

//这是新增资产分类的接口
router.post("/add", expressJoi(add_cate_schema), asset_handler.addAssetCates);

//这是编辑资产分类的接口
router.post(
  "/edit",
  expressJoi(edit_cate_schema),
  asset_handler.editAssetCates
);

//这是根据id删除资产分类的接口
router.get(
  "/delete/:id",
  expressJoi(delete_cate_schema),
  asset_handler.deleteById
);

//这是划拨资产的接口
router.post("/transfer", asset_handler.transferAssetCates);

//这是报修资产的接口
router.post("/service", asset_handler.serviceAssetCates);

//这是student借出资产的接口
router.post(
  "/rent",
  expressJoi(rent_cate_schema),
  asset_handler.rentAssetCates
);
//这是资产管理界面获取管理员
router.post("/manager/username", asset_handler.managerUsername);
//这是资产管理界面获取教职工
router.post("/student/username", asset_handler.studentUsername);
module.exports = router;
