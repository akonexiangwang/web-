<template>
  <div class="login">
    <section class="form_container">
      <div class="manage_tip">
        <span class="title">城科资产管理系统</span>
        <el-form
          :model="loginUser"
          :rules="rules"
          ref="loginForm"
          label-width="80px"
          class="loginForm"
        >
          <el-form-item label="用户名" prop="name">
            <el-input
              v-model="loginUser.name"
              placeholder="请输入用户名"
            ></el-input>
          </el-form-item>

          <el-form-item label="密码" prop="password">
            <el-input
              v-model="loginUser.password"
              type="password"
              placeholder="请输入密码"
            ></el-input>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              class="submit_btn"
              @click="submitForm('loginForm')"
              >登录</el-button
            >
          </el-form-item>
          <div class="tiparea">
            <p>还没有账号?现在<router-link to="/register">注册</router-link></p>
          </div>
        </el-form>
      </div>
    </section>
  </div>
</template>

<script>
//  import request from '../network/request'
// import qs from 'qs'
import jwt_decode from "jwt-decode";
export default {
  name: "login",
  components: {},
  data() {
    return {
      loginUser: {
        name: "",
        password: "",
      },
      rules: {
        name: [
          {
            required: true,
            message: "用户名不能为空",
            //失去焦点触发
            trigger: "blur",
          },
          {
            min: 2,
            max: 30,
            message: "长度在2到30个字符之间",
            trigger: "blur",
          },
        ],

        password: [
          {
            required: true,
            message: "密码不能为空",
            trigger: "blur",
          },
          {
            min: 6,
            max: 30,
            message: "长度在6到30之间",
            trigger: "blur",
          },
        ],
      },
    };
  },
  computed: {
    //角色权限 拿到user
    user() {
      return this.$store.getters.user;
    },
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios({
            url: "http://127.0.0.1:3007/api/login",
            data: this.loginUser,
            method: "post",
            headers: {
              "Content-Type": "application/json",
            },
          }).then((res) => {
            console.log(res);
            this.$message({
              message: res.data.message,
              type: res.data.status === 0 ? "success" : "error",
            });
            //token
            const { token } = res.data;
            //存储到ls
            localStorage.setItem("eleToken", token);

            //解析token
            const decoded = jwt_decode(token);
            //  console.log(decoded)
            //存储到vuex中
            this.$store.dispatch("setAuthenticated", !this.isEmpty(decoded));
            this.$store.dispatch("setUser", decoded);

            this.$router.push("/Main");
          });
        }
      });
    },
    //判断decoded是否为空
    isEmpty(value) {
      return (
        value === undefined ||
        value === null ||
        (typeof value === "object" && Object.keys(value).length === 0) ||
        (typeof value === "string" && value.trim().length === 0)
      );
    },
  },
  // beforeRouteLeave(to, from, next) {
  //   if (this.user.identify == "amo") {
  //     next("/Main/home");
  //   } else {
  //     next("/Main/zcgl");
  //   }
  // },
};
</script>

<style scoped>
.login {
  position: fixed;
  width: 100%;
  height: 100%;
  background: url(../assets/cqucc.jpg) no-repeat center center;
  background-size: 100% 100%;
}
.form_container {
  width: 370px;
  height: 210px;
  position: relative;
  top: calc(50% - 284px / 2);
  left: calc(50% - 370px / 2);
  /* padding: 25px; */
  border-radius: 5px;
  text-align: center;
}
.form_container .manage_tip .title {
  font-family: "Microsoft YaHei";
  font-weight: bold;
  font-size: 26px;
  color: #fff;
}
.loginForm {
  margin-top: 20px;
  background-color: #fff;
  padding: 20px 40px 20px 20px;
  border-radius: 5px;
  box-shadow: 0px 5px 10px #cccc;
}

.submit_btn {
  width: 100%;
}
.tiparea {
  text-align: right;
  font-size: 12px;
  color: #333;
}
.tiparea p a {
  color: #409eff;
}
</style>
