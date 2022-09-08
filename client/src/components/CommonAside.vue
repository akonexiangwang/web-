<template>
  <el-menu
    :default-active="$route.path"
    class="el-menu-vertical-demo"
    @select="handleSelect"
    @open="handleOpen"
    @close="handleClose"
    :collapse="isCollapse"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
    :router="true"
  >
    <h3>{{ isCollapse ? "后台" : "城科资产管理系统" }}</h3>

    <div class="amo" v-if="user.identify == 'amo'">
      <el-menu-item
        v-for="subItem in noChildren"
        :index="subItem.url"
        :key="subItem.path"
      >
        <i :class="subItem.icon"></i>
        {{ subItem.name }}</el-menu-item
      >

      <el-submenu
        v-for="(item, index) in hasChildren"
        :index="'' + index"
        :key="item.path"
      >
        <template slot="title">
          <i :class="item.icon"></i>
          <span slot="title">{{ item.name }}</span>
        </template>

        <el-menu-item
          :index="cItem.url"
          v-for="cItem in item.children"
          :key="cItem.path"
        >
          {{ cItem.name }}
        </el-menu-item>
      </el-submenu>
    </div>

    <div class="manager" v-if="user.identify == 'manager'">
      <el-menu-item index="/Main/zcgl">
        <i class="iconfont icon-zichanguanli"></i>
        资产管理</el-menu-item
      >
      <el-menu-item index="/Main/wxgl">
        <i class="iconfont icon-weixiuguanli"></i>
        维修管理</el-menu-item
      >

      <el-menu-item index="/Main/jhgl">
        <i class="iconfont icon-i_4jiehuanguanli"></i>
        借还管理</el-menu-item
      >

      <el-menu-item index="/Main/cggl">
        <i class="iconfont icon-caigouguanli"></i>
        采购管理</el-menu-item
      >
    </div>

    <div class="student" v-if="user.identify == 'student'">
      <!-- <el-menu-item index="/Main/zcgl">
        <i class="iconfont icon-zichanguanli"></i>
        资产管理</el-menu-item
      > -->

      <el-menu-item index="/Main/jhgl">
        <i class="iconfont icon-i_4jiehuanguanli"></i>
        资产管理</el-menu-item
      >
    </div>
  </el-menu>
</template>

<script>
export default {
  created() {
    console.log(123, this.$route.path);
  },
  data() {
    return {
      props: ["default_active"],
      items: [
        {
          icon: "iconfont icon-zichanguanli",
          name: "资产管理",
          path: "zcgl",
          url: "/Main/zcgl",
        },
        {
          icon: "iconfont icon-shouye",
          name: "资产盘点",
          path: "home",
          url: "/Main/home",
        },
        {
          icon: "iconfont icon-caigouguanli",
          name: "采购管理",
          path: "cggl",
          url: "/Main/cggl",
        },
        {
          icon: "iconfont icon-weixiuguanli",
          name: "维修管理",
          path: "wxgl",
          url: "/Main/wxgl",
        },
        {
          icon: "iconfont icon-i_4jiehuanguanli",
          name: "借还管理",
          path: "jhgl",
          url: "/Main/jhgl",
        },

        {
          icon: "iconfont icon-caigouguanli",
          name: "权限管理",
          path: "qxgl",
          children: [
            {
              path: "yhgl",
              name: "用户管理",
              url: "/Main/qxgl/yhgl",
            },
          ],
        },
      ],
    };
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },

    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
  },
  computed: {
    //角色权限 拿到user
    user() {
      return this.$store.getters.user;
    },
    isCollapse() {
      return this.$store.state.isCollapse;
    },
    noChildren() {
      return this.items.filter((item) => !item.children);
    },
    hasChildren() {
      return this.items.filter((item) => item.children);
    },
  },
};
</script>

<style lang="less" scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
.el-menu {
  height: 100%;
  border: none;
  h3 {
    color: #fff;
    text-align: center;
    line-height: 48px;
  }
}
</style>
