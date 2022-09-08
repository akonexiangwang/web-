<template>
  <div class="zcgl">
    <div class="fillContainer">
      <el-table :data="tableData" max-height="450" border style="width: 100%">
        <el-table-column label="序号" width="100" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.id }}</span>
          </template>
        </el-table-column>

        <el-table-column label="资产编号" width="200" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.identifier }}</span>
          </template>
        </el-table-column>

        <el-table-column label="名称" width="100" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>

        <el-table-column label="申请人" width="150" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.applicant }}</span>
          </template>
        </el-table-column>

        <el-table-column label="维修原因" width="250" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.failure_cause }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="状态"
          width="133"
          align="center"
          v-if="user.identify == 'amo'"
        >
          <template slot-scope="scope">
            <span>{{
              scope.row.amo_status == 0
                ? "未处理"
                : scope.row.amo_status == 1
                ? "维修中"
                : scope.row.amo_status == 2
                ? "已驳回"
                : "已完成"
            }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="状态"
          width="100"
          align="center"
          v-if="user.identify == 'manager'"
        >
          <template slot-scope="scope">
            <span>{{
              scope.row.status == 0
                ? "已提交"
                : scope.row.status == 1
                ? "维修中"
                : scope.row.status == 2
                ? "已驳回"
                : "已完成"
            }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="操作"
          prop="operation"
          align="center"
          width="360"
        >
          <template slot-scope="scope">
            <el-button
              v-if="user.identify == 'amo'"
              type="warning"
              size="small"
              icon="edit"
              @click="handlePass(scope.$index, scope.row)"
              :disabled="scope.row.amo_status != 0"
              >通过</el-button
            >
            <el-button
              v-if="user.identify == 'amo'"
              size="small"
              type="danger"
              icon="delete"
              :disabled="scope.row.amo_status != 0"
              @click="handleReject(scope.$index, scope.row)"
              >驳回</el-button
            >
            <el-button
              v-if="user.identify == 'amo'"
              size="small"
              type="success"
              icon="delete"
              :disabled="
                scope.row.amo_status == 0 ||
                scope.row.amo_status == 4 ||
                scope.row.amo_status == 2
              "
              @click="handleOK(scope.$index, scope.row)"
              >完成</el-button
            >
            <el-button
              :disabled="
                scope.row.status == 0 ||
                scope.row.status == 1 ||
                scope.row.amo_status == 0 ||
                scope.row.amo_status == 1
              "
              size="small"
              type="danger"
              icon="delete"
              @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-row>
        <el-col :span="24">
          <div class="pagination">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="paginations.page_index"
              :page-sizes="paginations.page_sizes"
              :page-size="paginations.page_size"
              :layout="paginations.layout"
              :total="paginations.total"
            >
            </el-pagination>
          </div>
        </el-col>
      </el-row>
    </div>

    <transfer-dialog
      :TransferTableVisible="TransferTableVisible"
      @update="user.identify == 'amo' ? getProfile() : managerGetProfile()"
      :TransferData="TransferData"
    ></transfer-dialog>
  </div>
</template>

<script>
import Dialog from "../../components/Dialog.vue";
import qs from "qs";

import TransferDialog from "../../components/TransferDialog.vue";
export default {
  name: "ZCGL",
  data() {
    return {
      filterTableData: [],
      paginations: {
        page_index: 1, //当前位于哪页
        total: 0, //总数
        page_size: 5, //一页显示多少条
        page_sizes: [5, 10, 15, 20], //每页显示多少条
        layout: "total,sizes,prev,pager,next,jumper", //翻页属性
      },
      tableData: [],
      allTableData: [],

      dialogTableVisible: {
        show: false,
        title: "",
        option: "",
      },
      TransferData: {
        id: "",
        status: "",
        identifier: "",
        applicant: "",
        principal: "",
        failure_cause: "",
      },
      TransferTableVisible: {
        show: false,
        title: "",
        option: "",
      },
    };
  },
  computed: {
    //角色权限 拿到user
    user() {
      return this.$store.getters.user;
    },
  },
  components: {
    Dialog,
    TransferDialog,
  },
  created() {
    if (this.user.identify == "amo") {
      this.getProfile();
    } else {
      this.managerGetProfile();
    }
  },

  methods: {
    getProfile() {
      //获取表格数据
      this.$axios({
        url: "http://127.0.0.1:3007/my/repair/getRepair",
        data: qs.stringify(this.tableData),
        method: "get",
        headers: {
          "Content-Type": " application/json",
        },
      })
        .then((res) => {
          const m = res.data.data;
          // console.log(newRes);

          this.allTableData = m;
          this.filterTableData = m;
          // console.log(this.allTableData);
          //设置分页数据
          this.setPaginations();
        })
        .catch((err) => console.log(err));
    },
    managerGetProfile() {
      //获取表格数据
      this.$axios({
        url: "http://127.0.0.1:3007/my/repair/getManagerRepair",
        data: qs.stringify(this.tableData),
        method: "get",
        headers: {
          "Content-Type": " application/json",
        },
      })
        .then((res) => {
          const m = res.data.data;
          // console.log(newRes);

          this.allTableData = m;
          this.filterTableData = m;
          // console.log(this.allTableData);
          //设置分页数据
          this.setPaginations();
        })
        .catch((err) => console.log(err));
    },
    setPaginations() {
      //分页属性设置

      this.paginations.total = this.allTableData.length;
      this.paginations.page_index = 1;
      this.paginations.page_size = 5;
      //设置默认的分页数据
      this.tableData = this.allTableData.filter((item, index) => {
        return index < this.paginations.page_size;
      });
      // console.log(this.tableData);
    },

    handleDelete(index, row) {
      this.$axios({
        url: `http://127.0.0.1:3007/my/repair/deleteRepair/${row.id}`,
        data: qs.stringify(this.formData),
        method: "get",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }).then((res) => {
        console.log(res);
        this.$message({
          message: res.data.message,
          type: res.data.status === 0 ? "success" : "error",
        });
        //删除成功后自动刷新页面
        this.getProfile();
      });
    },
    handlePass(index, row) {
      this.$axios({
        url: `http://127.0.0.1:3007/my/repair/pass/${row.id}`,
        data: qs.stringify(this.formData),
        method: "get",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }).then((res) => {
        console.log(res);
        this.$message({
          message: res.data.message,
          type: res.data.status === 0 ? "success" : "error",
        });
        //删除成功后自动刷新页面
        this.getProfile();
      });
    },
    handleReject(index, row) {
      this.$axios({
        url: `http://127.0.0.1:3007/my/repair/reject/${row.id}`,
        data: qs.stringify(this.formData),
        method: "get",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }).then((res) => {
        console.log(res);
        this.$message({
          message: res.data.message,
          type: res.data.status === 0 ? "success" : "error",
        });
        //删除成功后自动刷新页面
        this.getProfile();
      });
    },
    handleOK(index, row) {
      this.$axios({
        url: `http://127.0.0.1:3007/my/repair/finish/${row.id}`,
        data: qs.stringify(this.formData),
        method: "get",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }).then((res) => {
        console.log(res);
        this.$message({
          message: res.data.message,
          type: res.data.status === 0 ? "success" : "error",
        });
        //删除成功后自动刷新页面
        this.getProfile();
      });
    },
    handleAdd(index, row) {},

    handleSizeChange(page_size) {
      //切换size
      this.paginations.page_index = 1;
      this.paginations.page_size = page_size;
      this.tableData = this.allTableData.filter((item, index) => {
        return index < page_size;
      });
    },
    handleCurrentChange(page) {
      //获取当前页
      let index = this.paginations.page_size * (page - 1);
      let nums = this.paginations.page_size * page;
      //容器
      let tables = [];

      for (let i = index; i < nums; i++) {
        if (this.allTableData[i]) {
          tables.push(this.allTableData[i]);
        }
        this.tableData = tables;
        // console.log(this.tableData);
      }
    },
  },
};
</script>

<style scoped>
.fillContainer {
  padding-top: 30px;
}
.button {
  margin-top: 13px;
}
.btnRight {
  float: right;
}
.pagination {
  text-align: right;
  margin-top: 10px;
}
.time {
  margin-top: 9px;
}
</style>
