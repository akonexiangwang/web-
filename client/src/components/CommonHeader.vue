<template>
  <header>
    <div class="l-content">
      <el-button
        @click="handleMenu"
        plain
        icon="el-icon-menu"
        size="mini"
      ></el-button>
      <!-- <h3 style="color: #fff">首页</h3> -->
    </div>

    <div class="r-content">
      <el-dropdown @command="setDialogInfo">
        <span>
          <img :src="'http://127.0.0.1:3007/' + user.user_pic" class="user" />
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="info">个人中心</el-dropdown-item>
          <el-dropdown-item command="uploadHeadImg">更换头像</el-dropdown-item>
          <input
            type="file"
            accept="image/gif, image/jpeg"
            @change="handleFile"
            class="hiddenInput"
            ref="setAvatar"
          />
          <el-dropdown-item command="logout">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </header>
</template>

<script>
export default {
  name: "CommonHeader",
  data() {
    return {};
  },
  methods: {
    // 打开图片上传
    uploadHeadImg: function () {
      console.log(111);
      this.$refs["setAvatar"].click();
      // this.$el.querySelector(".hiddenInput").click();
    },
    // 将头像显示
    handleFile: function (e) {
      let $target = e.target || e.srcElement;
      let file = $target.files[0];
      // var reader = new FileReader();
      // reader.onload = (data) => {
      //   let res = data.target || data.srcElement;
      //   this.userInfo.avatar = res.result;
      // };
      // reader.readAsDataURL(file);
      const data = new FormData();
      data.append("file", file);
      this.$axios({
        url: "http://127.0.0.1:3007/my/userinfo/avatar",
        method: "post",
        data: data,
      }).then((res) => {
        if (res.data.status === 0) {
          localStorage.setItem("eleToken", res.data.token);
          //刷新当前页面
          setTimeout(() => {
            window.location.href = window.location.href;
          }, 1000);

          this.$message({
            message: res.data.message,
            type: res.data.status === 0 ? "success" : "error",
          });
        }
      });
    },

    handleMenu() {
      this.$store.commit("collapseMenu");
    },

    setDialogInfo(cmditem) {
      if (!cmditem) {
        console.log("test");
        this.$message("菜单选项缺少command属性");
        return;
      }
      switch (cmditem) {
        case "info":
          this.showInfoList();
          break;
        case "uploadHeadImg":
          this.uploadHeadImg();
          break;
        case "logout":
          this.logout();
          break;
      }
    },

    showInfoList() {
      // 个人信息
      this.$router.push("/Main/infoshow");
    },
    logout() {
      // 清除token
      localStorage.removeItem("eleToken");
      this.$store.dispatch("clearCurrentState");

      // 页面跳转
      this.$router.push("/login");
    },
  },
  computed: {
    user() {
      return this.$store.getters.user;
    },
  },
};
</script>

<style lang="less" scoped>
header {
  display: flex;
  height: 100%;
  justify-content: space-between;
  align-items: center;
}
.l-content {
  display: flex;
  align-items: center;
  .el-button {
    margin-right: 20px;
  }
}
.r-content {
  .user {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
}
.hiddenInput {
  display: none;
}
</style>
