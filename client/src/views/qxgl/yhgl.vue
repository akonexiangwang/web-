<template>
  <div class="fillContainer">
    <el-table
      :data="
        tableData.filter((data) => {
          if (data.name.indexOf(search) !== -1) return true;
          return false;
        })
      "
      max-height="450"
      border
      style="width: 100%"
    >
      <el-table-column label="序号" width="180" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column label="用户名" width="200" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column label="邮箱" width="300" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.email }}</span>
        </template>
      </el-table-column>

      <el-table-column label="身份" width="180" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.identify }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center">
        <!-- eslint-disable-next-line -->
        <template slot="header" slot-scope="scope">
          <el-input
            v-model="search"
            size="small"
            placeholder="输入关键字搜索"
            style="width: 150px"
            @input="getProfile"
          />
        </template>
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="warning"
            @click="handleEdit(scope.$index, scope.row)"
          >
            分配权限
          </el-button>
        </template>
      </el-table-column>
    </el-table>

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

    <authority-dialog
      :authorityDialog="authorityDialog"
      :form="form"
      @update="getProfile"
    >
    </authority-dialog>
  </div>
</template>

<script>
import AuthorityDialog from "../../components/authorityDialog.vue";
export default {
  name: "YHGL",
  components: { AuthorityDialog },
  data() {
    return {
      search: "",
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
      authorityDialog: { show: false },
      form: {
        type: "",
        identify: "",
        name: "",
      },
    };
  },
  created() {
    this.getProfile();
  },

  methods: {
    getProfile() {
      this.$axios({
        url: "http://127.0.0.1:3007/my/userinfo/getUserInfo",
        method: "get",
        params: {
          pattern: this.search,
        },
      }).then((res) => {
        // this.tableData = res.data.data;
        const m = res.data.data;

        this.allTableData = m;
        this.filterTableData = m;

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
    handleEdit(index, row) {
      this.authorityDialog = {
        show: true,
      };
      this.form = {
        name: row.name,
        identify: row.identify,
        type: "",
      };
    },
  },
};
</script>

<style scoped>
.pagination {
  text-align: right;
  margin-top: 10px;
}
.fillContainer {
  margin-top: 50px;
}
</style>
