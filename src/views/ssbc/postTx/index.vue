<template>
  <div class="app-container">

    <el-row :gutter="0">
      <el-col
        :span="22"
        :offset="1"
        :xs="24"
      >
        <el-form
          label-width="80px"
          :model="form"
          :rules="rules"
        >

          <el-form-item 
          :label="$t('postTransation.originatingAddress')"
          :label-width="'180px'">
            <el-select
              v-model="form.from"
              style="width: 100%"
              class="filter-item"
            >
              <el-option
                v-for="user in userList"
                :key="user.address"
                :label="user.address"
                :value="user.address"
                @click.native="chooseSender(user)"
              />
            </el-select>
    
          </el-form-item>

          <el-form-item :label="$t('postTransation.privateKey')" :label-width="'180px'">
            <el-input
              v-model="form.private_key"
              :disabled="true"
            />
          </el-form-item>
          <el-form-item :label="$t('postTransation.publicKey')" :label-width="'180px'">
            <el-input
              v-model="form.public_key"
              :disabled="true"
            />
          </el-form-item>
          <el-form-item :label="$t('postTransation.receivingAddress')" :label-width="'180px'">
            <el-select
              v-model="form.to"
              style="width: 100%"
            >
              <el-option
                v-for="user in userList"
                :key="user.address"
                :label="user.address"
                :value="user.address"
                @click.native="chooseReceiver(user)"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$t('postTransation.amount')"
            :label-width="'180px'"
            prop="figure"
          >
            <el-input
              v-model="form.figure"
              maxlength="10"
            />
          </el-form-item>
        </el-form>
        <el-button
        style="margin-left: 180px"
          type="primary"
          :disabled="disable"
          @click="postTran"
        >{{$t('postTransation.initiateTransaction')}}</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import { query, postTran } from "@/api/ssbc";

export default {
  data() {
    
    return {
      q: {
        type: "getAllAccounts",
        parameters: [],
      },
      userList: [],
      form: {
        private_key: "",
        public_key: "",
        from: "",
        to: "",
        contract: "",
        figure: 100,
        method: "",
        dest: "",
        args: "{}",
        type: 0,
      },
      disable: false,
      rules: {
        figure: [{ validator: this.validateFigure, trigger: "blur" }],
      },
    };
  },
  created() {
    this.getAllAccounts();
  },
  methods: {
    validateFigure(rule, value, callback){
      const reg = /^\d+$/g;
      if (value === "" || value === "0") {
        this.disable=true;
        callback(new Error("金额需大于0"));
      } else if (!reg.test(value)) {
         this.disable=true;
        callback(new Error("金额需为正整数"));
      }else{
        this.disable=false;
        callback();
      }
    },
    postTran() {
      this.disable = true;
      setTimeout(() => {
        this.disable = false;
      }, 1000);
      this.$confirm(
        `<div>
          <span>是否向地址</span>
          <i>${this.form.to}</i>
          <br>
          <span>转账${this.form.figure}</span>
        </div>`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          dangerouslyUseHTMLString: true,
        }
      ).then(() => {
        postTran(this.form).then((res) => {
          if (res.error === "") {
            this.$message({
              message: "成功提交",
              type: "success",
            });
          } else {
            this.$message({
              message: res.error,
              type: "warning",
            });
          }
        });
      });
    },
    getAllAccounts() {
      query(this.q).then((res) => {
        // 筛选出普通账户和智能合约账户
        const user = [];
        const contract = [];
        const total = res.data;
        total.forEach(function (r) {
          if (!r.iscontract) {
            user.push(r);
          } else {
            contract.push(r);
          }
        });
        this.userList = user;
        if (user.length === 0) {
          this.form.from = "";
          this.form.private_key = "";
          this.form.public_key = "";
          Cookies.set("PublicKey", "");
          Cookies.set("PrivateKey", "");
          Cookies.set("AccountAddress", "");
        } else {
          this.form.from = Cookies.get("AccountAddress");
          this.form.private_key = Cookies.get("PrivateKey");
          this.form.public_key = Cookies.get("PublicKey");
        }
      });
    },
    chooseSender(item) {
      this.form.from = item.address;
      this.form.public_key = item.publickey;
      this.form.private_key = item.privatekey;

      Cookies.set("AccountAddress", item.address);
      Cookies.set("PublicKey", item.publickey);
      Cookies.set("PrivateKey", item.privatekey);
    },
    chooseReceiver(item) {
      this.form.to = item.address;
    },
  },
};
</script>
<style>
.el-message-box {
  width: 600px;
}
</style>
