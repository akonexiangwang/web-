<template>
  <!--权限分配-->
  <el-dialog
    title="权限分配"
    :visible.sync="authorityDialog.show"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :modal-append-to-body="false"
  >
    <el-form :model="form" :rules="form_rules" ref="form">
      <el-form-item label="用户名" :label-width="formLabelWidth" prop="name">
        <el-input
          v-model="form.name"
          autocomplete="off"
          :disabled="edit"
        ></el-input>
      </el-form-item>

      <el-form-item label="角色" :label-width="formLabelWidth" prop="type">
        <el-select v-model="form.type" placeholder="请选择角色">
          <el-option
            label="管理员"
            value="manager"
            v-if="form.identify == 'student'"
          ></el-option>
          <el-option
            label="用户"
            value="student"
            v-if="form.identify == 'manager'"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close()">取 消</el-button>
      <el-button type="primary" @click="onSubmit('form')">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import qs from "qs";
export default {
  name: "authorityDialog",
  props: {
    authorityDialog: Object,
    form: Object,
  },
  data() {
    return {
      edit: true,
      formLabelWidth: "120px",
      form_rules: {
        type: [
          {
            required: true,
            message: "角色不能为空",
            trigger: ["change", "blur"],
          },
        ],
      },
    };
  },
  methods: {
    onSubmit(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.$axios({
            url: "http://127.0.0.1:3007/my/userinfo/authority",
            data: qs.stringify(this.form),
            method: "post",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }).then((res) => {
            this.$message({
              message: res.data.message,
              type: res.data.status === 0 ? "success" : "error",
            });
            //隐藏dialog
            this.authorityDialog.show = false;
            //添加成功后自动刷新页面
            this.$emit("update");
          });
        }
      });
    },
    close() {
      this.authorityDialog.show = false;
    },
  },
};
</script>
