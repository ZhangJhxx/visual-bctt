<template>
  <div class="app-container">

    <el-row :gutter="0">
      <el-col
        :span="22"
        :offset="1"
        :xs="{span:24,offset:0}"
      >
        <el-form
          label-width="auto"
          :model="form"
          :rules="rules"
          ref="form"
        >

          <el-form-item :label="$t('postTransation.originatingAddress')">
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

          <el-form-item :label="$t('postTransation.privateKey')">
            <el-input
              v-model="form.private_key"
              :disabled="true"
            />
          </el-form-item>
          <el-form-item :label="$t('postTransation.publicKey')">
            <el-input
              v-model="form.public_key"
              :disabled="true"
            />
          </el-form-item>
          <el-form-item
            prop="to"
            :label="$t('postTransation.receivingAddress')"
            required
          >
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
            prop="value"
            required
          >
            <el-input
              v-model="form.value"
              maxlength="10"
            />
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          :disabled="disable"
          @click="submitForm('form')"
        >{{$t('postTransation.initiateTransaction')}}</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// import Cookies from "js-cookie";
import { query, postTran } from "@/api/ssbc";
import { mapState, mapMutations } from "vuex";

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
        value: 100,
        method: "",
        dest: "",
        args: "{}",
        type: 0,
      },
      disable: false,
      rules: {
        value: [
          { required: true, message: "请输入转账金额", trigger: "blur" },
          { validator: this.validateValue, trigger: "blur" },
        ],
        to: [
          { required: true, message: "请输入转账地址", trigger: "change" },
          { validator: this.validateToAddress, trigger: "change" },
        ],
      },
    };
  },
  created() {
    this.getAllAccounts();
  },
  methods: {
    ...mapMutations("account", ["SET_ACCOUNT"]),
    //检查用户输入金额是否为大于0的整数
    validateValue(rule, value, callback) {
      const reg = /^\d+$/g;
      if (value === "" || value === "0") {
        this.disable = true;
        callback(new Error("金额需大于0"));
      } else if (!reg.test(value)) {
        this.disable = true;
        callback(new Error("金额需为正整数"));
      } else {
        this.disable = false;
        callback();
      }
    },
    //检查选择转账地址是否和发起地址一致
    validateToAddress(rule, value, callback) {
      if (value === this.form.from) {
        this.disable = true;
        callback(new Error("接收地址不能与发起地址一致"));
      } else {
        this.disable = false;
        callback();
      }
    },
    submitForm(formName) {
      this.disable = true;
      setTimeout(() => {
        this.disable = false;
      }, 1000);
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm(
            `<div>
              <span>是否向地址</span>
              <i>${this.form.to}</i>
              <br>
              <span>转账${this.form.value}</span>
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
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // postTran() {
    //   this.disable = true;
    //   setTimeout(() => {
    //     this.disable = false;
    //   }, 1000);

    //   this.$confirm(
    //     `<div>
    //       <span>是否向地址</span>
    //       <i>${this.form.to}</i>
    //       <br>
    //       <span>转账${this.form.value}</span>
    //     </div>`,
    //     "提示",
    //     {
    //       confirmButtonText: "确定",
    //       cancelButtonText: "取消",
    //       type: "warning",
    //       dangerouslyUseHTMLString: true,
    //     }
    //   ).then(() => {
    //     postTran(this.form).then((res) => {
    //       if (res.error === "") {
    //         this.$message({
    //           message: "成功提交",
    //           type: "success",
    //         });
    //       } else {
    //         this.$message({
    //           message: res.error,
    //           type: "warning",
    //         });
    //       }
    //     });
    //   });
    // },
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
          // Cookies.set('PublicKey', '')
          // Cookies.set('PrivateKey', '')
          // Cookies.set('AccountAddress', '')
          this.SET_ACCOUNT({
            PublicKey: "",
            PrivateKey: "",
            AccountAddress: "",
          });
        } else {
          // this.form.from = Cookies.get('AccountAddress')
          // this.form.private_key = Cookies.get('PrivateKey')
          // this.form.public_key = Cookies.get('PublicKey')
          this.form.from = this.AccountAddress;
          this.form.private_key = this.PrivateKey;
          this.form.public_key = this.PublicKey;
        }
      });
    },
    chooseSender(item) {
      this.form.from = item.address;
      this.form.public_key = item.publickey;
      this.form.private_key = item.privatekey;

      // Cookies.set("AccountAddress", item.address);
      // Cookies.set("PublicKey", item.publickey);
      // Cookies.set("PrivateKey", item.privatekey);
      this.SET_ACCOUNT({
        PublicKey: item.publickey,
        PrivateKey: item.privatekey,
        AccountAddress: item.address,
      });
    },
    chooseReceiver(item) {
      this.form.to = item.address;
    },
  },
  computed: {
    ...mapState("account", {
      PublicKey: (state) => state.PublicKey,
      PrivateKey: (state) => state.PrivateKey,
      AccountAddress: (state) => state.AccountAddress,
    }),
  },
};
</script>
<style>
.el-message-box {
  width: 600px;
}
</style>
