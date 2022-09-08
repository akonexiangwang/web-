<template>
  <div class="fillContainer">
    <div class="manager" v-if="user.identify == 'manager'">
      <div class="add">
        <el-button
          class="button"
          type="primary"
          size="small"
          icon="view"
          @click="handleAdd()"
          >添加</el-button
        >
      </div>
      <el-table :data="tableData" max-height="450" border style="width: 100%">
        <el-table-column label="序号" width="50" align="center">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.id }}</span>
          </template>
        </el-table-column>

        <el-table-column label="资产名称" width="100" align="center">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.name }}</span>
          </template>
        </el-table-column>

        <el-table-column label="资产价格" width="100" align="center">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.price }}</span>
          </template>
        </el-table-column>

        <el-table-column label="资产类型" width="100" align="center">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.type }}</span>
          </template>
        </el-table-column>

        <el-table-column label="申请人" width="150" align="center">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.applicant }}</span>
          </template>
        </el-table-column>

        <el-table-column label="申请原因 " width="200" align="center">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.reason }}</span>
          </template>
        </el-table-column>

        <el-table-column label="申请日期" width="200" align="center">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.date }}</span>
          </template>
        </el-table-column>

        <el-table-column label="申请状态" width="100" align="center">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{
              scope.row.status == 0
                ? "已申请"
                : scope.row.status == 1
                ? "已采购"
                : "已驳回"
            }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              type="warning"
              size="small"
              @click="handleEdit(scope.$index, scope.row)"
              :disabled="scope.row.status != 0"
              >编辑</el-button
            >
            <el-button
              size="small"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="amo" v-if="user.identify == 'amo'">
      <div class="add">
        <el-button
          class="button"
          type="primary"
          size="small"
          icon="view"
          @click="amohandleAdd()"
          >添加</el-button
        >
      </div>
      <el-table
        :data="tableData"
        max-height="450"
        border
        style="width: 100%; margin: 10px; margin-top: 30px"
      >
        <el-table-column label="序号" width="50" align="center">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.id }}</span>
          </template>
        </el-table-column>

        <el-table-column label="资产名称" width="100" align="center">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.name }}</span>
          </template>
        </el-table-column>

        <el-table-column label="资产价格" width="100" align="center">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.price }}</span>
          </template>
        </el-table-column>

        <el-table-column label="资产类型" width="100" align="center">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.type }}</span>
          </template>
        </el-table-column>

        <el-table-column label="申请人" width="150" align="center">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.applicant }}</span>
          </template>
        </el-table-column>

        <el-table-column label="申请原因 " width="200" align="center">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.reason }}</span>
          </template>
        </el-table-column>

        <el-table-column label="申请日期" width="200" align="center">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.date }}</span>
          </template>
        </el-table-column>

        <el-table-column label="状态" width="100" align="center">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{
              scope.row.amo_status == 0
                ? "未处理"
                : scope.row.amo_status == 1
                ? "已采购"
                : "已驳回"
            }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              type="success"
              size="small"
              @click="handlePass(scope.$index, scope.row)"
              :disabled="scope.row.amo_status != 0"
              >通过</el-button
            >
            <el-button
              size="small"
              type="danger"
              @click="handleReject(scope.$index, scope.row)"
              :disabled="scope.row.amo_status != 0"
              >驳回</el-button
            >

            <el-button
              size="small"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

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
    <purchase-dialog
      :purchaseDialog="purchaseDialog"
      :purchaseData="purchaseData"
      @update="user.name == 'amo' ? getProfile() : managerGetProfile()"
    ></purchase-dialog>
  </div>
</template>

<script>
import qs from "qs";
import PurchaseDialog from "../../components/purchaseDialog.vue";
export default {
  name: "CGGL",
  components: { PurchaseDialog },
  data() {
    return {
      tableData: [],
      filterTableData: [],
      allTableData: [],
      paginations: {
        page_index: 1, //当前位于哪页
        total: 0, //总数
        page_size: 5, //一页显示多少条
        page_sizes: [5, 10, 15, 20], //每页显示多少条
        layout: "total,sizes,prev,pager,next,jumper", //翻页属性
      },
      purchaseDialog: {
        show: false,
        title: "",
        option: "",
      },
      purchaseData: {
        id: "",
        name: "",
        price: "",
        type: "",
        applicant: "",
        reason: "",
        date: "",
        amo_status: "",
      },
    };
  },
  computed: {
    //角色权限 拿到user
    user() {
      return this.$store.getters.user;
    },
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
      this.$axios({
        url: "http://127.0.0.1:3007/my/purchase",
        data: qs.stringify(this.tableData),
        method: "get",
        headers: {
          "Content-Type": " application/json",
        },
      }).then((res) => {
        // this.tableData = res.data.data;
        const m = res.data.data;

        let newRes = m.map(function (n) {
          return rTime(n.date);
        });

        for (let i in m) {
          m[i].date = newRes[i];
        }

        this.allTableData = m;
        this.filterTableData = m;
        // this.tableData = m;

        this.setPaginations();
      });
    },
    managerGetProfile() {
      this.$axios({
        url: "http://127.0.0.1:3007/my/managerPurchase",
        data: qs.stringify(this.tableData),
        method: "get",
        headers: {
          "Content-Type": " application/json",
        },
      }).then((res) => {
        // this.tableData = res.data.data;
        const m = res.data.data;

        let newRes = m.map(function (n) {
          return rTime(n.date);
        });

        for (let i in m) {
          m[i].date = newRes[i];
        }

        this.allTableData = m;
        this.filterTableData = m;
        // this.tableData = m;

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
      // console.log(this.tableData);
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
    handleAdd() {
      (this.purchaseDialog = {
        show: true,
        title: "添加采购信息",
        option: "application",
      }),
        (this.purchaseData = {
          id: "",
          name: "",
          price: "",
          type: "",
          applicant: this.user.name,
          reason: "",
          date: "",
        });
    },
    amohandleAdd() {
      console.log(2345);
      (this.purchaseDialog = {
        show: true,
        title: "申请资产信息",
        option: "amoApplication",
      }),
        (this.purchaseData = {
          id: "",
          name: "",
          price: "",
          type: "",
          applicant: this.user.name,
          reason: "",
          date: "",
          amo_status: 1,
        });
    },
    handleEdit(index, row) {
      (this.purchaseDialog = {
        show: true,
        title: "修改申请信息",
        option: "edit",
      }),
        (this.purchaseData = {
          id: row.id,
          name: row.name,
          price: row.price,
          type: row.type,
          applicant: row.applicant,
          reason: row.reason,
          date: row.date,
        });
    },
    //资产部管理员删除
    handleDelete(index, row) {
      this.$axios({
        url: `http://127.0.0.1:3007/my/delete/purchase/${row.id}`,
        method: "get",
      }).then((res) => {
        console.log(res);
        this.$message({
          message: res.data.message,
          type: res.data.status === 0 ? "success" : "error",
        });
        //删除成功后自动刷新页面
        this.user.identify == "amo"
          ? this.getProfile()
          : this.managerGetProfile();
      });
    },

    handlePass(index, row) {
      this.$axios({
        url: `http://127.0.0.1:3007/my/pass/${row.id}`,
        method: "get",
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
        url: `http://127.0.0.1:3007/my/reject/${row.id}`,
        method: "get",
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
.pagination {
  text-align: right;
  margin-top: 10px;
}

.add {
  margin-top: 10px;
  float: right;
  margin-bottom: 20px;
}
</style>
