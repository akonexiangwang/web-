//这是维修管理的路由模块
const express = require("express");
const router = express.Router();

const repair_handler = require("../router_handler/repair_asset");

//超级管理员获取维修管理的数据
router.get("/getRepair", repair_handler.getRepair);

//普通管理员获取维修管理的数据
router.get("/getManagerRepair", repair_handler.managerGetRepair);

//超级管理员通过维修管理的接口
router.get("/pass/:id", repair_handler.passRepair);

//超级管理员驳回维修
router.get("/reject/:id", repair_handler.rejectRepair);

//维修完成
router.get("/finish/:id", repair_handler.finishRepair);

//删除维修管理的数据
router.get("/deleteRepair/:id", repair_handler.deleteRepair);

module.exports = router;
