<template>
  <div class="m-personal">
    <div class="m-personal-bg">
      <span class="m-icon-bg"></span>
    </div>
    <div class="m-personal-content m-setUp">
      <div class="m-personal-info">
        <img class="m-personal-head-portrait" :src="user.usheader" alt="">
        <div class="m-personal-info-box">
          <div class="m-personal-info-text">
            <div>
              <p>{{user.usname}}</p>
              <p>
                <span class="m-personal-identity">{{user.usidname}}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="m-personal-body">
        <div class="m-one-part">
          <ul class="m-edit-ul">
            <li>
              <div>
                <span>姓名</span>
              </div>
              <div>
                <input type="text" class="m-edit-input" v-model="user.usrealname" placeholder="请输入真实姓名" :readonly="user.uslevel != '1'">
              </div>
            </li>
            <li @click="genderPopup = true" v-if="user.uslevel == '1'">
              <div>
                <span>性别</span>
              </div>
              <div>
                <span>{{user.usGender}}</span>
              </div>
            </li>
            <li v-if="user.uslevel != '1'">
              <div>
                <span>性别</span>
              </div>
              <div>
                <span>{{user.usGender}}</span>
              </div>
            </li>
            <li>
              <div>
                <span>手机号</span>
              </div>
              <div>
                <input type="text" class="m-edit-input" v-model="user.ustelphone" placeholder="请输入手机号" :readonly="user.uslevel != '1'">
              </div>
            </li>
            <li @click="changeRoute('/storekeeper/IDCardApprove')">
              <div>
                <span>身份证认证</span>
              </div>
              <div>
                <span>{{idStatus}}</span>
                <span class="m-icon-more"></span>
              </div>
            </li>
          </ul>
          <!--性别picker-->
          <mt-popup class="m-gender-popup" v-model="genderPopup" position="bottom">
            <div class="m-popup-btn">
              <div @click="genderPopup = false">取消</div>
              <div @click="genderPopup = false">确认</div>
            </div>
            <mt-picker :slots="slots" @change="genderChange"></mt-picker>
          </mt-popup>
        </div>
      </div>
    </div>
    <div class="m-submit-status" v-if="submitStatus">{{submitStatus}}</div>
    <div class="m-foot-btn">
      <span @click="submitApply" v-if="!submitDone">提交申请</span>
      <span class="foot-btn" v-if="submitDone">提交申请</span>
    </div>
  </div>

</template>

<script type="text/ecmascript-6">
  import { MessageBox } from 'mint-ui';
  import common from '../../../common/js/common';
  import axios from 'axios';
  import api from '../../../api/api';
  import { Toast } from 'mint-ui';

  export default {
    data() {
      return {
        name: 'applyOwner',
        user: {},                       // 用户信息
        genderPopup: false,             // 性别picker
        idStatus: "",                   // 用户是否已完成身份认证
        submitStatus: "",               // 成为店主的申请状态
        submitDone: false,              // 成为店主的申请是否已提交
        slots: [{ values: ['男', '女'] }],
      }
    },
    components: {},
    methods: {
      // 跳转页面
      changeRoute(v){
        this.$router.push(v);
      },
      // 提交申请
      submitApply() {
        MessageBox.confirm('是否确认提交该申请?').
        then(() => {
          let params = {
            ustelphone: this.user.ustelphone,
            usrealname: this.user.usrealname,
          };
          if(this.user.usGender == "男") {
            params.usgender = "0";
          }else if(this.user.usGender == "女") {
            params.usgender = "1";
          }
          // console.log(params);
          axios.post(api.upgrade_agent + '?token=' + localStorage.getItem('token'), params).then(res => {
            if(res.data.status == 200){
              this.submitStatus = "申请中";
              this.submitDone = true;
              Toast("提交成功");
            }
          });
        }).catch(() => {
          this.submitStatus = "";
          this.submitDone = false;
        });
      },
      // 获取用户信息
      getUser() {
        axios.get(api.get_home + "?token=" + localStorage.getItem('token')).then(res => {
          if(res.data.status == 200){
            this.user = res.data.data;
            // 性别判断
            if(this.user.usgender == "0") {
              this.user.usGender = "男";
            }else if(this.user.usgender == "1") {
              this.user.usGender = "女";
            }
            // 身份证认证状态判断
            if(this.user.usidentification == "") {
              this.idStatus = "待认证";
            }else {
              this.idStatus = "已认证";
            }
            // 申请成为卖家中
            if(this.user.uslevel == "3") {
              this.submitStatus = "申请中";
              this.submitDone = true;
            }
          }
        });
      },
      // picker选择的性别改变
      genderChange(picker, values) {
        this.user.usGender = values[0];
      }
    },
    mounted() {
      common.changeTitle('店主申请');
      this.getUser();     // 获取用户信息
    }
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>
  @import "../../../common/css/personal";

  .m-gender-popup {
    width: 750px;
    .m-popup-btn {
      display: flex;
      justify-content: space-between;
      font-size: 28px;
      padding: 20px 40px 0 40px;
    }
  }
</style>
