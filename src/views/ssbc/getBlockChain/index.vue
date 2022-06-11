<template>
  <div class="app-container">
    <el-table
      v-if="showTable"
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      highlight-current-row
      max-height="800"
    >
      <el-table-column
        width="80"
        align="center"
        label="区块高度"
      >
        <template slot-scope="scope">
          <span> {{ scope.row.Height }}</span>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="前一区块hash"
      >
        <template slot-scope="scope">
          <!-- <el-tooltip class="item" effect="dark" placement="top">
            <div slot="content">0x{{ scope.row.from }}</div>
            <router-link :to="{ path: '/address/index', query: { id: scope.row.to }}">
              <el-link type="primary"> -->
          <span>{{ scope.row.PrevHash }}</span>
          <!-- </el-link>
            </router-link>
          </el-tooltip> -->
        </template>
      </el-table-column>
      <!--      <el-table-column class-name="status-col" width="200" align="center" label="签名">-->
      <!--        <template slot-scope="scope">-->
      <!--          {{ scope.row.Signature }}-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column
        align="center"
        prop="created_at"
        label="区块hash"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.Hash }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="Merkle根"
      >
        <template slot-scope="scope">
          {{ scope.row.MerkleRoot }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="时间戳"
      >
        <template slot-scope="scope">
          <!-- <el-tooltip class="item" effect="dark" placement="top">
            <div slot="content">0x{{ scope.row.from }}</div>
            <router-link :to="{ path: '/address/index', query: { id: scope.row.from }}">
              <el-link type="primary"> -->
          <span>{{ getTime(scope.row.Timestamp) }}</span>
          <!-- </el-link>
            </router-link>
          </el-tooltip> -->
        </template>
      </el-table-column>
    </el-table>
    <el-collapse
      v-else
      v-model="activeNames"
      @change="handleChange"
    >
      <el-collapse-item
        v-for="(item,index) in list"
        :key="item.Hash"
        :title="'区块Hash: '+item.Hash"
        :name="index"
      >
        <div>
          <span class="title">区块高度：</span>
          <span>{{item.Height}}</span>
        </div>
        <div>
          <span class="title">前一区块：</span>
          <span>{{item.PrevHash}}</span>
        </div>
        <div>
          <span class="title">Merkle根：</span>
          <span>{{item.MerkleRoot}}</span>
        </div>
        <div>
          <span class="title">时间戳：&nbsp;&nbsp;&nbsp;</span>
          <span>{{item.Timestamp.split(".")[0]}}</span>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import { query } from "@/api/ssbc";
import { throttle } from "../../../utils/throttle";

export default {
  data() {
    return {
      showTable: false,
      q: {
        type: "getBlockChain",
        parameters: [],
      },
      list: null,
      listLoading: true,
      activeNames: [0],
    };
  },
  created() {
    this.getBlockChain();
  },
  mounted() {
    window.addEventListener(
      "resize",
      throttle(() => {
        this.tableOrCollapse();
      }, 1000)
    );
  },
  methods: {
    tableOrCollapse() {
      const val = document.body.clientWidth;
      // console.log(val);
      const def = 768; // 默认宽度
      if (val < def) {
        this.showTable = false;
      } else {
        this.showTable = true;
      }
    },
    getBlockChain() {
      query(this.q).then((res) => {
        console.log("getBlockChain:", res);
        this.list = res.data;
        console.log(this.list);
        this.listLoading = false;
      });
    },
    getTime(str) {
      return str.slice(0, 19);
    },
    handleChange(val) {
      console.log(val);
    },
  },
};
</script>

<style scoped lang="scss">
.title{
  font-weight: 600;
}
.app-container {
  ::v-deep {
    .el-collapse {
      box-sizing: border-box;
      border: none;
      .el-collapse-item__header {
        border: none;
        border-bottom: 1px solid #e8e8e8;
        background-color: transparent;
        font-weight: 700;
      }
      .el-collapse-item__wrap {
        background-color: transparent;
        border: none;
        .el-collapse-item__content {
          padding-left: 25px;
          padding-bottom: 10px;
        }
      }
    }
  }
}
</style>
