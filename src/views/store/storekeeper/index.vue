<template>
  <div class="m-storekeeper">
    <!--顶部图片-->
    <img class="m-storekeeper-bg" src="/static/images/storekeeper/store-background.png" alt="">
    <!--顶部文字-->
    <div class="m-top-box">
      <h3 class="m-title">本月收益</h3>
      <p class="m-num-box"><span>￥</span><span class="m-num">{{user.mounth_count}}</span></p>
      <p class="w-wd"><span class="w-wd-btn" @click="changeRoute('/storekeeper/withDraw')">提现</span></p>
      <!-- <div class="m-detail-more" @click="changeRoute('/storekeeper/incomeDetail')"> -->
      <div class="m-detail-more">
        <div class="w-detail-text" @click="changeRoute('/storekeeper/incomeDetail',0)">收益详情</div>
        <!-- 暂未完成提现历史的跳转 -->
        <div class="w-detail-text" @click="changeRoute('/storekeeper/incomeDetail',1)">提现历史</div>
        <!-- <img class="m-jump-img" src="/static/images/icon-more.png"> -->
      </div>
    </div>
    <div class="m-detail-box" v-if="num_box">
      <ul>
        <li>
          <p class="m-num">¥{{num_box.usexpect}}</p>
          <p>预计账户收益</p>
        </li>
        <li>
          <p class="m-num">¥{{num_box.ustotal}}</p>
          <p>累计收益</p>
        </li>
        <li>
          <p class="m-num">¥{{num_box.uscash}}</p>
          <p>可提现余额</p>
        </li>
        <li>
          <p class="m-num">¥{{num_box.uswithdrawal}}</p>
          <p>提现中余额</p>
        </li>
        <li @click="changeRoute('/storekeeper/group')">
          <p class="m-num">{{user.fens_count}}</p>
          <p class="m-flex-center"><span>团队成员总数(人)</span> <img class="w-icon-more" src="/static/images/storekeeper/store-icon-more.png"></p>
        </li>
        <li @click="changeRoute('/storekeeper/group')">
          <p class="m-num">{{user.fens_mouth_count}}</p>
          <p class="m-flex-center"><span>新增团队成员(人)</span> <img class="w-icon-more" src="/static/images/storekeeper/store-icon-more.png"></p>
        </li>
      </ul>
    </div>
    <div class="m-store-icon-box">
      <ul>
        <li @click="changeRoute('/storekeeper/activationCode')">
          <img src="/static/images/storekeeper/store-icon-buykey.png" alt="">
          <p>购买激活码</p>
        </li>
        <li @click="changeRoute('/storekeeper/myActivationCode')">
          <img src="/static/images/storekeeper/store-icon-mykey.png" alt="">
          <p>我的激活码</p>
        </li>
        <li @click="changeRoute('/personal/codeHistory')">
          <img src="/static/images/storekeeper/store-icon-record.png" alt="">
          <p>购买激活码记录</p>
        </li>
      </ul>
    </div>

    <!-- <div class="m-store-btn-box">
      <span class="m-btn" @click="makeMoney">提现</span>
      <span class="m-btn-a"  @click="changeRoute('/personal/history')">提现历史</span>
    </div> -->
    <!--<div class="m-total-jump-box m-earnings-detail">-->
      <!--<div class="m-earnings-out m-text-bottom" @click="outPopup = true">提现</div>-->
      <!--<div class="m-detail-box" @click="changeRoute('/storekeeper/incomeDetail')">-->
        <!--<div class="m-text-bottom">收益详情</div>-->
        <!--<img class="m-jump-img" src="/static/images/icon-more-black.png">-->
      <!--</div>-->
    <!--</div>-->
    <!--商家大礼包支付成功的popup-->
    <mt-popup class="m-gift-popup" v-model="giftPopup" pop-transition="popup-fade">
      <!--            <img class="m-gift-popup-img" src="/static/images/icon-out-know.png" alt="">-->
      <div class=" m-gift-popup-title m-ft-30 m-ft-b">请先进行身份认证</div>
      <div class="m-gift-popup-text m-ft-24">认证成功，提交申请并完成审批即可成为提现。</div>
      <div class="m-gift-popup-btn m-ft-30 m-ft-b" @click="changeRoute('/storekeeper/IDCardApprove')">填写申请</div>
    </mt-popup>
    <!--提现-->
    <div class="m-out-popup-box">
      <mt-popup class="m-out-popup" v-model="outPopup">
        <div class="m-out-box" v-if="!outSubmit">
          <div class="m-popup-close m-ft-26" @click="outPopup = false">X</div>
          <div class="m-out-title m-ft-30">提现金额</div>
          <div class="m-out-num-box">
            <div class="m-out-RMB">￥</div>
            <input type="text" class="m-out-num-input" v-model="moneyNum" @focus="moneyFocus">
            <img class="m-out-num-clean" src="/static/images/icon-close.png" @click="moneyNum = '0'">
          </div>
          <div class="m-out-row">
            <div class="m-row-left">姓名</div>
            <div class="m-row-right">
              <input type="text" v-model="realName" class="m-row-input m-width-200">
            </div>
          </div>
          <div class="m-out-row">
            <div class="m-row-left">银行卡号</div>
            <div class="m-row-right">
              <input type="text" v-model="bankNo" maxlength="20" class="m-row-input m-width-320">
            </div>
          </div>
          <div class="m-out-row">
            <div class="m-row-left">银行</div>
            <div class="m-row-right" @click="getBankName">{{bank}}</div>
          </div>
          <div class="m-out-row">
            <div class="m-row-left">开户行</div>
            <div class="m-row-right">
              <input type="text" v-model="bankName" class="m-row-input m-width-320">
            </div>
          </div>
          <div class="m-out-btn" @click="outBtn('submit')">提 交</div>
        </div>
        <div class="m-out-box" v-if="outSubmit">
          <img class="m-out-know-img" src="/static/images/icon-out-know.png" alt="">
          <div class="m-out-know-title">提交成功</div>
          <div class="m-out-know-text">{{msg}}</div>
          <!--<div class="m-out-know-text">已成功提交提现申请，我们将在3个工作日内完成审核，请及时关注您的账户余额。</div>-->
          <div class="m-out-btn" @click="outBtn('know')">我知道了</div>
        </div>
      </mt-popup>
      <!--银行picker-->
      <mt-popup class="m-bank-popup" v-model="bankPopup" position="bottom">
        <div class="m-popup-btn">
          <div @click="bankPopup = false">取消</div>
          <div @click="bankDone">确认</div>
        </div>
        <div class="m-out-row m-out-bank">
          <div class="m-row-left">银行名称</div>
          <div class="m-row-right">
            <input type="text" v-model="bankResult" class="m-row-input m-width-300">
          </div>
        </div>
        <mt-picker :slots="slots" @change="bankChange"></mt-picker>
      </mt-popup>
    </div>

    <!--toast-->
    <mt-popup class="m-toast-popup" popup-transition="popup-fade" v-model="toast">
      {{text}}
    </mt-popup>
  </div>
</template>

<script type="text/ecmascript-6">
  import common from '../../../common/js/common';
  import api from '../../../api/api'
  import { Toast } from 'mint-ui';
  import axios from 'axios';

  export default {
    data() {
      return {
        name: '',
        outPopup: false,
        outSubmit: false,
        bankPopup: false,
        slots: [{ values: ['请点击选择银行'] }],
        bank: "",
        user: { uc_count: '', mounth_count: '', usbalance: '' },
        ustotal: '',
        num_box:null,
        realName: '',
        bankName: '',
        bankResult: "",
        moneyNum: '',
        bankNo: '',
        msg: '',
        validated: true,         // 银行卡是否已失效
        text: '',
        toast: false,
        giftPopup:false,
        usidentification:''
      }
    },
    components: {},
    methods: {
      // 跳转其他页面的方法
      changeRoute(v) {
        this.$router.push(v)
      },
      changeRoute(v,item){
        this.$router.push({path:v,query:{index:item}});
      },
      // 提现的选择银行确定按钮
      bankDone() {
        if(this.bankResult) {
          this.bank = this.bankResult;
        }
        this.bankPopup = false;
      },
      // 提现的提交按钮
      outBtn(where) {
        if(where == "submit") {
          if(this.moneyNum < 0.01) {
            // Toast({ message: '提现金额应大于0', position: 'bottom' });
            this.text = '提现金额应大于0';
            this.toast = true;
            // 倒计时
            const TIME_COUNT = 1;
            let count = TIME_COUNT;
            let time = setInterval(() => {
              if (count > 0 && count <= TIME_COUNT) {
                count --;
              } else {
                this.toast = false;
                clearInterval(time);
              }
            }, 1000);
            return false;
          }
          if(this.moneyNum > this.user.usbalance) {
            // Toast({ message: '提现金额应不大于可用余额', position: 'bottom' });
            this.text = '提现金额应不大于可用余额';
            this.toast = true;
            // 倒计时
            const TIME_COUNT = 1;
            let count = TIME_COUNT;
            let time = setInterval(() => {
              if (count > 0 && count <= TIME_COUNT) {
                count --;
              } else {
                this.toast = false;
                clearInterval(time);
              }
            }, 1000);
            return false;
          }
          if(!this.realName) {
            Toast({ message: '请先输入姓名', position: 'bottom' });
            // this.text = '提现金额应不大于可用余额';
            // this.toast = true;
            // // 倒计时
            // const TIME_COUNT = 1;
            // let count = TIME_COUNT;
            // let time = setInterval(() => {
            //   if (count > 0 && count <= TIME_COUNT) {
            //     count --;
            //   } else {
            //     this.toast = false;
            //     clearInterval(time);
            //   }
            // }, 1000);
            return false;
          }
          if(this.bankNo.length < 10) {
            // Toast({ message: '请先输入正确的银行卡号', position: 'bottom' });
            this.text = '请先输入正确的银行卡号';
            this.toast = true;
            // 倒计时
            const TIME_COUNT = 1;
            let count = TIME_COUNT;
            let time = setInterval(() => {
              if (count > 0 && count <= TIME_COUNT) {
                count --;
              } else {
                this.toast = false;
                clearInterval(time);
              }
            }, 1000);
            return false;
          }
          if((this.bank == '请点击选择银行' || this.bank == '可输入银行名称' || !this.bank) && !this.bankResult) {
            // Toast({ message: '请先选择银行', position: 'bottom' });
            this.text = '请先选择银行';
            this.toast = true;
            // 倒计时
            const TIME_COUNT = 1;
            let count = TIME_COUNT;
            let time = setInterval(() => {
              if (count > 0 && count <= TIME_COUNT) {
                count --;
              } else {
                this.toast = false;
                clearInterval(time);
              }
            }, 1000);
            return false;
          }
          if(!this.bankName) {
            // Toast({ message: '请先输入开户行', position: 'bottom' });
            this.text = '请先输入开户行';
            this.toast = true;
            // 倒计时
            const TIME_COUNT = 1;
            let count = TIME_COUNT;
            let time = setInterval(() => {
              if (count > 0 && count <= TIME_COUNT) {
                count --;
              } else {
                this.toast = false;
                clearInterval(time);
              }
            }, 1000);
            return false;
          }
          /*if(!this.validated) {
            Toast({ message: '该银行卡已失效', position: 'bottom' });
            return false;
          }*/
          let params = {
            cncashnum: this.moneyNum,
            cncardno: this.bankNo,
            cncardname: this.realName,
            cnbankname: this.bank,
            cnbankdetail: this.bankName
          };
          axios.post(api.apply_cash + '?token='+ localStorage.getItem('token'), params).then(res => {
            if(res.data.status == 200) {
              this.msg = res.data.message;
              this.outSubmit = true;

              this.realName = '';
              this.bankNo = '';
              this.bank = '';
              this.bankName = '';
              this.slots[0].values = ['请点击选择银行'];
            }else {
              this.text = res.data.message;
              this.toast = true;
              // 倒计时
              const TIME_COUNT = 1;
              let count = TIME_COUNT;
              let time = setInterval(() => {
                if (count > 0 && count <= TIME_COUNT) {
                  count --;
                } else {
                  this.toast = false;
                  clearInterval(time);
                }
              }, 1000);
            }
          });
        }else if(where == "know") {
          this.outPopup = false;
          // 倒计时
          const TIME_COUNT = 1;
          let count = TIME_COUNT;
          let time = setInterval(() => {
            if (count > 0 && count <= TIME_COUNT) {
              count --;
            } else {
              this.outSubmit = false;
              clearInterval(time);
            }
          }, 1000);
        }
      },
      // 提现金额输入框获取焦点
      moneyFocus() {
        if(this.moneyNum == '0') {
          this.moneyNum = '';
        }
      },
      // 获取银行名称
      getBankName() {
        if(this.bankNo.length < 16) {
          // Toast({ message: '请先输入正确的银行卡号', position: 'bottom' });
          this.text = '请先输入正确的银行卡号';
          this.toast = true;
          // 倒计时
          const TIME_COUNT = 1;
          let count = TIME_COUNT;
          let time = setInterval(() => {
            if (count > 0 && count <= TIME_COUNT) {
              count --;
            } else {
              this.toast = false;
              clearInterval(time);
            }
          }, 1000);
          return false;
        }
        this.bankPopup = true;
        axios.get(api.get_bankname + "?cncardno=" + this.bankNo).then(res => {
          if(res.data.status == 200) {
            /*if(!res.data.data.validated) {
              Toast('该银行卡已失效');
            }else {
              this.slots[0].values = ['请点击选择银行', res.data.data.cnbankname];
            }*/
            this.slots[0].values = ['可输入银行名称', res.data.data.cnbankname];
            this.validated = res.data.data.validated;
          }else {
            this.slots[0].values = ['可输入银行名称'];
          }
        })
      },
      // picker选择的银行改变
      bankChange(picker, values) {
        this.bank = values[0];
      },
      // 获取个人信息
      getUser() {
        axios.get(api.get_agent_center + "?token=" + localStorage.getItem('token')).then(res => {
          if(res.data.status == 200) {
            this.user = res.data.data;
            this.moneyNum = this.user.usbalance;
            // console.log(this.user);
          }
        })
        axios.get(api.get_home + "?token=" + localStorage.getItem('token')).then(res => {
          if(res.data.status == 200){
            this.num_box = res.data.data;
            this.usidentification = res.data.data.usidentification;
          }
        })
      },
      makeMoney(){

        if(this.usidentification == ""){
          this.giftPopup = true;
        }else{
          this.outPopup = true
        }

      }
    },
    mounted() {
      common.changeTitle('店主');
      this.getUser();               // 获取个人信息
      // this.usidentification = this.$route.query.usidentification;
    }
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>
  @import "../../../common/css/index";


  .m-toast-popup {
    width: 440px;
    height: 80px;
    border-radius: 8px;
    padding: 10px;
    margin: 0 175px;
    font-size: 36px;
    line-height: 80px;
    text-align: center;
    color: #ffffff;
    background-color: #333333;
  }
  .m-storekeeper {
    min-height: 100vh;
    background-color: #fff;
    /*padding-bottom: 300px;*/
    color: #707070;
    padding-bottom: 50px;
    .m-storekeeper-bg {
      width: 750px;
      height: 350px;
    }
    .m-top-box{
      width: 750px;
      height: 350px;
      position: absolute;
      top: 0;
      left:0;
      .flex-col(space-between,center);
      // display: flex;
      // flex-flow: column;
      // align-items: center;
      // justify-content: space-between;
      .m-title{
        color: #FFFFFF;
        margin-top: 40px;
        font-size: 24px;
      }
      .m-num-box{
        color: #fff;
        font-size: 28px;
        .m-num{
          font-size: 40px;
          font-weight: 500;
        }
      }
      .w-wd{
        .w-wd-btn{
          display: inline-block;
          padding: 5px 72px;
          border: 1px solid #fff;
          font-size:28px;
          color: #fff;
        }
      }
      .m-detail-more {
        display: flex;
        align-items: center;
        color: #fff;
        font-size: 28px;
        margin-bottom: 30px;
        .w-detail-text{
          padding: 0 139px 0 0;
          &:last-child{
            padding: 0 0 0 139px;
            border-left: 1px solid #fff;
          }
        }
      }
    }

    .m-detail-box{
      // padding: 0 50px;
      border-bottom: 10px solid #F4F4F4;
      ul{
        display: flex;
        flex-flow: row;
        flex-wrap: wrap;
        align-items: center;
        justify-content: flex-start;
        li{
          width: 274px;
          padding: 56px 50px;
          border-bottom: 1px solid #E9E9E9;
          font-size: 24px;
          &:nth-child(odd){
            border-right: 1px solid #E9E9E9;
            // padding-left: 50px;
          }
          &:nth-child(even){
            // padding-right: 50px;
          }
          .m-num{
            color: #000000;
            font-size: 40px;
            margin-bottom: 15px;
            font-weight: 600;
          }
          .w-icon-more{
            width: 14px;
            height: 24px;
            margin-left: 10px;
          }
        }
      }
    }
    .m-store-icon-box{
      margin: 60px 0;
      ul{
        display: flex;
        flex-flow: row;
        align-items: center;
        justify-content: space-around;
        li{
          text-align: center;
          img{
            display: inline-block;
            width: 90px;
            height: 90px;
            margin-bottom: 20px;
          }
        }
      }
    }
    .m-store-btn-box{
      margin: 0 50px;
      position: relative;
      .m-btn{
        display: inline-block;
        width: 250px;
        height: 60px;
        border: 2px solid #22A7D2;
        color: #22A7D2;
        font-size: 28px;
        border-radius: 45px;
        line-height: 60px;
      }
      .m-btn-a{
        position: absolute;
        top: 10px;
        right: 0;
        margin-left: 82px;
        color: #22A7D2;
        text-decoration: underline;
      }
    }

    .m-gift-popup {
      width: 700px;
      height: 600px;
      margin: -300px 0 0 25px;
      border-radius: 30px;
      .m-gift-popup-img {
        width: 85px;
        height: 85px;
        margin: 100px 0 36px 0;
      }
      .m-gift-popup-title{
        text-align: center;
        margin: 100px 0 36px 0;
      }
      .m-gift-popup-text {
        margin: 45px 0 120px 0;
        text-align: center;
      }
      .m-gift-popup-btn {
        width: 120px;
        color: #ffffff;
        background-color: @mainColor;
        padding: 15px 70px;
        margin-left: 220px;
        border-radius: 10px;
        box-shadow: 2px 8px 8px rgba(0,0,0,0.16);
      }
    }
    .m-out-popup-box {
      .m-out-popup {
        width: 700px;
        height: 750px;
        margin: -400px 25px 0 25px;
        border-radius: 30px;
        .m-out-box {
          padding: 60px;
          .m-popup-close {
            text-align: right;
            margin: -40px -20px 0 0;
          }
          .m-out-title {
            text-align: left;
            margin-bottom: 60px;
          }
          .m-out-num-box {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-bottom: 20px;
            margin-bottom: 20px;
            border-bottom: 1px #C1C1C1 solid;
            .m-out-RMB {
              color: @mainColor;
              font-size: 50px;
              font-weight: bold;
            }
            .m-out-num-input {
              width: 400px;
              height: 70px;
              font-size: 50px;
              font-weight: bold;
            }
            .m-out-num-clean {
              width: 40px;
              height: 40px;
            }
          }
          .m-out-know-img {
            width: 85px;
            height: 85px;
            padding: 40px;
          }
          .m-out-know-title {
            font-size: 30px;
            font-weight: bold;
            padding: 20px 0 35px 0;
          }
          .m-out-know-text {
            font-size: 24px;
            padding-bottom: 140px;
          }
          .m-out-btn {
            width: 120px;
            white-space: nowrap;
            color: #ffffff;
            background-color: @mainColor;
            font-size: 30px;
            font-weight: bold;
            padding: 15px 60px;
            border-radius: 10px;
            box-shadow: 2px 8px 8px rgba(0,0,0,0.16);
            margin: 50px 0 0 170px;
          }
        }
      }
      .m-out-row {
        display: flex;
        justify-content: space-between;
        font-size: 28px;
        padding: 20px 0 10px 0;
        text-align: right;
        .m-row-left {

        }
        .m-row-right {
          .m-row-input {
            text-align: right;
            height: 40px;
            border: 1px #999999 solid;
            border-radius: 10px;
            font-size: 24px;
            padding: 3px 20px;
          }
          .m-width-200 {
            width: 200px;
          }
          .m-width-320 {
            width: 320px;
          }
        }
      }
      .m-out-bank {
        align-items: center;
        margin: 60px 120px -20px 120px;
      }
      .m-bank-popup {
        width: 750px;
        .m-popup-btn {
          display: flex;
          justify-content: space-between;
          font-size: 28px;
          padding: 20px 40px 0 40px;
        }
      }
    }
    .m-earnings-detail {
      width: 650px;
      display: flex;
      font-size: 21px;
      position: absolute;
      top: 290px;
      left: 0;
      right: 25px;
    }
    .m-my-order {
      position: absolute;
      top: 360px;
      left: 25px;
    }
  }
</style>
