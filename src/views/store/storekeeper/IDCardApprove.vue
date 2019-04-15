<template>
  <div class="m-IDCard-box">
    <div class="m-IDCard-bg"></div>
    <div class="m-content">
      <!--<div class="m-IDCard-top" v-if="user.uslevel == '2'">
        <div class="m-IDCard-rows">
          <div class="m-row-left m-left-url">大行星后台管理系统网址</div>
          <div class="m-row-right" id="url" @click="copyText('url')">{{user.manager_address}}</div>
        </div>
        <div class="m-IDCard-rows">
          <div class="m-row-left">账号</div>
          <div class="m-row-right" id="userName" @click="copyText('userName')">{{user.adname}}</div>
        </div>
        <div class="m-IDCard-rows">
          <div class="m-row-left">密码</div>
          <div class="m-password-box">
            <div class="m-row-right">{{password}}</div>
            <div class="m-eye-icon" :class="showPassword ? 'active' : ''" @click="passWord"></div>
          </div>
        </div>
      </div>-->
      <div class="m-IDCard">
        <div>
          <div class="m-IDCard-row">
            <div class="m-row-title">真实姓名</div>
            <input type="text" class="m-row-input m-width-220" v-model="user.usrealname" placeholder="请填写真实姓名"
                   :readonly="user.uslevel == '2' || user.uslevel == '3'">
          </div>
          <div class="m-IDCard-row" @click="genderPopup = true" v-if="user.uslevel == '1' || user.uslevel == '4'">
            <div class="m-row-title">性别</div>
            <div class="m-row-input m-width-450">{{user.usGender}}</div>
          </div>
          <div class="m-IDCard-row" v-if="user.uslevel == '2' || user.uslevel == '3'">
            <div class="m-row-title">性别</div>
            <div class="m-row-input m-width-450">{{user.usGender}}</div>
          </div>
          <!--性别picker-->
          <mt-popup class="m-gender-popup" v-model="genderPopup" position="bottom">
            <div class="m-popup-btn">
              <div @click="genderPopup = false">取消</div>
              <div @click="genderDone">确认</div>
            </div>
            <mt-picker :slots="slots" @change="genderChange"></mt-picker>
          </mt-popup>
          <!--<div class="m-IDCard-row">
            <div class="m-row-title">手机号码</div>
            <input type="text" class="m-row-input m-width-450" v-model="user.ustelphone" placeholder="请填写手机号码" :readonly="user.uslevel != '1'">
          </div>-->
          <div class="m-IDCard-row">
            <div class="m-row-title">身份证号</div>
            <input type="text" class="m-row-input m-width-450" v-model="user.usidentification" maxlength="18"
                   placeholder="请填写身份证号" :readonly="user.uslevel == '2' || user.uslevel == '3'">
          </div>
          <div class="m-IDCard-row">
            <div class="m-row-title">身份证照片</div>
          </div>
        </div>
        <div class="m-IDCard-img">
          <img class="m-IDCard-img" v-if="umfrontTemp" :src="umfrontTemp" alt="">
          <input type="file" name="file" class="m-upload-input" value=""
                 accept="image/*" multiple=""
                 @change="uploadFrontImg" :disabled="user.uslevel == '2' || user.uslevel == '3'">
        </div>
        <div class="m-IDCard-img">
          <img class="m-IDCard-img" v-if="umbackTemp" :src="umbackTemp" alt="">
          <input type="file" name="file" class="m-upload-input" value=""
                 accept="image/*" multiple=""
                 @change="uploadBackImg" :disabled="user.uslevel == '2' || user.uslevel == '3'">
        </div>
        <!--按钮-->
        <div class="m-foot-btn" v-if="user.uslevel == '1' || user.uslevel == '4'">
          <span @click="submitUser">提交认证</span>
        </div>
        <!--弹窗-->
        <mt-popup class="m-submit-popup" v-model="submitPopup" pop-transition="popup-fade">
          <img class="m-submit-loading" src="/static/images/icon-loading.png" alt="">
          <div class="m-ft-30 m-ft-b">提交成功</div>
          <div class="m-submit-text m-ft-24">管理员审核中，请耐心等待</div>
        </mt-popup>
        <!--弹窗-->
        <mt-popup class="m-submit-popup" v-model="auditPopup" pop-transition="popup-fade">
          <!--<div>
            <img class="m-submit-loading" src="/static/images/icon-no.png" alt="">
            <div class="m-ft-30 m-ft-b">审核未通过</div>
            <div class="m-submit-text m-ft-24">请检查所输入的信息后，再次提交</div>
          </div>-->
          <div>
            <img class="m-submit-loading" src="/static/images/icon-out-know.png" alt="">
            <div class="m-ft-30 m-ft-b">审核通过</div>
            <div class="m-submit-text m-ft-24">请依据给出的网址、用户名和密码登录</div>
          </div>
        </mt-popup>
      </div>
    </div>
  </div>
</template>

<script>
  import common from '../../../common/js/common';
  import axios from 'axios';
  import api from '../../../api/api';
  import {Toast} from 'mint-ui';

  export default {
    name: "IDCardApprove",
    data() {
      return {
        name: 'IDCardApprove',
        password: "******",
        showPassword: false,
        submitPopup: false,
        auditPopup: false,
        user: {usGender: "请选择性别"},      // 用户信息
        genderPopup: false,                   // 性别picker
        slots: [{values: ['男', '女']}],
        gender: "",                           // 暂存性别
        umfrontTemp: "",                      // 暂存正面
        umbackTemp: "",                       // 暂存反面
      }
    },
    methods: {
      // 复制文本
      copyText(v) {
        let text = document.getElementById(v).innerText;
        this.$copyText(text).then(function (e) {
          Toast("已复制到剪切板");
        }, function (e) {
          console.log(e);
        })
      },
      // 查看密码
      passWord() {
        if (this.showPassword) {
          this.showPassword = false;
          this.password = "******";
        } else if (!this.showPassword) {
          this.showPassword = true;
          this.password = this.user.adpassword;
        }
      },
      //上传正面图片
      uploadFrontImg(e) {
        let files = e.target.files || e.dataTransfer.files;
        if (!files.length)
          return;
        if (files[0].size/1024/1024 > 15) {
          Toast('图片不应大于15M');
          return false
        }
        let reader = new FileReader();
        let that = this;
        let form = new FormData();
        form.append("file", files[0]);
        axios.post(api.upload_file + '?type=idcard&token=' + localStorage.getItem('token'), form).then(res => {
          if (res.data.status == 200) {
            this.user.umfront = res.data.data;
            reader.readAsDataURL(files[0]);
            reader.onload = function (e) {
              that.umfrontTemp = this.result;
            }
          }
        })
      },
      //上传反面图片
      uploadBackImg(e) {
        let files = e.target.files || e.dataTransfer.files;
        if (!files.length)
          return;
        if (files[0].size/1024/1024 > 15) {
          Toast('图片不应大于15M');
          return false
        }
        let reader = new FileReader();
        let that = this;
        let form = new FormData();
        form.append("file", files[0]);
        axios.post(api.upload_file + '?type=idcard&token=' + localStorage.getItem('token'), form).then(res => {
          if (res.data.status == 200) {
            this.user.umback = res.data.data;
            reader.readAsDataURL(files[0]);
            reader.onload = function (e) {
              that.umbackTemp = this.result;
            }
          }
        })
      },
      // 获取个人身份证详情
      getIdentifyinginfo() {
        axios.get(api.get_identifyinginfo + '?token=' + localStorage.getItem('token')).then(res => {
          if (res.data.status == 200) {
            // console.log(res.data.data);
            this.user = res.data.data;
            this.umfrontTemp = this.user.umfront;
            this.umbackTemp = this.user.umback;
            // 性别判断
            if (this.user.usgender == "0") {
              this.user.usGender = "男";
            } else if (this.user.usgender == "1") {
              this.user.usGender = "女";
            }
          }
        });
      },
      // 性别picker的确认按钮
      genderDone() {
        this.genderPopup = false;
        this.user.usGender = this.gender;
        // 性别判断
        if (this.gender == "男") {
          this.user.usgender = "0";
        } else if (this.gender == "女") {
          this.user.usgender = "1";
        }
      },
      // picker选择的性别改变
      genderChange(picker, values) {
        this.gender = values[0];
      },
      // 提交认证按钮
      submitUser() {
        if (!this.user.usrealname) {
          Toast("请输入真实姓名");
          return false;
        }
        if (!this.user.usidentification) {
          Toast("请输入身份证号");
          return false;
        }
        if (!this.user.umfront) {
          Toast("请上传身份证照片");
          return false;
        }
        if (!this.user.umback) {
          Toast("请上传身份证照片");
          return false;
        }
        let params = {
          // ustelphone: this.user.ustelphone,
          usgender: this.user.usgender,
          usrealname: this.user.usrealname,
          usidentification: this.user.usidentification,
          umfront: this.user.umfront,
          umback: this.user.umback,
        };

        //  买家和购买大礼包 身份api 区分
        if(this.user.uslevel == 4){
          axios.post(api.upgrade_agent + "?token=" + localStorage.getItem('token'), params).then(res => {
            if (res.data.status == 200) {
              Toast(res.data.message);
              // 申请提交成功则返回上一页
              this.$router.go(-1);
              this.submitPopup = true;
            }
          });
        }else{
          axios.get(api.check_idcode, {
            params: {
              token: localStorage.getItem('token'),
              ...params,
            }
          }).then(
            res =>{
              if (res.data.status == 200) {
                Toast(res.data.message);
                // 申请提交成功则返回上一页
                this.$router.go(-1);
                this.submitPopup = true;
              }
            }
          )
        }
      }
    },
    mounted() {
      common.changeTitle('身份证认证');
      this.getIdentifyinginfo();            // 获取个人身份证详情
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  @import "../../../common/css/index";

  .m-IDCard-box {
    min-height: 105vh;
    background-color: #EEEEEE;
    .m-IDCard-bg {
      width: 750px;
      height: 371px;
      background: linear-gradient(180deg, @mainColor 0%, @subColor 100%);
    }
    .m-content {
      position: absolute;
      top: 25px;
      .m-IDCard-top {
        width: 600px;
        padding: 60px 50px 30px 50px;
        margin: 25px;
        border-radius: 10px;
        background-color: #ffffff;
        box-shadow: 0 5px 6px rgba(0, 0, 0, 0.16);
        .m-IDCard-rows {
          display: flex;
          justify-content: space-between;
          text-align: left;
          margin-bottom: 10px;
          .m-row-left {
            font-size: 24px;
            color: #999999;
          }
          .m-left-url {
            width: 200px;
            margin-bottom: 30px;
          }
          .m-password-box {
            display: flex;
          }
          .m-row-right {
            font-size: 30px;
          }
          .m-eye-icon {
            width: 28px;
            height: 28px;
            background: url("/static/images/icon-eye-close.png") no-repeat;
            background-size: 100% 100%;
            margin-left: 10px;
            &.active {
              background: url("/static/images/icon-eye-open.png") no-repeat;
              background-size: 100% 100%;
            }
          }
        }
      }
      .m-IDCard {
        width: 600px;
        height: 950px;
        padding: 60px 50px;
        margin: 0 0 260px 25px;
        border-radius: 10px;
        background-color: #ffffff;
        box-shadow: 0 5px 6px rgba(0, 0, 0, 0.16);
        .m-IDCard-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 25px;
          padding-bottom: 20px;
          border-bottom: 1px #CCCCCC solid;
          &:last-child {
            border-bottom: 0;
          }
          .m-row-title {
            color: #999999;
            font-size: 30px;
            margin-right: 32px;
          }
          .m-row-input {
            color: #999999;
            border-radius: 30px;
            font-size: 24px;
            text-align: right;
          }
          .m-width-220 {
            width: 220px;
          }
          .m-width-450 {
            width: 400px;
          }
        }
        .m-gender-popup {
          width: 750px;
          .m-popup-btn {
            display: flex;
            justify-content: space-between;
            font-size: 28px;
            padding: 20px 40px 0 40px;
          }
        }
        .m-IDCard-img {
          float: left;
          width: 377px;
          height: 247px;
          margin-bottom: 30px;
          border-radius: 30px;
          background: url('/static/images/icon-upload-IDCard-img.png') no-repeat;
          background-size: 100% 100%;
          display: inline-block;
          margin-right: 20px;
          position: relative;
        }
        .m-upload-input {
          position: absolute;
          top: 0;
          left: 0;
          opacity: 0;
          width: 377px;
          height: 247px;
        }
        .m-foot-btn {
          position: absolute;
          bottom: 50px;
          left: 25px;
          span {
            color: #ffffff;
            display: inline-block;
            width: 700px;
            height: 106px;
            line-height: 106px;
            background-color: @mainColor;
            font-size: 38px;
            font-weight: bold;
            border-radius: 10px;
            box-shadow: 0 5px 6px rgba(0, 0, 0, 0.16);
          }
        }
        .m-submit-popup {
          width: 700px;
          height: 440px;
          margin: -300px 0 0 25px;
          border-radius: 30px;
          .m-submit-loading {
            width: 85px;
            height: 85px;
            margin: 99px 0 36px 0;
          }
          .m-submit-text {
            margin-top: 53px;
          }
        }
      }
    }
  }
</style>
