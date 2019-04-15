<template>
  <div class="m-pandora">
    <div class="m-box-product">
      <div class="m-box-tip m-ft-28 m-ft-b" v-if="history && !mbjid">您的好友为您打开了魔法礼盒！</div>
      <div class="m-box-tip m-ft-28 m-ft-b" v-if="!history && !mbjid" @click="share">点击该处或下方跳动的分享按钮进行分享砍价！</div>
      <!--<div class="m-box-tip m-ft-28 m-ft-b" v-if="mbjid">点击任意一个盒子，为好友助力吧！</div>-->
      <div class="m-cloud-text" v-if="mbjid"></div>
      <div class="m-gift-one-one animated bounceInLeft" @click="pandora(1)"></div>
      <div class="m-gift-two-two animated bounceInDown" @click="pandora(2)"></div>
      <div class="m-gift-three-three animated bounceInUp" @click="pandora(3)"></div>
      <!--<div class="m-cloud-one"></div>-->
      <!--<div class="m-cloud-two"></div>-->
      <!--<div class="m-cloud-three"></div>-->
      <div class="m-cloud-bg"></div>
      <div class="m-cloud-four" :class="!record ? 'active' : ''"></div>
      <img class="m-product-img animated bounceIn" :src="box.prpic">
    </div>
    <div class="m-product-detail">
      <div class="m-buy-product">
        <div class="m-price-one m-ft-38 m-ft-b m-red" v-if="box.infos.current_price">预设价格：￥{{box.infos.current_price | money}}</div>
        <!--<div class="m-buy-product">-->
        <!--<div class="m-price-one m-ft-38 m-ft-b m-red">预设价格：￥{{2325 | money}}</div>-->
        <div class="m-box-btn m-ft-38 m-ft-b" v-if="box.infos.can_buy" @click="buyNow">点击购买</div>
      </div>
      <div class="m-product-name m-ft-38 m-ft-b tl">{{box.acname}}</div>
      <div class="m-product-price">
        <div class="m-price-two">原价：￥{{box.infos.skuprice | money}}</div>
        <div class="m-price-three m-red">最低价：￥{{box.infos.skuminprice | money}}</div>
      </div>
    </div>
    <div class="m-share-rule tl">
      <div class="m-rule-text">1号魔盒：随机减少<span class="m-red">{{box.infos.gearsone[0]}}</span>元</div>
      <div class="m-rule-text">2号魔盒：随机减少<span class="m-red">{{box.infos.gearstwo[0]}}</span>元或增加<span class="m-red">{{box.infos.gearstwo[1]}}</span>元</div>
      <div class="m-rule-text">3号魔盒：随机减少<span class="m-red">{{box.infos.gearsthree[0]}}</span>元或增加<span class="m-red">{{box.infos.gearsthree[1]}}</span>元</div>
      <div class="m-box-btn m-share-btn m-ft-38 m-ft-b animated infinite pulse" @click="share">点击分享</div>
    </div>
    <img class="m-invite-course" src="/static/images/invite.png" v-if="show_invite" @click="show_invite = false">

    <div class="m-record-text" :class="record ? 'active' : ''" v-if="record">
      <div class="m-rule-icon"></div>
      <div class="m-text-bg">
        <div class="m-rule-title" v-if="history">拆盒记录</div>
        <div class="m-rule-title" v-else>暂无拆盒记录</div>
        <div class="m-rule-row" v-for="(item, index) in history">
          <div class="m-rule-no">{{index + 1}}</div>
          <div class="m-ft-30">{{item.msg}}</div>
        </div>

        <div class="rule-text">1、点击分享 按钮邀请好友帮您点击魔盒</div>
        <div class="rule-text">2、好友点击您分享的魔盒后为您减少或增加随机金额</div>
        <div class="rule-text">3、达到您预期购买价格时您可以 点击购买</div>
        <div class="m-text m-ft-21">活动最终解释权归本公司所有</div>
      </div>
    </div>
    <div class="m-cloud-five" :class="record ? 'active' : ''"></div>

    <!--点击魔盒的popup-->
    <mt-popup class="m-box-popup" v-model="boxPopup" pop-transition="popup-fade">
      <div class="m-gift-icon"></div>
      <div class="m-popup-text m-ft-30 m-ft-b">您为好友{{change}}了
        <span class="m-red m-ft-44"> {{price.final_reduce_now | money}}元 </span>购买金额！
      </div>
      <div class="m-popup-title m-ft-30 m-ft-b">当前价格：<span class="m-red">{{price.final_price | money}}元</span></div>
      <div class="m-popup-btn m-ft-30 m-ft-b" @click="getBox">知道了</div>
    </mt-popup>
  </div>
</template>

<script type="text/ecmascript-6">
  import common from '../../../common/js/common';
  import axios from 'axios';
  import api from '../../../api/api';
  import wxapi from '../../../common/js/mixins';
  import wx from 'weixin-js-sdk';
  import { Toast } from 'mint-ui';

  export default {
    data() {
      return {
        name: '',
        boxPopup: false,            // 点击魔盒的popup
        record: true,
        box: { infos: { can_buy: false, current_price: '', skuprice: '', skuminprice: '', gearsone: [], gearstwo: [], gearsthree: [] }},
        history: [],
        mbaid: '',
        show_invite: false,
        price: { final_reduce_now: '', final_price: '' },
        change: '',
        uaid: '',
        mbjid: ''
      }
    },
    mixins: [wxapi],
    beforeDestroy() {
      // 如果不是去选择地址，则把product的localstorage去除
      if(!sessionStorage.getItem('choose')) {
        localStorage.removeItem('mbaid');
        sessionStorage.removeItem('choose');
      }
    },
    mounted() {
      common.changeTitle('魔法礼盒');
      this.mbjid = this.$route.query.mbjid;
      if(localStorage.getItem('mbjid')) {
        localStorage.setItem('mbjid', this.$route.query.mbjid);
      }
      this.getBox();                 // 获取该活动的规则
      this.uaid = localStorage.getItem('uaid');
      if(this.uaid) {
        localStorage.removeItem('uaid');
        this.buyNow();      // 点击购买
      }
      wxapi.wxRegister(location.href.split('#')[0]);
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
            this.share(1);
            clearInterval(time);
          }
        }, 100);
      }
    },
    methods: {
      // 点击魔盒
      pandora(level) {
        if(!this.$route.query.mbjid) {
          Toast('仅可打开好友分享的魔盒');
          return false;
        }
        let params = {
          level: level,
          mbjid: this.$route.query.mbjid
        };
        // 参与魔盒活动(获取分享所需的url参数)
        axios.post(api.open_magicbox + '?token='+ localStorage.getItem('token'), params).then(res => {
          if(res.data.status == 200) {
            res.data.data.final_reduce_now = res.data.data.final_reduce;
            if(res.data.data.final_reduce > 0) {
              this.change = '增加';
            }else if(res.data.data.final_reduce < 0) {
              this.change = '减少';
              res.data.data.final_reduce_now = 0 - res.data.data.final_reduce;
            }else if(res.data.data.final_reduce == 0) {
              this.change = '变化';
            }
            this.price = res.data.data;
            this.boxPopup = true;
          }
        });
      },
      // 点击分享
      share(val) {
        if(localStorage.getItem('token')) {
          let options = {
            title: '魔法礼盒',
            desc: '快来帮您的好友拆开魔法礼盒吧',
            imgUrl: location.origin + this.box.prpic
          };
          // 参与魔盒活动(获取分享所需的url参数) - 拿mbjid
          axios.post(api.join_magicbox + '?token='+ localStorage.getItem('token'), { mbaid: this.mbaid }).then(res => {
            if(res.data.status == 200) {
              localStorage.setItem('mbjid', res.data.data.mbjid);
              options.link = window.location.href.split('#')[0] + '?mbjid=' + localStorage.getItem('mbjid');
              if(val !== 1) {
                // 点击分享
                this.show_invite = true;
              }

              // 倒计时
              const TIME_COUNT = 3;
              let count = TIME_COUNT;
              let time = setInterval(() => {
                if (count > 0 && count <= TIME_COUNT) {
                  count --;
                } else {
                  this.show_invite = false;
                  clearInterval(time);
                }
              }, 1000);
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
                wx.onMenuShareAppMessage(options);
              }
              // 获取“分享到朋友圈”按钮点击状态及自定义分享内容接口（即将废弃）
              if(wx.onMenuShareTimeline) {
                wx.onMenuShareTimeline(options);
              }
            }
          });
        }else {
          Toast('请登录后再试');
        }
      },
      // 获取该活动
      getBox() {
        this.boxPopup = false;
        let params = {
          actype: 2,
        };
        // 有mbjid说明是好友分享过来的，这个时候不带token请求则获取好友这个魔盒的拆盒历史
        if(this.$route.query.mbjid) {
          params.mbjid = this.$route.query.mbjid;
        }else if(localStorage.getItem('token')) {
          params.token = localStorage.getItem('token');
        }
        axios.get(api.get_activity, { params: params }).then(res => {
          if(res.data.status == 200) {
            this.box = res.data.data;
            this.history = res.data.data.infos.open_history;
            this.mbaid = res.data.data.infos.mbaid;
            localStorage.setItem('mbaid', this.mbaid);
            if(this.history) {
              for(let i = 0; i < this.history.length; i ++) {
                if(this.history[i].mbohasshare) {
                  if(this.history[i].usname.length > 5) {
                    this.history[i].msg = this.history[i].usname.substr(0, 5) + '...';
                  }else {
                    this.history[i].msg = this.history[i].usname;
                  }
                  this.history[i].msg += ' 拆盒并分享，';
                }else {
                  if(this.history[i].usname.length > 8) {
                    this.history[i].msg = this.history[i].usname.substr(0, 8) + '...';
                  }else {
                    this.history[i].msg = this.history[i].usname;
                  }
                  this.history[i].msg += ' 拆盒，';
                }
                if(this.history[i].mboresult > 0) {
                  this.history[i].msg += '增加了' + this.history[i].mboresult + '元';
                }else if(this.history[i].mboresult < 0) {
                  this.history[i].msg += '减少了' + (-this.history[i].mboresult) + '元';
                }else {
                  this.history[i].msg += '变化了' + (-this.history[i].mboresult) + '元';
                }
              }
              this.history = this.history.concat();
            }
          }
        });
      },
      // 点击购买
      buyNow() {
        if(!this.uaid) {
          sessionStorage.setItem('choose', true);
          this.$router.push({ path: '/personal/addressManagement', query: { from: 'choose' }});
        }else {
          let params = {
            mbaid: localStorage.getItem('mbaid'),
            uaid: this.uaid,
            omclient: 0,
            opaytype: 0
          };
          axios.post(api.magicbox_recv_award + '?token='+ localStorage.getItem('token'), params).then(res => {
            if(res.data.status == 200) {
              localStorage.setItem('activityOrderNo', 2);
              if(common.isWeixin()) {
                this.wxPay(res.data.data.args);
              }else {
                Toast('请在活动订单页查看详情');
              }
            }
          });
        }
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
              // 成功调起支付，该页面已使用过，从订单列表页返回时不打开
              if(res.err_msg == "get_brand_wcpay_request:ok"){             // 支付成功
                // that.$router.push('/activityOrder');
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
      }
    }
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>
  @import "../../../common/css/index";

  .m-pandora {
    position: relative;
    .m-box-product {
      position: relative;
      height: 500px;
      background-color: #845AFA;
      z-index: 1;
      .m-box-tip {
        position: absolute;
        top: 10px;
        left: 0;
        width: 750px;
        text-align: center;
        color: #ffffff;
        padding-top: 23px;
        z-index: 10;
      }
      .m-gift-one {
        width: 184px;
        height: 204px;
        background: url("/static/images/activity/gift-one.png") no-repeat;
        background-size: 100% 100%;
        position: absolute;
        top: 223px;
        left: 119px;
        z-index: 10;
      }
      .m-gift-two {
        width: 162px;
        height: 191px;
        background: url("/static/images/activity/gift-two.png") no-repeat;
        background-size: 100% 100%;
        position: absolute;
        top: 128px;
        right: 118px;
        z-index: 10;
      }
      .m-gift-three {
        width: 198px;
        height: 210px;
        background: url("/static/images/activity/gift-three.png") no-repeat;
        background-size: 100% 100%;
        position: absolute;
        top: 453px;
        right: 58px;
        z-index: 10;
      }
      .m-gift-one-one {
        width: 217px;
        height: 229px;
        background: url("/static/images/activity/gift-one-one.png") no-repeat;
        background-size: 100% 100%;
        position: absolute;
        top: 200px;
        left: 90px;
        z-index: 10;
      }
      .m-gift-two-two {
        width: 209px;
        height: 225px;
        background: url("/static/images/activity/gift-two-two.png") no-repeat;
        background-size: 100% 100%;
        position: absolute;
        top: 160px;
        right: 118px;
        z-index: 10;
      }
      .m-gift-three-three {
        width: 213px;
        height: 234px;
        background: url("/static/images/activity/gift-three-three.png") no-repeat;
        background-size: 100% 100%;
        position: absolute;
        top: 453px;
        right: 58px;
        z-index: 10;
      }
      .m-cloud-text {
        width: 545px;
        height: 80px;
        background: url("/static/images/activity/cloud-text.png") no-repeat;
        background-size: 100% 100%;
        position: absolute;
        top: 40px;
        left: 110px;
        z-index: 10;
      }
      .m-cloud-bg {
        width: 750px;
        height: 1421px;
        background: url("/static/images/activity/cloud-bg.png") no-repeat;
        background-size: 100% 100%;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
      }
      .m-cloud-one {
        width: 750px;
        height: 431px;
        background: url("/static/images/activity/cloud-one.png") no-repeat;
        background-size: 100% 100%;
        position: absolute;
        top: 100px;
        left: 0;
        z-index: 1;
      }
      .m-cloud-two {
        width: 750px;
        height: 380px;
        background: url("/static/images/activity/cloud-two.png") no-repeat;
        background-size: 100% 100%;
        position: absolute;
        top: 275px;
        left: 0;
        z-index: 3;
      }
      .m-cloud-three {
        width: 750px;
        height: 877px;
        background: url("/static/images/activity/cloud-three.png") no-repeat;
        background-size: 100% 100%;
        position: absolute;
        top: 520px;
        left: 0;
        z-index: 5;
      }
      .m-cloud-four {
        width: 750px;
        height: 1200px;
        background: url("/static/images/activity/cloud-four.png") no-repeat;
        background-size: 100% 100%;
        position: absolute;
        top: 700px;
        left: 0;
        z-index: 6;
        &.active {
          height: 800px;
        }
      }
      .m-product-img {
        width: 383px;
        height: 383px;
        border: 12px solid #ffffff;
        box-shadow: 10px 10px 20px rgba(0,0,0,0.16);
        border-radius: 20px;
        position: absolute;
        top: 494px;
        left: 39px;
        z-index: 7;
      }
    }
    .m-product-detail {
      padding: 0 40px;
      z-index: 8;
      position: absolute;
      top: 940px;
      left: 0;
      .m-buy-product {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-right: -20px;
        .m-price-one {
          margin-right: 30px;
        }
      }
      .m-product-name {
        padding: 25px 0 30px 0;
      }
      .m-product-price {
        width: 670px;
        display: flex;
        justify-content: space-between;
        font-size: 30px;
        font-weight: bold;
        .m-price-two {

        }
        .m-price-three {

        }
      }
    }
    .m-box-btn {
      width: 200px;
      height: 51px;
      text-align: center;
      line-height: 55px;
      white-space: nowrap;
      color: #ffffff;
      padding: 16px 30px;
      background: linear-gradient(180deg, @subColor 0%, @mainColor 100%);
      box-shadow: 0 5px 10px rgba(0,0,0,0.16);
      border-radius: 50px;
    }
    .m-share-btn {
      width: 240px;
      margin: 35px 0 0 175px;
    }
    .m-share-rule {
      padding: 50px 40px;
      position: absolute;
      top: 1160px;
      left: 0;
      z-index: 8;
      .m-rule-text {
        color: #999999;
        font-size: 24px;
      }
    }
    .m-invite-course {
      position: fixed;
      top:0;
      left:0;
      width: 100%;
      height: 100%;
      z-index: 10;
    }
    .m-cloud-five {
      width: 750px;
      height: 226px;
      background: url("/static/images/activity/cloud-five.png") no-repeat;
      background-size: 100% 100%;
      position: absolute;
      top: 1310px;
      left: 0;
      z-index: 1;
      &.active {
        top: 1795px;
      }
    }
    .m-red {
      color: #C70000;
    }
    .m-record-text {
      width: 700px;
      height: 560px;
      background: #B0F4F5;
      border-radius: 20px 20px 0 0;
      position: absolute;
      top: 1500px;
      left: 25px;
      z-index: 2;
      &.active {
        top: 1460px;
      }
      .m-rule-icon {
        width: 99px;
        height: 39px;
        background: url("/static/images/activity/icon-rule.png") no-repeat;
        background-size: 100% 100%;
        position: absolute;
        top: 11px;
        left: 59px;
        z-index: 1;
      }
      .m-text-bg {
        width: 644px;
        height: 530px;
        background: #845AFA;
        border-radius: 20px 20px 0 0;
        position: absolute;
        top: 29px;
        left: 28px;
        color: #ffffff;
        font-size: 38px;
        .m-rule-title {
          margin: 24px 0 30px 0;
        }
        .m-rule-row {
          display: flex;
          .m-rule-no {
            width: 25px;
            height: 25px;
            font-size: 26px;
            font-weight: bold;
            line-height: 30px;
            padding: 10px;
            margin: 0 30px 20px 30px;
            background-color: @mainColor;
            border-radius: 50%;
          }
        }
        .rule-text {
          font-size: 24px;
          text-align: left;
          margin: 0 -20px 0 50px;
        }
        .m-text {
          position: absolute;
          bottom: 0;
          left: 188px;
        }
      }
    }
    .m-box-popup {
      width: 680px;
      height: 600px;
      margin: -300px 0 0 25px;
      border-radius: 30px;
      border: 10px #9A5AEB dashed;
      .m-gift-icon {
        width: 183px;
        height: 204px;
        background: url("/static/images/activity/gift-four.png") no-repeat;
        background-size: 100% 100%;
        position: absolute;
        top: -90px;
        left: 1px;
      }
      .m-popup-title {
        margin-top: 20px;
      }
      .m-popup-text {
        margin-top: 200px;
      }
      .m-popup-btn {
        width: 250px;
        height: 70px;
        line-height: 75px;
        margin: 100px 0 0 225px;
        color: #ffffff;
        background-color: @mainColor;
        box-shadow: 2px 8px 8px rgba(0,0,0,0.16);
        border-radius: 10px;
      }
    }
  }
</style>
