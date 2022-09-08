const express = require("express");
const router = express.Router();

const userinfo_handler = require("../router_handler/userinfo");

//获取用户信息的路由模块
router.get("/getUserInfo", userinfo_handler.getUserInfo);

//用户权限分配的路由模块
router.post("/authority", userinfo_handler.setAuthority);

//更换头像的路由模块
router.post("/avatar", userinfo_handler.changeAvatar);

module.exports = router;
