<template>
  <div class="zcgl">
    <div class="fillContainer">
      <div class="add">
        <el-form :inline="true" ref="add_data" :model="search_data">
          <!-- 筛选 -->
          <el-form-item label="按照时间筛选" class="time">
            <el-date-picker
              v-model="search_data.startTime"
              type="datetime"
              placeholder="选择开始时间"
            >
            </el-date-picker>
            --
            <el-date-picker
              v-model="search_data.endTime"
              type="datetime"
              placeholder="选择结束时间"
            >
            </el-date-picker>
          </el-form-item>

          <el-form-item>
            <el-button
              class="button"
              type="primary"
              size="small"
              icon="search"
              @click="handleSearch()"
              >筛选</el-button
            >
          </el-form-item>

          <el-form-item class="btnRight">
            <el-button
              v-if="user.identify == 'amo'"
              class="button"
              type="primary"
              size="small"
              icon="view"
              @click="handleAdd()"
              >添加</el-button
            >
          </el-form-item>
        </el-form>
      </div>

      <el-table :data="tableData" max-height="450" border style="width: 100%">
        <el-table-column label="序号" width="50" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.id }}</span>
          </template>
        </el-table-column>

        <el-table-column label="资产编号" width="150" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.identifier }}</span>
          </template>
        </el-table-column>

        <el-table-column label="名称" width="100" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>

        <el-table-column label="管理员" width="100" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.principal }}</span>
          </template>
        </el-table-column>

        <el-table-column label="单价" width="135" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.price }}</span>
          </template>
        </el-table-column>

        <el-table-column label="类型" width="100" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.type }}</span>
          </template>
        </el-table-column>

        <el-table-column label="入库日期" width="200" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.date }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="状态"
          width="100"
          align="center"
          v-if="user.identify == 'amo'"
        >
          <template slot-scope="scope">
            <span>{{
              scope.row.status == 0
                ? "闲置"
                : scope.row.status == 1
                ? "已划拨"
                : "维修中"
            }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="状态"
          width="100"
          align="center"
          v-if="user.identify == 'manager' || user.identify == 'student'"
        >
          <template slot-scope="scope">
            <span>{{
              scope.row.manager_status == 0
                ? "闲置"
                : scope.row.manager_status == 1
                ? "已借出"
                : "维修中"
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
              @click="handleEdit(scope.$index, scope.row)"
              :disabled="scope.row.status != 0"
              >编辑</el-button
            >

            <el-button
              v-if="user.identify == 'manager'"
              type="success"
              size="small"
              icon="edit"
              @click="handleborrow(scope.$index, scope.row)"
              :disabled="scope.row.manager_status != 0"
              >借出</el-button
            >

            <el-button
              v-if="user.identify == 'amo'"
              size="small"
              type="success"
              icon="delete"
              :disabled="scope.row.status != 0"
              @click="handleTransfer(scope.$index, scope.row)"
              >划拨</el-button
            >
            <el-button
              v-if="user.identify == 'amo'"
              size="small"
              type="info"
              icon="delete"
              :disabled="scope.row.status != 0"
              @click="amoHandleService(scope.$index, scope.row)"
              >报修</el-button
            >

            <el-button
              v-if="user.identify == 'manager'"
              size="small"
              type="info"
              icon="delete"
              :disabled="scope.row.manager_status != 0"
              @click="handleService(scope.$index, scope.row)"
              >报修</el-button
            >

            <el-button
              :disabled="scope.row.status != 0"
              v-if="user.identify == 'amo'"
              size="small"
              type="danger"
              icon="delete"
              @click="handleDelete(scope.$index, scope.row)"
              >报废</el-button
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
    <Dialog
      :dialogTableVisible="dialogTableVisible"
      @update="user.identify == 'amo' ? getProfile() : managerGetProfile()"
      :formData="formData"
    ></Dialog>
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
      search_data: {
        startTime: "",
        endTime: "",
      },
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
      formData: {
        identifier: "",
        name: "",
        price: "",
        type: "",
        date: "",
        id: "",
      },
      dialogTableVisible: {
        show: false,
        title: "",
        option: "",
      },
      TransferData: {
        id: "",
        status: "",
        identifier: "",
        borrowdate: "",
        lenddate: "",
        name: "",
        applicant: "",
        amo_status: "",
        failure_cause: "",
        jh_status: "",
        jh_manager_status: "",
        principal: "",
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
        url: "http://127.0.0.1:3007/my/asset/cates",
        data: qs.stringify(this.tableData),
        method: "get",
        headers: {
          "Content-Type": " application/json",
        },
      })
        .then((res) => {
          console.log(res);
          const m = res.data.data;
          console.log(m);
          let newRes = m.map(function (n) {
            return rTime(n.date);
          });

          for (let i in m) {
            m[i].date = newRes[i];
          }

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
        url: "http://127.0.0.1:3007/my/asset/manager/cates",
        data: qs.stringify(this.tableData),
        method: "get",
        headers: {
          "Content-Type": " application/json",
        },
      })
        .then((res) => {
          const m = res.data.data;
          let newRes = m.map(function (n) {
            return rTime(n.date);
          });

          for (let i in m) {
            m[i].date = newRes[i];
          }

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
    handleEdit(index, row) {
      this.dialogTableVisible = {
        show: true,
        title: "修改资产信息",
        option: "edit",
      };
      //编辑时展示当前一行的数据
      this.formData = {
        identifier: row.identifier,
        name: row.name,
        price: row.price,
        type: row.type,
        date: row.date,
        id: row.id,
      };
    },
    handleDelete(index, row) {
      this.$confirm("确定报废吗?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$axios({
          url: `http://127.0.0.1:3007/my/asset/delete/${row.id}`,
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
      });
    },
    handleSearch() {
      //筛选
      // console.log(111);
      if (!this.search_data.startTime || !this.search_data.endTime) {
        this.$message({
          type: "warning",
          message: "请选择区间",
        });
        this.getProfile();
        return;
      }
      const sTime = this.search_data.startTime.getTime();
      const eTime = this.search_data.endTime.getTime();
      this.allTableData = this.filterTableData.filter((item) => {
        // console.log(item);
        let date = new Date(item.date);
        // console.log(date);
        let time = date.getTime();
        // console.log(time);
        return time >= sTime && time <= eTime;
      });
      // console.log(this.allTableData);
      //分页数据
      this.setPaginations();
    },
    handleTransfer(index, row) {
      this.TransferTableVisible = {
        show: true,
        title: "划拨资产",
        option: "Transfer",
      };
      this.TransferData = {
        identifier: row.identifier,
        id: row.id,
        principal: "",
      };
    },
    //普通管理员报修
    handleService(index, row) {
      this.TransferTableVisible = {
        show: true,
        title: "报修资产",
        option: "Service",
      };
      this.TransferData = {
        id: row.id,
        identifier: row.identifier,
        name: row.name,
        amo_status: "0",
        status: "0",
        applicant: this.user.name,
        failure_cause: "",
      };
    },
    //超级管理员报修
    amoHandleService(index, row) {
      this.TransferTableVisible = {
        show: true,
        title: "报修资产",
        option: "Service",
      };
      this.TransferData = {
        id: row.id,
        identifier: row.identifier,
        name: row.name,
        amo_status: "1",
        status: "2",
        applicant: this.user.name,

        failure_cause: "",
      };
    },
    handleborrow(index, row) {
      this.TransferTableVisible = {
        show: true,
        title: "借出资产",
        option: "borrow",
      };
      this.TransferData = {
        id: row.id,
        identifier: row.identifier,
        applicant: "",
        name: row.name,
        borrowdate: "",
        lenddate: "",
        principal: row.principal,
      };
    },

    handleAdd() {
      this.dialogTableVisible = {
        show: true,
        title: "添加资产信息",
        option: "add",
      };
      this.formData = {
        identifier: "",
        name: "",
        price: "",
        type: "",
        date: "",
        id: "",
      };
    },
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
function rTime(date) {
  var json_date = new Date(date).toJSON();
  return new Date(+new Date(json_date) + 8 * 3600 * 1000)
    .toISOString()
    .replace(/T/g, " ")
    .replace(/\.[\d]{3}Z/, "");
}
</script>

<style scoped>
.add {
  height: 60px;
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
