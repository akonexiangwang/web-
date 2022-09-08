<template>
  <div class="dialog">
    <el-dialog
      :title="purchaseDialog.title"
      :visible.sync="purchaseDialog.show"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :modal-append-to-body="false"
    >
      <el-form
        :model="purchaseData"
        :rules="form_rules"
        ref="purchaseData"
        style="margin: 10px; width: auto"
      >
        <el-form-item
          label="资产名称"
          :label-width="formLabelWidth"
          prop="name"
        >
          <el-input v-model="purchaseData.name" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item
          label="资产价格"
          :label-width="formLabelWidth"
          prop="price"
        >
          <el-input v-model="purchaseData.price" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item
          label="申请原因"
          :label-width="formLabelWidth"
          prop="reason"
        >
          <el-input v-model="purchaseData.reason" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item
          label="申请日期"
          :label-width="formLabelWidth"
          prop="date"
        >
          <el-date-picker
            type="datetime"
            v-model="purchaseData.date"
            placeholder="选择日期时间"
            autocomplete="off"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item
          label="资产类型"
          :label-width="formLabelWidth"
          prop="type"
        >
          <el-select v-model="purchaseData.type" placeholder="请选择资产类型">
            <el-option label="公共" value="公共"></el-option>
            <el-option label="教师" value="教师"></el-option>
            <el-option label="个人" value="个人"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="onSubmit('purchaseData')"
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
    purchaseDialog: Object,
    purchaseData: Object,
  },
  data() {
    return {
      form_rules: {
        name: [
          {
            required: true,
            message: "资产名称不能为空",
            //失去焦点触发
            trigger: "blur",
          },
        ],

        price: [
          { required: true, message: "资产价格不能为空", trigger: "blur" },
        ],
        reason: [
          { required: true, message: "申请原因不能为空", trigger: "blur" },
        ],

        type: [
          {
            required: true,
            message: "资产类型不能为空",
            trigger: ["change"],
          },
        ],
        date: [
          { required: true, message: "申请日期不能为空", trigger: "blur" },
        ],
      },

      formLabelWidth: "120px",
    };
  },
  methods: {
    onSubmit(purchaseData) {
      this.$refs[purchaseData].validate((valid) => {
        if (valid) {
          const url =
            this.purchaseDialog.option == "application"
              ? "add/purchase"
              : this.purchaseDialog.option == "amoApplication"
              ? "add/amoPurchase"
              : "edit/purchase";

          // console.log(this.formData);
          this.$axios({
            url: `http://127.0.0.1:3007/my/${url}`,
            data: qs.stringify(this.purchaseData),
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
            //隐藏dialog
            this.purchaseDialog.show = false;
            //添加成功后自动刷新页面
            this.$emit("update");
          });
        }
      });
    },
    close() {
      this.purchaseDialog.show = false;
    },
  },
};
</script>

<style scoped></style>
