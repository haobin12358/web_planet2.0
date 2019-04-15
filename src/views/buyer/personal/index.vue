<template>
  <div class="m-personal" >
    <div class="m-personal-bg">
      <span class="m-icon-bg"></span>
    </div>
    <div class="m-personal-content">
      <!--<p class="m-set-box">-->
        <!--<span class="m-icon-set" @click="changeRoute('/personal/setUp')"></span>-->
      <!--</p>-->
      <div class="m-personal-info">
        <img class="m-personal-head-portrait" v-if="user.usheader" :src="user.usheader" alt="">
        <img class="m-personal-head-portrait" v-else src="/static/images/logo.jpg" alt="">
        <div class="m-personal-info-box">
          <div class="m-personal-info-text">
            <div>
              <p>{{user.usname}}</p>
              <p>
                <span class="m-personal-identity animated infinite pulse" v-if="user.usidname == '登录 / 注册'" @click="changeRoute('/login')">{{user.usidname}}</span>
                <span class="m-personal-identity active" v-else>{{user.usidname}}</span>
              </p>
            </div>
            <p class="m-set-box">
              <span class="m-icon-set" @click="changeRoute('/personal/setUp')"></span>
            </p>
            <!--<img class="m-code-img" v-if="user.usqrcode" :src="user.usqrcode" @click="changeRoute('/personal/code')">-->
          </div>
          <div class="m-personal-info-text">
            <ul class="m-personal-ul">
              <li @click="changeRoute('/personal/coupon')">
                <span class="m-icon-gift"></span>
                <span class="m-name">优惠券</span>
                <span>{{user.uscoupon}}</span>
              </li>
              <li @click="changeRoute('/personal/integral')">
                <span class="m-icon-integral"></span>
                <span class="m-name">可用星币</span>
                <span>{{user.usintegral}}</span>
              </li>
            </ul>
            <img class="m-code-img" v-if="user.usqrcode" :src="user.usqrcode" @click="changeRoute('/personal/code')">
          </div>

        </div>
      </div>
      <div class="m-personal-body">
        <div class="m-one-part">
          <p class="m-one-part-title">
            <span class="m-name">我的订单</span>
            <span @click="changeRoute('/orderList')">
              <span>全部订单</span>
              <span class="m-icon-more"></span>
            </span>
          </p>
          <ul class="m-part-icon-ul">
            <li @click="changeRoute('orderList', 1)">
              <img src="/static/images/icon-order-pay.png" alt="">
              <span>待支付</span>
              <div class="m-order-num" v-if="pay != 0">{{pay}}</div>
            </li>
            <li @click="changeRoute('orderList', 2)">
              <img src="/static/images/icon-order-send.png" class="m-square" alt="">
              <span>待发货</span>
              <div class="m-order-num" v-if="send != 0">{{send}}</div>
            </li>
            <li @click="changeRoute('orderList', 3)">
              <img src="/static/images/icon-receive.png" class="m-square" alt="">
              <span>待收货</span>
              <div class="m-order-num" v-if="receive != 0">{{receive}}</div>
            </li>
            <li @click="changeRoute('orderList', 4)">
              <img src="/static/images/m-serviceCenter-after.png" class="m-square" alt="">
              <span>待评价</span>
              <div class="m-order-num" v-if="evaluate != 0">{{evaluate}}</div>
            </li>
            <li @click="changeRoute('personal/afterSales')">
              <img src="/static/images/icon-personal-back.png" alt="">
              <span>售后</span>
              <div class="m-order-num" v-if="after_sales != 0">{{after_sales}}</div>
            </li>
          </ul>
        </div>
        <div class="m-one-part">
          <p class="m-one-part-title">
            <span class="m-name">常用工具</span>
          </p>
          <ul class="m-part-icon-ul m-use">
            <li @click="changeRoute('personal/serviceCenter')">
              <img src="/static/images/icon-personal-service.png" alt="">
              <span>客服中心</span>
            </li>
            <li @click="changeRoute('personal/safeCenter')">
              <img src="/static/images/icon-personal-security-center.png"  alt="">
              <span>安全中心</span>
            </li>
            <li @click="changeRoute('/personal/couponCenter')">
              <img src="/static/images/icon-personal-coupon.png"  alt="">
              <span>优惠中心</span>
            </li>
            <li @click="changeRoute('/personal/guess')">
              <img src="/static/images/icon-personal-guess.png"  alt="">
              <span>竞猜记录</span>
            </li>
          </ul>
        </div>
        <div class="m-one-part m-margin">
          <p class="m-one-part-title">
            <span class="m-name">我的活动</span>
          </p>
          <!--<div class="m-activity-subtitle">账户余额</div>-->
          <div class="m-activity-subtitle">可提现余额</div>
          <div class="m-activity-money">
            <div class="m-money m-ft-28 m-red">￥ <span class="m-ft-58">{{moneyNumTemp | money}}</span></div>
            <div class="m-money-btn m-ft-24" @click="outPopup = true">提现</div>
          </div>
          <ul class="m-part-icon-ul m-use m-double">
            <li @click="changeRoute('/activityOrder')">
              <img src="/static/images/icon-activity-new.png" alt="">
              <span>活动订单</span>
            </li>
            <li @click="changeRoute('/personal/history')">
              <img src="/static/images/icon-wuliu-done.png"  alt="">
              <span>提现历史</span>
            </li>
            <li @click="goStore">
              <img src="/static/images/icon-store-new.png"  alt="">
              <span>{{store}}</span>
            </li>
          </ul>
        </div>

        <!--提现-->
        <div class="m-out-popup-box">
          <mt-popup class="m-out-popup" v-model="outPopup">
            <div class="m-out-box" v-if="!outSubmit">
              <div class="m-popup-close m-ft-28" @click="outPopup = false">X</div>
              <div class="m-out-title m-ft-30">提现金额</div>
              <div class="m-out-num-box">
                <div class="m-out-RMB">￥</div>
                <input class="m-out-num-input" type="text" v-model="moneyNum" @focus="moneyFocus">
                <img class="m-out-num-clean" src="/static/images/icon-close.png" @click="moneyNum = '0'">
              </div>
              <div class="m-out-row">
                <div class="m-row-left">姓名</div>
                <div class="m-row-right">
                  <input type="text" v-model="realName" class="m-row-input m-width-180">
                </div>
              </div>
              <div class="m-out-row">
                <div class="m-row-left">银行卡号</div>
                <div class="m-row-right">
                  <input type="text" v-model="bankNo" class="m-row-input m-width-300">
                </div>
              </div>
              <div class="m-out-row">
                <div class="m-row-left">银行名称</div>
                <div class="m-row-right" @click="getBankName">{{bank}}</div>
              </div>
              <div class="m-out-row">
                <div class="m-row-left">开户行</div>
                <div class="m-row-right">
                  <input type="text" v-model="bankName" class="m-row-input m-width-300">
                </div>
              </div>
              <div class="m-out-btn" @click="outBtn('submit')">提 交</div>
            </div>
            <div class="m-out-box" v-if="outSubmit">
              <img class="m-out-know-img" src="/static/images/icon-out-know.png" alt="">
              <div class="m-out-know-title">提交成功</div>
              <div class="m-out-know-text">已成功提交提现申请，我们将在3个工作日内完成审核，请及时关注您的账户余额。</div>
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
          <!--toast-->
          <mt-popup class="m-toast-popup" popup-transition="popup-fade" v-model="toast">
            {{text}}
          </mt-popup>
        </div>
      </div>
    </div>
  </div>

</template>

<script type="text/ecmascript-6">
  import common from '../../../common/js/common';
  import api from '../../../api/api'
  import { Toast } from 'mint-ui';
  import axios from 'axios';

  export default {
    name: 'personalIndex',
    data() {
      return {
        user: { usheader: '', usidname: '登录 / 注册'},               // 个人信息
        pay: "0",               // 待付款
        send: "0",              // 待发货
        receive: "0",           // 待收货
        evaluate: "0",          // 待评价
        after_sales: "0",       // 售后
        outPopup: false,
        outSubmit: false,
        bankPopup: false,
        moneyNum: "0",
        moneyNumTemp: "0",
        slots: [{ values: ['请点击选择银行'] }],
        realName: "",
        bankName: "",
        bankResult: "",
        bank: "",
        bankNo: "",
        store: '成为店主',
        text: '',
        toast: false
      }
    },
    watch: {
      outPopup(val) {
        if(!val) {
          this.slots = [{ values: ['请点击选择银行'] }];
          this.realName = "";
          this.bankName = "";
          this.bankResult = "";
          this.bank = "";
          this.bankNo = ""
        }
      }
    },
    components: {},
    mounted() {
      common.changeTitle('我的');
      // this.getUser();             // 获取个人信息
    },
    activated() {
      this.getUser();             // 获取个人信息
      if(localStorage.getItem('back')) {
        localStorage.removeItem('back');
        this.$router.push('/personal/afterSales')
      }
      if(sessionStorage.getItem('shop')) {
        this.$router.push('/shop');
        sessionStorage.removeItem('shop')
      }
    },
    methods: {
      goStore() {
        axios.get(api.get_home + "?token=" + localStorage.getItem('token')).then(res => {
          if(res.data.status == 200) {
            if(res.data.data.uslevel == "1") {            // 1 - 买家 - 去商家大礼包list页面
              this.$router.push("/giftBox");
            }else if(res.data.data.uslevel == "2") {      // 2 - 卖家 - 去卖家版首页
              // this.$router.push("material/circle");
              this.$router.push("storekeeper");
            }else if(res.data.data.uslevel == "3") {      // 3 - 申请成为卖家中
              this.$router.push("storekeeper/applyOwner");
            }else if(res.data.data.uslevel == "4") {      // 4 - 已购买大礼包，但是未认证 - 去认证
              Toast('请完成店主身份认证');
              this.$router.push("storekeeper/IDCardApprove");
            }
          }
        });
      },
      // 跳转页面
      changeRoute(v, which){
        if(v == '/login'){
          this.$store.state.show_login = true;
          return false;
        }
        if(which) {
          this.$router.push({ path: v,query: { which: which}});
        }else {
          this.$router.push(v);
        }
      },
      getBankName() {
        if(this.bankNo.length < 10) {
          Toast({ message: '请先输入正确的银行卡号', position: 'bottom' });
          return false;
        }
        this.bankPopup = true;
        axios.get(api.get_bankname + "?cncardno=" + this.bankNo).then(res => {
          if(res.data.status == 200) {
            this.slots[0].values = ['可输入银行名称', res.data.data.cnbankname];
            /*if(!res.data.data.validated) {
              Toast('该银行卡已失效');
            }else {
              this.slots[0].values = ['请点击选择银行', res.data.data.cnbankname];
            }*/
            this.validated = res.data.data.validated;
          }else {
            this.slots[0].values = ['可输入银行名称'];
          }
        })
      },
      // 提现金额输入框获取焦点
      moneyFocus() {
        if(this.moneyNum == '0') {
          this.moneyNum = '';
        }
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
            // Toast({ message: '请先输入姓名', position: 'bottom' });
            this.text = '请先输入姓名';
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
          this.getUser();           // 获取用户信息
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
      // 提现的选择银行确定按钮
      bankDone() {
        if(this.bankResult) {
          this.bank = this.bankResult;
        }
        this.bankPopup = false;
      },
      // picker选择的银行改变
      bankChange(picker, values) {
        this.bank = values[0];
      },
      // 获取个人信息
      getUser() {
        axios.get(api.get_home + "?token=" + localStorage.getItem('token')).then(res => {
          if(res.data.status == 200){
            this.user = res.data.data;
            // this.moneyNum = this.user.usbalance;
            this.moneyNum = this.user.uscash;
            this.moneyNumTemp = JSON.parse(JSON.stringify(this.moneyNum));
            this.getOrderCount();       // 获取订单数量
            if(res.data.data.uslevel == 2) {
              this.store = '转换店主'
            }else {
              this.store = '成为店主'
            }
          }else{
            this.user = { usheader: '', usidname: '登录 / 注册'}
          }
        })
      },
      // 获取订单数量
      getOrderCount() {
        axios.get(api.order_count + "?extentions=refund&token=" + localStorage.getItem('token')).then(res => {
          if(res.data.status == 200){
            for(let i = 0; i < res.data.data.length; i ++) {
              if(res.data.data[i].status == "0") {
                this.pay = res.data.data[i].count;
              }else if(res.data.data[i].status == "10") {
                this.send = res.data.data[i].count;
              }else if(res.data.data[i].status == "20") {
                this.receive = res.data.data[i].count;
              }else if(res.data.data[i].status == "25") {
                this.evaluate = res.data.data[i].count;
              }else if(res.data.data[i].status == "40") {
                this.after_sales = res.data.data[i].count;
              }
            }
          }
        })
      }
    }
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>
 @import "../../../common/css/personal";

  .m-toast-popup {
    width: 400px;
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
</style>
