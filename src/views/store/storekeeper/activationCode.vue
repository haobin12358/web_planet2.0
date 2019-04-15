<template>
  <div class="m-IDCard-box">
    <div class="m-IDCard-bg"></div>
    <div class="m-content">
      <div class="m-IDCard">
        <div>
          <p class="m-title m-ft-32">打款信息</p>
          <div class="m-IDCard-row">
            <div class="m-row-title">姓名</div>
            <input type="text" class="m-row-input m-width-450" v-model="name" placeholder="请填写姓名">
          </div>
          <div class="m-IDCard-row">
            <div class="m-row-title">银行卡号</div>
            <input type="text" class="m-row-input m-width-450" v-model="bankNo" maxlength="20" placeholder="请填写银行卡号">
          </div>
          <div class="m-IDCard-row">
            <div class="m-row-title">银行名称</div>
            <!--<input type="text" class="m-row-input m-width-450" v-model="bank" maxlength="18" placeholder="请选择银行">-->
            <div @click="getBankName">{{bank}}</div>
          </div>
          <div class="m-IDCard-row">
            <div class="m-row-title">打款凭证</div>
          </div>
        </div>
        <!--添加视频和图片的区域-->
        <div class="m-upload-box">
          <div>
            <div class="m-selectBack-img-box">
              <div class="img-box" v-for="(item,index) in img_box">
                <img class="circle-img" :src="item" alt="" @click="previewImage(index, image)">
                <img class="del-img" src="/static/images/icon-close.png" alt="" @click="deleteImg(index)">
              </div>
              <div class="m-selectBack-camera" v-if="img_box.length < 4">
                <input type="file" name="file" class="m-upload-input" value="" accept="image/*" multiple="" @change="uploadImg" ref="voucherImg">
              </div>
            </div>
          </div>
        </div>

        <div class="m-rule">
          <img class="m-agree-img" v-if="!agree" src="/static/images/icon-radio.png" @click="agree = true">
          <img class="m-agree-img" v-if="agree" src="/static/images/icon-radio-active.png" @click="agree = false">
          <p class="m-rule-text">我已阅读并同意 <span class="m-rule-popup-text" @click="rulePopup = true">规则</span></p>
        </div>
        <!--按钮-->
        <div class="m-foot-btn">
          <span :class="!agree ? 'not-agree':''" @click="submitUser">提交申请</span>
        </div>
        <!--规则弹窗-->
        <mt-popup class="m-rule-popup" v-model="rulePopup" pop-transition="popup-fade">
          <div class="m-rule-title">
            <div class="m-rule-title-text m-ft-32">规 则</div>
            <div class="m-popup-close m-ft-28" @click="rulePopup = false">X</div>
          </div>
          <div class="m-rule-text-box m-ft-28">{{rule.acrrule}}</div>
          <div class="m-rule-row">
            <div class="m-rule-left">购买数量</div>
            <div class="m-rule-right" @click="copyText(rule.acrnum)">{{rule.acrnum}}</div>
          </div>
          <div class="m-rule-row" v-if="rule.acrcash">
            <div class="m-rule-left">所需金额</div>
            <div class="m-rule-right">￥{{rule.acrcash | money}}</div>
          </div>
          <div class="m-rule-row">
            <div class="m-rule-left">卡号</div>
            <div class="m-rule-right" @click="copyText(rule.acrbanksn)">{{rule.acrbanksn}}</div>
          </div>
          <div class="m-rule-row">
            <div class="m-rule-left">开户行</div>
            <div class="m-rule-right" @click="copyText(rule.acrbankaddress)">{{rule.acrbankaddress}}</div>
          </div>
          <div class="m-rule-row">
            <div class="m-rule-left">开户人</div>
            <div class="m-rule-right" @click="copyText(rule.acrname)">{{rule.acrname}}</div>
          </div>
          <div class="m-rule-row">
            <div class="m-rule-left">电话</div>
            <div class="m-rule-right" @click="copyText(rule.acrphone)">{{rule.acrphone}}</div>
          </div>
          <div class="m-rule-row">
            <div class="m-rule-left">地址</div>
            <div class="m-rule-right" @click="copyText(rule.acraddress)">{{rule.acraddress}}</div>
          </div>
          <div class="m-rule">
            <img class="m-agree-img" v-if="!agree" src="/static/images/icon-radio.png" @click="agree = true">
            <img class="m-agree-img" v-if="agree" src="/static/images/icon-radio-active.png" @click="agree = false">
            <p class="m-rule-text">我已阅读并同意以上规则</p>
          </div>
          <div class="m-rule-row">
            <div class="m-rule-left m-ft-22"><span style="color: red">* </span>以上打款信息可点击复制</div>
            <div class="m-rule-right"></div>
          </div>
        </mt-popup>
        <!--提交成功弹窗-->
        <mt-popup class="m-submit-popup" v-model="submitPopup" pop-transition="popup-fade">
          <img class="m-submit-loading" src="/static/images/icon-loading.png" alt="">
          <div class="m-ft-30 m-ft-b">提 交</div>
          <div class="m-submit-text m-ft-24">管理员审核中，请耐心等待</div>
        </mt-popup>
        <!--审核通过弹窗-->
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
  import { Toast } from 'mint-ui';
  import wxapi from '../../../common/js/mixins'

  export default {
    name: "IDCardApprove",
    data() {
      return {
        submitPopup: false,
        auditPopup: false,
        rulePopup: true,
        rule: {},
        name: "",
        bankNo: "",
        bank: "请选择银行",
        agree: false,
        img_box: [],
        image: [],
      }
    },
    mixins: [wxapi],
    methods: {
      // 预览图片
      previewImage(index, image) {
        let images = [];
        for(let i = 0; i < image.length; i ++) {
          images.push(location.origin + image[i]);
        }
        let options = {
          current: location.origin + image[index], // 当前显示图片的http链接
          urls: images,                  // 当前预览图片的list
        };
        wxapi.previewImage(options);
      },
      // 删除图片
      deleteImg(index) {
        this.img_box.splice(index, 1);
        this.image.splice(index, 1);
      },
      // 复制文本
      copyText(text) {
        // let text = document.getElementById(v).innerText;
        this.$copyText(text).then(function (e) {
          Toast({ message: '已复制到剪切板', position: 'bottom' });
        });
      },
      //上传图片
      uploadImg(e) {
        if(this.img_box && this.img_box.length == 4) {
          Toast('最多只可上传4张图片');
          return false;
        }
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
        axios.post(api.upload_file + '?type=voucher&token=' + localStorage.getItem('token'), form).then(res => {
          if(res.data.status == 200){
            let img = res.data.data;
            this.image.push(img);
            reader.readAsDataURL(files[0]);
            reader.onload = function(e) {
              that.img_box.push(this.result);
            };
            this.$refs.voucherImg.value = '';
          }
        })
      },
      // 获取银行名称
      getBankName() {
        if(this.bankNo.length < 16) {
          Toast('请先输入正确的银行卡号');
          return false;
        }
        axios.get(api.get_bankname + "?cncardno=" + this.bankNo).then(res => {
          if(res.data.status == 200) {
            if(!res.data.data.validated) {
              Toast('该银行卡已失效');
            }else {
              this.bank = res.data.data.cnbankname;
            }
          }
        })
      },
      // 获取个人激活码购买规则(购买申请页)
      getCodeRule() {
        axios.get(api.get_code_rule + '?token=' + localStorage.getItem('token')).then(res => {
          if(res.data.status == 200){
            this.rule = res.data.data;
          }
        });
      },
      // 提交认证按钮
      submitUser() {
        if(!this.agree){
          // Toast("请阅读并勾选同意购买激活码的规则");
          return false;
        }
        if(!this.name){
          Toast("请填写姓名");
          return false;
        }
        if(!this.bankNo){
          Toast("请填写银行卡号");
          return false;
        }
        if(!this.bank || this.bank == '请选择银行'){
          Toast("请选择银行");
          return false;
        }
        if(!this.image.length){
          Toast("请上传凭证");
          return false;
        }
        let params = {
          acabankname: this.bank,
          acabanksn: this.bankNo,
          acaname: this.name,
          vouchers: this.image
        };
        axios.post(api.act_code_apply + "?token=" + localStorage.getItem('token'), params).then(res => {
          if(res.data.status == 200){
            Toast(res.data.message);
            // 提交成功则返回上一页
            this.$router.go(-1);
          }
        });
      }
    },
    mounted() {
      common.changeTitle('购买激活码');
      this.getCodeRule();            // 获取个人激活码购买规则(购买申请页)
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  @import "../../../common/css/index";

  .m-IDCard-box {
    min-height: 100vh;
    background-color: #EEEEEE;
    .m-IDCard-bg {
      width: 750px;
      height: 371px;
      background: linear-gradient(180deg, @mainColor 0%, @subColor 100%);
    }
    .m-content {
      position: absolute;
      top: 25px;
      .m-IDCard {
        width: 600px;
        padding: 60px 50px 30px 50px;
        margin: 0 0 260px 25px;
        border-radius: 10px;
        background-color: #ffffff;
        box-shadow: 0 5px 6px rgba(0,0,0,0.16);
        .m-upload-box{
          display: flex;
          flex-flow: row;
          justify-content: space-between;
          align-items: flex-end;
          margin-top: 20px;
          .m-selectBack-img-box{
            margin-bottom: 30px;
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            .img-box {
              position: relative;
              .circle-img {
                display: inline-block;
                width: 186px;
                height: 186px;
                margin-bottom: 20px;
                margin-right: 25px;
              }
              .del-img {
                width: 40px;
                height: 40px;
                position: absolute;
                top: -20px;
                right: -15px;
              }
            }
            .m-selectBack-camera{
              width: 180px;
              height: 180px;
              background: url('/static/images/icon-camera-text.png') no-repeat;
              background-size: 100% 100%;
              display: inline-block;
              margin: 0 15px 15px 0;
              position: relative;
            }
            .m-upload-input{
              width: 180px;
              height: 180px;
              position: absolute;
              top: 0;
              left: 0;
              opacity: 0;
            }
            img{
              display: inline-block;
              width: 180px;
              height: 180px;
              margin-bottom: 20px;
              margin-right: 15px;
            }
          }
        }
        .m-title {
          color: #999999;
          text-align: left;
          margin: -20px 0 40px 0;
        }
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
            font-size: 26px;
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
        .m-IDCard-img {
          position: relative;
          text-align: left;
          width: 377px;
          height: 247px;
          margin-bottom: 30px;
          border-radius: 30px;
          background: url('/static/images/icon-upload-IDCard-img.png') no-repeat;
          background-size: 100% 100%;
        }
        .m-rule {
          display: flex;
          padding-bottom: 10px;
          .m-agree-img {
            width: 35px;
            height: 35px;
            margin-right: 20px;
          }
          .m-rule-text {
            color: #999999;
            font-size: 24px;
            .m-rule-popup-text {
              color: #333333;
              border-bottom: 1px #333333 solid;
            }
          }
        }
        .m-foot-btn{
          position: absolute;
          bottom: 50px;
          left: 25px;
          span{
            color: #ffffff;
            display: inline-block;
            width: 700px;
            height: 106px;
            line-height: 106px;
            background-color: @mainColor;
            font-size: 38px;
            font-weight: bold;
            border-radius: 10px;
            box-shadow: 0 5px 6px rgba(0,0,0,0.16);
          }
          .not-agree {
            color: #999999;
            background-color: #EEEEEE;
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
        .m-rule-popup {
          width: 620px;
          height: 880px;
          margin: -480px 0 0 25px;
          border-radius: 30px;
          padding: 40px 40px 60px 40px;
          .m-rule-title {
            display: flex;
            .m-rule-title-text {
              flex: 1;
            }
            .m-popup-close {
              margin-top: -20px;
            }
          }
          .m-rule-text-box {
            text-align: left;
            text-indent: 2em;
            margin: 20px 0 60px 0;
          }
          .m-rule-row {
            font-size: 28px;
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
            .m-rule-left {
              color: #999999;
            }
            .m-rule-right {
              color: #333333;
            }
          }
        }
      }
    }
  }
</style>
