<template>
  <div class="dialog">
    <el-dialog
      :title="TransferTableVisible.title"
      :visible.sync="TransferTableVisible.show"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :modal-append-to-body="false"
    >
      <el-form
        :model="TransferData"
        :rules="form_rules"
        ref="TransferData"
        style="margin: 10px; width: auto"
      >
        <el-form-item
          label="资产编号"
          :label-width="formLabelWidth"
          prop="identifier"
        >
          <el-input
            v-model="TransferData.identifier"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item
          label="申借人"
          :label-width="formLabelWidth"
          prop="applicant"
          v-if="this.TransferTableVisible.option == 'borrow'"
        >
          <!-- <el-input
            v-model="TransferData.applicant"
            autocomplete="off"
          ></el-input> -->
          <el-autocomplete
            value-key="name"
            v-model="TransferData.applicant"
            :fetch-suggestions="querySearchAsync1"
          ></el-autocomplete>
        </el-form-item>

        <el-form-item
          label="管理员"
          :label-width="formLabelWidth"
          prop="applicant"
          v-if="this.TransferTableVisible.option == 'Service'"
        >
          <el-input
            v-model="TransferData.applicant"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item
          label="管理员"
          :label-width="formLabelWidth"
          prop="principal"
          v-if="
            this.TransferTableVisible.option == 'Transfer' ||
            this.TransferTableVisible.option == 'borrow'
          "
        >
          <!-- <el-input
            v-model="TransferData.principal"
            autocomplete="off"
          ></el-input> -->
          <el-autocomplete
            value-key="name"
            v-model="TransferData.principal"
            :fetch-suggestions="querySearchAsync"
          ></el-autocomplete>
        </el-form-item>

        <el-form-item
          label="借出日期"
          :label-width="formLabelWidth"
          prop="borrowdate"
          v-if="TransferTableVisible.option == 'borrow'"
        >
          <el-date-picker
            type="datetime"
            v-model="TransferData.borrowdate"
            placeholder="选择日期时间"
            autocomplete="off"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item
          label="预计归还日期"
          :label-width="formLabelWidth"
          prop="lenddate"
          v-if="TransferTableVisible.option == 'borrow'"
        >
          <el-date-picker
            type="datetime"
            v-model="TransferData.lenddate"
            placeholder="选择日期时间"
            autocomplete="off"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item
          label="故障原因"
          :label-width="formLabelWidth"
          prop="failure_cause"
          v-if="this.TransferTableVisible.option == 'Service'"
        >
          <el-input
            v-model="TransferData.failure_cause"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="onSubmit('TransferData')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import qs from "qs";

export default {
  name: "DiaLog",
  props: {
    TransferTableVisible: Object,
    TransferData: Object,
  },
  computed: {
    //角色权限 拿到user
    user() {
      return this.$store.getters.user;
    },
  },
  data() {
    return {
      form_rules: {
        identifier: [
          {
            required: true,
            message: "资产编号不能为空",
            //失去焦点触发
            trigger: "blur",
          },
        ],
        principal: [
          {
            required: true,
            message: "管理员不能为空",
            //失去焦点触发
            trigger: "blur",
          },
        ],
        applicant: [
          {
            required: true,
            message: "管理员名称不能为空",
            //失去焦点触发
            trigger: "blur",
          },
        ],
        borrowdate: [
          {
            required: true,
            message: "划拨日期不能为空",
            //失去焦点触发
            trigger: "blur",
          },
        ],
        lenddate: [
          {
            required: true,
            message: "预计归还日期不能为空",
            //失去焦点触发
            trigger: "blur",
          },
        ],
        username: [
          { required: true, message: "用户名不能为空", trigger: "blur" },
        ],
        principal: [
          { required: true, message: "负责人不能为空", trigger: "blur" },
        ],
        failure_cause: [
          { required: true, message: "故障原因不能为空", trigger: "blur" },
        ],
      },

      formLabelWidth: "120px",
    };
  },
  methods: {
    onSubmit(TransferData) {
      this.$refs[TransferData].validate((valid) => {
        if (valid) {
          const url =
            this.TransferTableVisible.option == "Transfer"
              ? "transfer"
              : this.TransferTableVisible.option == "Service"
              ? "service"
              : "rent";
          // console.log(this.formData);
          this.$axios({
            url: `http://127.0.0.1:3007/my/asset/${url}`,
            data: qs.stringify(this.TransferData),
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
            this.TransferTableVisible.show = false;
            //添加成功后自动刷新页面
            this.$emit("update");
          });
        }
      });
    },
    querySearchAsync(queryString, cb) {
      this.$axios({
        url: `http://127.0.0.1:3007/my/asset/manager/username`,
        data: qs.stringify({
          principal: queryString,
        }),
        method: "post",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }).then((res) => {
        cb(res.data.data);
      });
    },
    querySearchAsync1(queryString, cb) {
      this.$axios({
        url: `http://127.0.0.1:3007/my/asset/student/username`,
        data: qs.stringify({
          applicant: queryString,
        }),
        method: "post",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }).then((res) => {
        cb(res.data.data);
      });
    },
    close() {
      this.TransferTableVisible.show = false;
      this.$emit("update");
    },
  },
};
</script>

<style scoped></style>
