<template>
  <div class="register">
    <section class="form_container">
      <div class="manage_tip">
        <span class="title">城科资产管理系统</span>
        <el-form
          :model="registerUser"
          :rules="rules"
          ref="registerForm"
          label-width="80px"
          class="registerForm"
        >
          <el-form-item label="用户名" prop="name">
            <el-input
              v-model="registerUser.name"
              placeholder="请输入用户名"
            ></el-input>
          </el-form-item>

          <el-form-item label="邮箱" prop="email">
            <el-input
              v-model="registerUser.email"
              placeholder="请输入邮箱"
            ></el-input>
          </el-form-item>

          <el-form-item label="密码" prop="password">
            <el-input
              v-model="registerUser.password"
              type="password"
              placeholder="请输入密码"
            ></el-input>
          </el-form-item>

          <el-form-item label="确认密码" prop="password2">
            <el-input
              v-model="registerUser.password2"
              type="password"
              placeholder="请再次输入密码"
            ></el-input>
          </el-form-item>

          <!-- <el-form-item label="选择身份">
            <el-select v-model="registerUser.identify" placeholder="请选择身份">
              <el-option label="资产部" value="amo"></el-option>
              <el-option label="管理员" value="manager"></el-option>
              <el-option label="学生" value="student"></el-option>
            </el-select>
          </el-form-item> -->

          <el-form-item>
            <el-button
              type="primary"
              class="submit_btn"
              @click="submitForm('registerForm')"
              >注册</el-button
            >
          </el-form-item>
          <div class="tiparea">
            <p>现在<router-link to="/login">登录</router-link></p>
          </div>
        </el-form>
      </div>
    </section>
  </div>
</template>

<script>
import qs from "qs";
export default {
  name: "register",
  components: {},
  data() {
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("确认密码不能为空"));
      } else if (value !== this.registerUser.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      registerUser: {
        name: "",
        email: "",
        password: "",
        password2: "",
        identify: "",
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
            message: "长度在2到10个字符之间",
            trigger: "blur",
          },
        ],
        email: [
          {
            required: true,
            message: "邮箱不能为空",
            //失去焦点触发
            trigger: "blur",
          },
          {
            type: "email",
            message: "邮箱格式不正确",
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
        password2: [
          {
            validator: validatePass2,
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios({
            url: "http://127.0.0.1:3007/api/register",
            data: qs.stringify(this.registerUser),
            method: "post",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }).then((res) => {
            console.log(res);
            this.$message({
              message: res.data.message,
              type: res.data.status === 0 ? "success" : "error",
            });
            if (res.data.status === 0) {
              this.$router.push("/login");
            }
          });
        }
      });
    },
  },
};
</script>

<style scoped>
.register {
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
  top: calc(50% - 408px / 2);
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

.registerForm {
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
