<template>
  <div class="m-dailyGuess">
    <div class="m-guess-title">
      <!--<img class="m-guess-img" src="/static/images/activity/main-bg.png">-->
      <mt-swipe class="m-product-img-box" :show-indicators="false">
        <mt-swipe-item v-for="(item, index) in productImages" v-bind:key="item.prmainpic">
          <img class="m-product-img" :src="item.prmainpic" @click="changeRoute(item)">
        </mt-swipe-item>
      </mt-swipe>
      <!--<img class="m-product-img animated bounceIn" :src="rule.prpic">-->
      <div class="m-input-sure-box">
        <div class="m-input-img">
          <div class="m-guess-result m-ft-50 m-ft-b">{{num}}<span class="m-result">{{result}}</span></div>
        </div>
        <div class="m-done-img">
          <div class="m-done-btn m-ft-44 m-ft-b" :class="submit ? 'm-submit-done' : '' || !hour ? 'm-submit-done' : ''" @click="submitResult">确认</div>
        </div>
      </div>
    </div>
    <div class="m-guess-num-text">
      <div class="m-guess-num">
        <!--<div class="m-line-long"></div>-->
        <div class="m-num-bg">
          <div class="m-num-box">
            <div class="m-num-item m-one animated bounceInDown bounceInLeft" @click="numClick('1')"></div>
            <div class="m-num-item m-two animated bounceInDown" @click="numClick('2')"></div>
            <div class="m-num-item m-three animated bounceInDown bounceInRight" @click="numClick('3')"></div>
            <div class="m-num-item m-four animated bounceInDown bounceInLeft" @click="numClick('4')"></div>
            <div class="m-num-item m-five animated bounceInDown" @click="numClick('5')"></div>
            <div class="m-num-item m-six animated bounceInDown bounceInRight" @click="numClick('6')"></div>
            <div class="m-num-item m-seven animated bounceInDown" @click="numClick('7')"></div>
            <div class="m-num-item m-eight animated bounceInDown" @click="numClick('8')"></div>
            <div class="m-num-item m-nine animated bounceInDown" @click="numClick('9')"></div>
            <div class="m-num-item m-point animated bounceInDown" @click="numClick('.')"></div>
            <div class="m-num-item m-zero animated bounceInDown" @click="numClick('0')"></div>
            <div class="m-num-item m-delete animated bounceInDown" @click="numClick('delete')"></div>
          </div>
        </div>
        <!--<div class="m-line-short"></div>-->
      </div>
      <div class="m-guess-text">
        <!--<div class="m-rule-icon"></div>-->
        <div class="m-text-bg">
          <div class="m-rule-title">活动规则</div>
          <div class="m-rule-row">
            <!--<div>-->
              <!--<div class="m-rule-no">1.</div>-->
            <!--</div>-->
            <div>1.{{rule.acdesc[0]}}</div>
          </div>
          <div class="m-rule-row">
            <!--<div>-->
              <!--<div class="m-rule-no">2.</div>-->
            <!--</div>-->
            <div>2.{{rule.acdesc[1]}}</div>
          </div>
          <div class="m-rule-row">
            <!--<div>-->
              <!--<div class="m-rule-no">3.</div>-->
            <!--</div>-->
            <div>3.{{rule.acdesc[2]}}</div>
          </div>
          <div class="m-text m-ft-21">活动最终解释权归本公司所有</div>
        </div>
      </div>
    </div>

    <!--竞猜成功-->
    <mt-popup class="m-guess-popup" v-model="successPopup" pop-transition="popup-fade">
      <div class="m-guess-success">
        <img class="m-guess-icon" src="/static/images/activity/guess-success.png" alt="">
        <div class="m-success-text m-ft-30 m-ft-b">恭喜您竞猜正确！</div>
        <div class="m-success-text margin m-ft-24">以￥{{record.price}}的价格购买此商品吧！！</div>
        <!--<div class="m-success-text margin m-ft-24">以￥{{record.price | money}}的价格购买此商品吧！！</div>-->
        <div class="m-btn-box">
          <div class="m-guess-btn m-success-btn m-ft-30 m-ft-b" @click="chooseAddress">选择地址</div>
          <div class="m-guess-btn m-success-btn m-ft-30 m-ft-b" @click="successDone()">去购买</div>
        </div>
      </div>
    </mt-popup>
    <!--竞猜失败-->
    <mt-popup class="m-guess-popup" v-model="failPopup" pop-transition="popup-fade">
      <div class="m-guess-fail">
        <img class="m-guess-icon" src="/static/images/activity/guess-fail.png" alt="">
        <div class="m-ft-30 m-ft-b">很遗憾， 上次竞猜失败，请再接再厉吧！</div>
        <div class="m-guess-btn m-fail-btn m-ft-30 m-ft-b" @click="failDone">知道了</div>
      </div>
    </mt-popup>
  </div>
</template>

<script type="text/ecmascript-6">
  import common from '../../../common/js/common';
  import axios from 'axios';
  import api from '../../../api/api';
  import { Toast } from 'mint-ui';
  import wxapi from '../../../common/js/mixins';
  import wx from 'weixin-js-sdk';
  export default {
    data() {
      return {
        name: '',
        num: "",               // 猜测的数字 2710.51
        result: "",            // 光标
        count: "",
        submit: false,         // 是否已提交
        successPopup: false,   // 猜对啦
        failPopup: false,      // 猜错啦
        hour: false,           // 当前的小时是否在竞猜时间内
        rule: { acdesc: [] },
        today: '',
        record: { price: '' },
        uaid: '',
        guess: {},
        productImages: []
      }
    },
    mixins: [wxapi],
    components: {},
    mounted() {
      common.changeTitle('每日竞猜');
      this.today = new Date();
      this.today.setTime(this.today.getTime()-24*60*60*1000);
      this.today = this.today.getFullYear().toString() + (this.today.getMonth()+1).toString() + this.today.getDate().toString();
      // this.today = new Date().getFullYear().toString() + (new Date().getMonth() + 1).toString() + (new Date().getDate() - 1).toString();
      this.uaid = localStorage.getItem('uaid');
      localStorage.removeItem('uaid');
      this.timeOut();                    // 闪动光标 - 倒计时
      if(localStorage.getItem('token')) {
        this.getGuess();                   // 获取今日参与记录
        if(localStorage.getItem('tipDate') != this.today) {
          this.getGuess(this.today);         // 获取昨日参与记录
        }
      }
      wxapi.wxRegister(location.href.split('#')[0]);
      this.getTime();                    // 获取当前时间
      this.getRule();                    // 获取该活动的规则
      this.getTodayProduct();            // 用户获取今天猜数字活动所有商品
      localStorage.removeItem('share');
      localStorage.removeItem('url');
      if(localStorage.getItem('token')) {
        // 倒计时
        const TIME_COUNT = 1;
        let count = TIME_COUNT;
        let time = setInterval(() => {
          if(count > 0 && count <= TIME_COUNT) {
            count --;
          }else {
            this.shareCode(0);
            clearInterval(time);
          }
        }, 300);
      }
    },
    methods: {
      // 跳转页面
      changeRoute(item) {
        localStorage.setItem('guess', JSON.stringify(this.guess));
        this.$router.push({ path: 'guessProduct',query:{which:'guess'} });
      },
      // 昨日未中奖的知道了
      failDone() {
        this.failPopup = false;
        localStorage.setItem('tipDate', this.today);
      },
      // 选择地址
      chooseAddress() {
        this.$router.push({ path: '/personal/addressManagement', query: { from: 'choose' }});
      },
      // 昨日中奖的去购买
      successDone() {
        if(!this.uaid) {
          Toast({ message: '请先选择地址', position: 'bottom' });
          return false;
        }
        let params = {
          gnid: this.record.gnid,
          skuid: this.record.skuid,
          omclient: 0,
          uaid: this.uaid,
          opaytype: 0
        };
        axios.post(api.recv_award + '?token='+ localStorage.getItem('token'), params).then(res => {
          if(res.data.status == 200) {
            this.successPopup = false;
            localStorage.setItem('activityOrderNo', 1);
            if(common.isWeixin()) {
              this.wxPay(res.data.data.args);
            }else {
              Toast('请在活动订单页查看详情');
            }
          }
        });
        localStorage.setItem('tipDate', this.today);
      },
      // 调起微信支付
      wxPay(data) {
        let that = this;
        function onBridgeReady() {      // 微信支付接口
          WeixinJSBridge.invoke(
            'getBrandWCPayRequest', {
              "appId": data.appId,                 // 公众号名称，由商户传入
              "timeStamp": data.timeStamp,         // 时间戳，自1970年以来的秒数
              "nonceStr": data.nonceStr,           // 随机串
              "package": data.package,             // 统一下单接口返回的prepay_id参数值
              "signType": data.signType,           // 微信签名方式
              "paySign": data.sign                 // 微信签名
            },
            function(res){
              // console.log(res);
              // 成功调起支付，该页面已使用过，从订单列表页返回时不打开
              if(res.err_msg == "get_brand_wcpay_request:ok"){             // 支付成功
                localStorage.setItem('tipDate', that.today);
              }else if(res.err_msg == "get_brand_wcpay_request:cancel"){   // 支付过程中用户取消
                Toast('支付已取消');
              }else if(res.err_msg == "get_brand_wcpay_request:fail"){     // 支付失败
                Toast('支付失败');
              }
              that.$router.push('/activityOrder');
            });
        }
        if (typeof WeixinJSBridge == "undefined"){
          if( document.addEventListener ){
            document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
          }else if (document.attachEvent){
            document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
            document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
          }
        }else{
          onBridgeReady();
        }
      },
      // 数字面板的点击事件
      numClick(v) {
        console.log(v)
        if(!this.submit) {
          if(v == "delete") {
            this.num = this.num.substring(0, this.num.length-1);
          }else {
            if(this.num.length < 10) {
              this.num += v;
            }
          }
        }
      },
      // 提交猜测的结果
      submitResult() {
        if(!localStorage.getItem('token')){
          Toast("请先登录");
          return false;
        }
        if(!this.submit) {
          this.getTime();    // 获取当前时间
          if(this.hour) {
            if(this.num) {
              this.submit = true;
              this.result = "";
              axios.post(api.create_guess_num + '?token=' + localStorage.getItem('token'), { gnnum: this.num }).then(res => {
                if(res.data.status == 200){
                  Toast(res.data.message);
                }
              });
            }else {
              Toast("请先输入竞猜数字");
            }
          }else {
            Toast("每日开放时间：00:00-14:50");
          }
        }
      },
      // 闪动光标 - 倒计时
      timeOut() {
        let timer = null;
        let TIME_COUNT = 2;
        this.count = 1;
        timer = setInterval(() => {
          if(this.count > 0 && this.count <= TIME_COUNT) {
            // this.count --;
            if(!this.submit) {
              if(this.result == "|") {
                this.result = "";
              }else if(this.result == "") {
                this.result = "|";
              }
            }else {
              this.result = "";
              clearInterval(timer);
              timer = null;
            }
          }else {
            clearInterval(timer);
            timer = null;
          }
        }, 700);
      },
      // 获取当前时间
      getTime() {
        let hour = new Date().getHours();
        if(hour < 15) {
          this.hour = true;
        }
      },
      // 获取今日参与记录
      getGuess(date) {
        let params = {
          token: localStorage.getItem('token'),
          date: '' || date
        };
        axios.get(api.get_guess_num, { params: params }).then(res => {
          if(res.data.status == 200) {
            if(!date && res.data.data) {
              this.num = res.data.data.gnnum;
              this.submit = true;
            }
            if(date && localStorage.getItem('tipDate') != this.today) {
              this.record = res.data.data;
              if(res.data.data.result == 'uncorrect') {
                this.failPopup = true;        // 猜错啦
              }else if(res.data.data.result == 'correct') {
                this.successPopup = true;     // 猜对啦
              }else if(res.data.data.result == 'not_open') {
                Toast('昨日未开奖');
              }
            }
          }
          if(res.data.status == 404) {
            if(localStorage.getItem('yesterday')) {
              if(localStorage.getItem('yesterday') == this.today) {

              }else {
                Toast(res.data.message);
                localStorage.setItem('yesterday', this.today)
              }
            }else {
              Toast(res.data.message);
              localStorage.setItem('yesterday', this.today)
            }
          }
        });
      },
      // 获取该活动的规则
      getRule() {
        axios.get(api.get_activity + "?actype=1").then(res => {
          if(res.data.status == 200) {
            // console.log(res.data.data);
            this.rule = res.data.data;
          }
        });
      },
      // 用户获取今天猜数字活动所有商品
      getTodayProduct() {
        axios.get(api.today_gnap + '?token='+ localStorage.getItem('token')).then(res => {
          if(res.data.status == 200) {
            this.guess = res.data.data;
            this.productImages = [];
            for(let i in res.data.data.fresh_man) {
              this.productImages.push(res.data.data.fresh_man[i].product)
            }
          }
        });
      },
      // 分享
      shareCode(val) {
        if(localStorage.getItem('token')) {
          let options = {
            title: '活动竞猜',
            desc: this.rule.acdesc[0],
            imgUrl: this.rule.prpic,
            link: location.href.split('#')[0]+'?uaid=daily'
          };
          axios.get(api.secret_usid + '?token=' + localStorage.getItem('token')).then(res => {
            if(res.data.status == 200) {
              options.link += '&secret_usid=' + res.data.data.secret_usid;
            }
          });
          // 自定义“分享给朋友”及“分享到QQ”按钮的分享内容（1.4.0）
          if(wx.updateAppMessageShareData) {
            wx.updateAppMessageShareData(options);
          }
          // 自定义“分享到朋友圈”及“分享到QQ空间”按钮的分享内容（1.4.0）
          if(wx.updateTimelineShareData) {
            wx.updateTimelineShareData(options);
          }
          // 获取“分享给朋友”按钮点击状态及自定义分享内容接口（即将废弃）
          if(wx.onMenuShareAppMessage) {
            console.log(options,'sdsdsdf')
            wx.onMenuShareAppMessage(options);
          }
          // 获取“分享到朋友圈”按钮点击状态及自定义分享内容接口（即将废弃）
          if(wx.onMenuShareTimeline) {
            wx.onMenuShareTimeline(options);
          }
        }else {
          Toast('请登录后再试');
        }
      },
    }
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>
  @import "../../../common/css/index";

  .m-dailyGuess {
    .m-guess-title {
      position: relative;
      z-index: 1;
      width: 750px;
      /*height: 861px;*/
      .m-guess-img {
        width: 750px;
        /*height: 861px;*/
        /*height: 100%;*/
        margin-bottom: -130px;
      }
      .m-product-img-box {
        width: 750px;
        height: 550px;
        /*border: 20px solid rgba(255,255,255,1);*/
        /*box-shadow: 5px 5px 20px rgba(0,0,0,0.16);*/
        /*border-radius: 30px;*/
        /*background-color: #9fd0bf;*/
        /*position: absolute;*/
        /*top: 20px;*/
        /*left: 0;*/
      }
      .m-product-img {
        width: 750px;
        height: 550px;
        /*box-shadow: 5px 5px 20px rgba(0,0,0,0.16);*/
        /*border-radius: 30px;*/
      }
      .m-input-sure-box{
        height: 120px;
        .flex-row(center);
      }
      .m-input-img {
        width: 567px;
        height: 77px;
        line-height: 77px;
        /*background: url("/static/images/activity/icon-input.png") no-repeat;*/
        border-bottom: 1px solid #E9E9E9;
        background-size: 100% 100%;
        /*position: absolute;*/
        /*top: 711px;*/
        /*left: 25px;*/
        .m-guess-result {
          max-width: 480px;
          /*color: #ffffff;*/
          color: #A8D9E9;
          /*margin: 35px 0 0 70px;*/
        }
      }
      .m-done-img {
        width: 140px;
        height: 90px;
        background: url("/static/images/activity/icon-sure.png") no-repeat;
        background-size: 100% 100%;
        /*position: absolute;*/
        /*top: 722px;*/
        /*right: 48px;*/
        .m-done-btn {
          color: #ffffff;
          /*margin-top: 26px;*/
          line-height: 90px;
          font-size: 44px;
        }
        .m-submit-done {
          /*opacity: 0.5;*/
        }
      }
    }
    .m-guess-num-text {
      /*height: 1936px;*/
      /*min-height: 100%;*/
      /*background-color: #9959EA;*/
      position: relative;
      padding: 0 15px;
      .m-guess-num {
        width: 700px;
        /*height: 950px;*/
        /*background-color: #8031E2;*/
        /*border-radius: 20px;*/
        /*position: absolute;*/
        /*top: 92px;*/
        /*left: 25px;*/
        .m-line-long {
          width: 498px;
          height: 78px;
          background: url("/static/images/activity/icon-line-long.png") no-repeat;
          background-size: 100% 100%;
          position: absolute;
          top: 0;
          left: 70px;
          z-index: 1;
        }
        .m-line-short {
          width: 18px;
          height: 96px;
          background: url("/static/images/activity/icon-line-short.png") no-repeat;
          background-size: 100% 100%;
          position: absolute;
          top: 903px;
          right: 59px;
          z-index: 1;
        }
        .m-num-bg {
          width: 644px;
          /*height: 850px;*/
          /*background: url("/static/images/activity/icon-bg.png") no-repeat;*/
          background-size: 100% 100%;
          /*position: absolute;*/
          /*top: 57px;*/
          /*left: 28px;*/
          .m-num-box {
            width: 720px;
            /*height: 796px;*/
            /*border: 1px red solid;*/
            /*position: absolute;*/
            /*top: 27px;*/
            /*left: 25px;*/
            display: flex;
            flex-wrap: wrap;
            .m-num-item {
              width: 240px;
              height: 90px;
              /*margin: 0 12px 12px 0;*/
              &.m-one {
                background: url("/static/images/activity/one.png") no-repeat;
                background-size: 100% 100%;
              }
              /*<!--&.m-one:active {-->*/
                /*<!--width: 200px;-->*/
                /*<!--height: 200px;-->*/
                /*<!--margin: -5px 7px -5px -5px;-->*/
                /*<!--background: url("/static/images/activity/one-active.png") no-repeat;-->*/
                /*<!--background-size: 100% 100%;-->*/
              /*<!--}-->*/
              &.m-two {
                background: url("/static/images/activity/two.png") no-repeat;
                background-size: 100% 100%;
              }
              /*<!--&.m-two:active {-->*/
                /*<!--width: 200px;-->*/
                /*<!--height: 200px;-->*/
                /*<!--margin: -5px 7px -5px -5px;-->*/
                /*<!--background: url("/static/images/activity/two-active.png") no-repeat;-->*/
                /*<!--background-size: 100% 100%;-->*/
              /*<!--}-->*/
              &.m-three {
                background: url("/static/images/activity/three.png") no-repeat;
                background-size: 100% 100%;
              }
              /*<!--&.m-three:active {-->*/
                /*<!--width: 200px;-->*/
                /*<!--height: 200px;-->*/
                /*<!--margin: -5px 7px -5px -5px;-->*/
                /*<!--background: url("/static/images/activity/three-active.png") no-repeat;-->*/
                /*<!--background-size: 100% 100%;-->*/
              /*<!--}-->*/
              &.m-four {
                background: url("/static/images/activity/four.png") no-repeat;
                background-size: 100% 100%;
              }
              /*<!--&.m-four:active {-->*/
                /*<!--width: 200px;-->*/
                /*<!--height: 200px;-->*/
                /*<!--margin: -5px 7px -5px -5px;-->*/
                /*<!--background: url("/static/images/activity/four-active.png") no-repeat;-->*/
                /*<!--background-size: 100% 100%;-->*/
              /*<!--}-->*/
              &.m-five {
                background: url("/static/images/activity/five.png") no-repeat;
                background-size: 100% 100%;
              }
              /*<!--&.m-five:active {-->*/
                /*<!--width: 200px;-->*/
                /*<!--height: 200px;-->*/
                /*<!--margin: -5px 7px -5px -5px;-->*/
                /*<!--background: url("/static/images/activity/five-active.png") no-repeat;-->*/
                /*<!--background-size: 100% 100%;-->*/
              /*<!--}-->*/
              &.m-six {
                background: url("/static/images/activity/six.png") no-repeat;
                background-size: 100% 100%;
              }
              /*<!--&.m-six:active {-->*/
                /*<!--width: 200px;-->*/
                /*<!--height: 200px;-->*/
                /*<!--margin: -5px 7px -5px -5px;-->*/
                /*<!--background: url("/static/images/activity/six-active.png") no-repeat;-->*/
                /*<!--background-size: 100% 100%;-->*/
              /*<!--}-->*/
              &.m-seven {
                background: url("/static/images/activity/seven.png") no-repeat;
                background-size: 100% 100%;
              }
              /*<!--&.m-seven:active {-->*/
                /*<!--width: 200px;-->*/
                /*<!--height: 200px;-->*/
                /*<!--margin: -5px 7px -5px -5px;-->*/
                /*<!--background: url("/static/images/activity/seven-active.png") no-repeat;-->*/
                /*<!--background-size: 100% 100%;-->*/
              /*<!--}-->*/
              &.m-eight {
                background: url("/static/images/activity/eight.png") no-repeat;
                background-size: 100% 100%;
              }
              /*<!--&.m-eight:active {-->*/
                /*<!--width: 200px;-->*/
                /*<!--height: 200px;-->*/
                /*<!--margin: -5px 7px -5px -5px;-->*/
                /*<!--background: url("/static/images/activity/eight-active.png") no-repeat;-->*/
                /*<!--background-size: 100% 100%;-->*/
              /*<!--}-->*/
              &.m-nine {
                background: url("/static/images/activity/nine.png") no-repeat;
                background-size: 100% 100%;
              }
              /*<!--&.m-nine:active {-->*/
                /*<!--width: 200px;-->*/
                /*<!--height: 200px;-->*/
                /*<!--margin: -5px 7px -5px -5px;-->*/
                /*<!--background: url("/static/images/activity/nine-active.png") no-repeat;-->*/
                /*<!--background-size: 100% 100%;-->*/
              /*<!--}-->*/
              &.m-zero {
                background: url("/static/images/activity/zero.png") no-repeat;
                background-size: 100% 100%;
              }
              /*<!--&.m-zero:active {-->*/
                /*<!--width: 200px;-->*/
                /*<!--height: 200px;-->*/
                /*<!--margin: -5px 7px -5px -5px;-->*/
                /*<!--background: url("/static/images/activity/zero-active.png") no-repeat;-->*/
                /*<!--background-size: 100% 100%;-->*/
              /*<!--}-->*/
              &.m-point {
                background: url("/static/images/activity/point.png") no-repeat;
                background-size: 100% 100%;
              }
              /*<!--&.m-point:active {-->*/
                /*<!--width: 200px;-->*/
                /*<!--height: 200px;-->*/
                /*<!--margin: -5px 7px -5px -5px;-->*/
                /*<!--background: url("/static/images/activity/point-active.png") no-repeat;-->*/
                /*<!--background-size: 100% 100%;-->*/
              /*<!--}-->*/
              &.m-delete {
                background: url("/static/images/activity/delete.png") no-repeat;
                background-size: 100% 100%;
              }
              /*<!--&.m-delete:active {-->*/
                /*<!--width: 200px;-->*/
                /*<!--height: 200px;-->*/
                /*<!--margin: -5px 7px -5px -5px;-->*/
                /*<!--background: url("/static/images/activity/delete-active.png") no-repeat;-->*/
                /*<!--background-size: 100% 100%;-->*/
              /*<!--}-->*/
            }
          }
        }
      }
      .m-guess-text {
        /*width: 700px;*/
        /*height: 473px;*/
        /*background: #924AEC;*/
        /*border-radius: 20px 20px 0 0;*/
        /*position: absolute;*/
        /*top: 1062px;*/
        /*left: 25px;*/
        padding: 0 15px;
        .m-rule-icon {
          width: 99px;
          height: 39px;
          /*background: url("/static/images/activity/icon-rule.png") no-repeat;*/
          background-size: 100% 100%;
          /*position: absolute;*/
          /*top: 11px;*/
          /*left: 59px;*/
          z-index: 1;
        }
        .m-text-bg {
          /*width: 644px;*/
          /*height: 444px;*/
          /*background: #731CE3;*/
          /*border-radius: 20px 20px 0 0;*/
          /*position: absolute;*/
          /*top: 29px;*/
          /*left: 28px;*/
          /*color: #ffffff;*/
          font-size: 38px;
          color: #666666;
          .m-rule-title {
            margin: 40px 0 10px 0;
            text-align: left;
          }
          .m-rule-row {
            display: flex;
            text-align: left;
            margin-bottom: 10px;
            font-size: 28px;
            .m-rule-no {
              text-align: center;
              /*width: 30px;*/
              /*height: 30px;*/
              /*font-size: 28px;*/
              /*font-weight: bold;*/
              line-height: 35px;
              /*padding: 10px;*/
              /*margin: 0 30px 30px 30px;*/
              /*<!--background-color: @mainColor;-->*/
              /*border-radius: 50%;*/
            }
          }
          .m-text {
            /*position: absolute;*/
            /*bottom: 12px;*/
            /*left: 188px;*/
            margin: 50px 0 30px;
          }
        }
      }
    }
    .m-guess-popup {
      width: 700px;
      height: 600px;
      margin: -300px 0 0 25px;
      border-radius: 30px;
      .m-guess-success {
        width: 700px;
        height: 602px;
        background: url("/static/images/activity/icon-success-bg.png") no-repeat;
        background-size: 100% 100%;
        .m-success-text {
          color: #FCD316;
          &.margin {
            margin-top: 46px;
          }
        }
        .m-btn-box {
          margin: 100px 50px 0 50px;
          width: 600px;
          display: flex;
          justify-content: space-between;
        }
        .m-success-btn {
          /*margin: 100px 0 0 65px;*/
        }
      }
      .m-guess-fail {
        .m-fail-btn {
          background-color: @mainColor;
          margin: 160px 0 0 225px;
        }
      }
      .m-guess-icon {
        width: 100px;
        height: 100px;
        margin: 110px 0 30px 0;
      }
      .m-guess-btn {
        width: 250px;
        height: 70px;
        line-height: 73px;
        color: #ffffff;
        background-color: #FCD316;
        box-shadow: 2px 8px 8px rgba(0,0,0,0.16);
        border-radius: 10px;
      }
    }
  }
</style>
