<template>
  <div class="zchb">
    <el-table
      :data="tableData"
      style="width: 100%; margin: 10px; margin-top: 30px"
      max-height="450"
      border
      v-if="user.identify == 'amo' || user.identify == 'manager'"
    >
      <el-table-column label="序号" width="50" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column label="资产编号" width="180" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.identifier }}</span>
        </template>
      </el-table-column>

      <el-table-column label="资产名称" width="100" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column label="申借人" width="150" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.applicant }}</span>
        </template>
      </el-table-column>

      <el-table-column label="借出日期" width="180" align="center">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.borrowdate }}</span>
        </template>
      </el-table-column>

      <el-table-column label="归还日期" width="180" align="center">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.lenddate }}</span>
        </template>
      </el-table-column>

      <el-table-column label="管理员" width="150" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.principal }}</span>
        </template>
      </el-table-column>

      <el-table-column label="状态" width="100" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{
            scope.row.jh_manager_status == 0 ? "待归还" : "已归还"
          }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <!-- <el-button
            size="small"
            type="success"
            @click="handlePass(scope.$index, scope.row)"
            :disabled="scope.row.jh_manager_status != 0"
            >通过</el-button
          >
          <el-button
            size="small"
            type="warning"
            @click="handleReject(scope.$index, scope.row)"
            :disabled="scope.row.jh_manager_status != 0"
            >驳回</el-button
          > -->

          <el-button
            size="small"
            type="success"
            @click="handleRevert(scope.$index, scope.row)"
            :disabled="scope.row.jh_manager_status == 1"
            v-if="user.identify == 'manager'"
            >归还</el-button
          >

          <el-button
            size="small"
            type="danger"
            icon="delete"
            @click="handleDelete(scope.$index, scope.row)"
            :disabled="scope.row.jh_manager_status == 0"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-table
      :data="studentTableData"
      style="width: 100%; margin: 10px; margin-top: 30px"
      max-height="450"
      border
      v-if="user.identify == 'student'"
    >
      <el-table-column label="序号" width="50" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column label="资产编号" width="180" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.identifier }}</span>
        </template>
      </el-table-column>

      <el-table-column label="资产名称" width="100" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column label="申借人" width="180" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.applicant }}</span>
        </template>
      </el-table-column>

      <el-table-column label="借出日期" width="200" align="center">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.borrowdate }}</span>
        </template>
      </el-table-column>

      <el-table-column label="归还日期" width="200" align="center">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.lenddate }}</span>
        </template>
      </el-table-column>

      <el-table-column label="状态" width="100" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{
            scope.row.jh_status == 0 ? "待归还" : "已归还"
          }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            size="small"
            type="danger"
            icon="delete"
            @click="handleDelete(scope.$index, scope.row)"
            :disabled="scope.row.jh_status == 0"
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
</template>

<script>
import qs from "qs";
export default {
  name: "JHGL",
  components: {},

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
      studentTableData: [],
    };
  },
  computed: {
    //角色权限 拿到user
    user() {
      return this.$store.getters.user;
    },
  },
  created() {
    if (this.user.identify == "manager") {
      this.getProfile();
    } else if (this.user.identify == "student") {
      this.studentGetProfile();
    } else {
      this.amoGetProfile();
    }
  },

  methods: {
    getProfile() {
      this.$axios({
        url: "http://127.0.0.1:3007/my/borrow",
        data: qs.stringify(this.tableData),
        method: "get",
        headers: {
          "Content-Type": " application/json",
        },
      }).then((res) => {
        const m = res.data.data;
        for (let i = 0; i < m.length; i++) {
          m[i].borrowdate = rTime(m[i].borrowdate);
          m[i].lenddate = rTime(m[i].lenddate);
        }
        // console.log(m);

        this.filterTableData = m;
        // this.studentTableData = m;
        this.allTableData = m;

        //设置分页数据
        this.setPaginations();
      });
    },
    studentGetProfile() {
      this.$axios({
        url: "http://127.0.0.1:3007/my/student/borrow",
        method: "get",
      }).then((res) => {
        console.log(res.data.data);

        const m = res.data.data;
        for (let i = 0; i < m.length; i++) {
          m[i].borrowdate = rTime(m[i].borrowdate);
          m[i].lenddate = rTime(m[i].lenddate);
        }
        console.log(m);
        this.filterTableData = m;
        // this.studentTableData = m;
        this.allTableData = m;

        //设置分页数据
        this.setPaginations();
      });
    },
    amoGetProfile() {
      this.$axios({
        url: "http://127.0.0.1:3007/my/amo/borrow",
        data: qs.stringify(this.tableData),
        method: "get",
        headers: {
          "Content-Type": " application/json",
        },
      }).then((res) => {
        const m = res.data.data;
        for (let i = 0; i < m.length; i++) {
          m[i].borrowdate = rTime(m[i].borrowdate);
          m[i].lenddate = rTime(m[i].lenddate);
        }
        // console.log(m);

        this.filterTableData = m;
        // this.studentTableData = m;
        this.allTableData = m;
        //设置分页数据
        this.setPaginations();
      });
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
      this.studentTableData = this.allTableData.filter((item, index) => {
        return index < this.paginations.page_size;
      });

      // console.log(this.tableData);
    },
    handleSizeChange(page_size) {
      //切换size
      this.paginations.page_index = 1;
      this.paginations.page_size = page_size;
      this.tableData = this.allTableData.filter((item, index) => {
        return index < page_size;
      });
      this.studentTableData = this.allTableData.filter((item, index) => {
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
        this.studentTableData = tables;
        // console.log(this.tableData);
      }
    },

    handleRevert(index, row) {
      this.$axios({
        url: `http://127.0.0.1:3007/my/return/${row.id}`,
        method: "get",
      }).then((res) => {
        // console.log(res);
        this.$message({
          message: res.data.message,
          type: res.data.status === 0 ? "success" : "error",
        });
        //删除成功后自动刷新页面
        this.getProfile();
        // this.studentGetProfile();
      });
    },
    //资产部管理员通过
    handlePass(index, row) {
      this.$axios({
        url: `http://127.0.0.1:3007/my/pass/borrow/${row.id}`,
        method: "get",
      }).then((res) => {
        // console.log(res);
        this.$message({
          message: res.data.message,
          type: res.data.status === 0 ? "success" : "error",
        });
        //删除成功后自动刷新页面
        this.getProfile();
        // this.studentGetProfile();
      });
    },
    //资产部管理员拒绝
    handleReject(index, row) {
      this.$axios({
        url: `http://127.0.0.1:3007/my/reject/borrow/${row.id}`,
        method: "get",
      }).then((res) => {
        // console.log(res);
        this.$message({
          message: res.data.message,
          type: res.data.status === 0 ? "success" : "error",
        });
        //删除成功后自动刷新页面
        this.getProfile();
        // this.studentGetProfile();
      });
    },

    handleDelete(index, row) {
      this.$axios({
        url: `http://127.0.0.1:3007/my/delete/borrow/${row.id}`,
        method: "get",
      }).then((res) => {
        this.$message({
          message: res.data.message,
          type: res.data.status === 0 ? "success" : "error",
        });
        //自动刷新页面
        this.user.identify == "amo"
          ? this.amoGetProfile()
          : this.user.identify == "manager"
          ? this.getProfile()
          : this.studentGetProfile();
      });
    },
  },
  computed: {
    user() {
      return this.$store.getters.user;
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
