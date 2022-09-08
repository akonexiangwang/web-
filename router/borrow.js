//这是借还管理路由模块
const express = require("express");
const router = express.Router();

const borrow_handler = require("../router_handler/borrow");

//导入验证数据的中间件
const expressJoi = require("@escook/express-joi");

//导入需要的验证规则对象
const { get_borrow_schema, return_schema } = require("../schema/borrow");

//这是获取借还管理数据的路由模块
router.get("/borrow", borrow_handler.getBorrow);

//这是学生获取借还管理数据的路由模块
router.get("/student/borrow", borrow_handler.getStudentBorrow);

//这是学生获取借还管理数据的路由模块
router.get("/amo/borrow", borrow_handler.getAmoBorrow);

//这是通过借出申请的路由模块
router.get("/pass/borrow/:id", borrow_handler.passBorrow);

// 这是驳回借出申请的路由模块
router.get("/reject/borrow/:id", borrow_handler.rejectBorrow);
//这是归还资产的路由模块
router.get(
  "/return/:id",
  expressJoi(return_schema),
  borrow_handler.returnAsset
);

//这是删除借还管理数据的路由接口
router.get("/delete/borrow/:id", borrow_handler.deleteAsset);

module.exports = router;
