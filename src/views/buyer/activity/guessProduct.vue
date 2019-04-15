<template>
  <div class="m-activity-product">
    <div class="m-img-box">
      <img class="m-member-img" :src="banner">
      <div class="m-top-bg"></div>
    </div>
    <div class="m-activity-product-text-box">
      <div class="m-ft-36 m-ft-b">{{title}}</div>
      <!--<div class="m-activity-product-text m-ft-24">{{remarks}}</div>-->
    </div>
    <!--内容-->
    <div class="m-product-content">
      <div class="m-product-part" v-for="item in productList" @click="changeRoute('/guessProductDetail', item)">
        <div class="m-part-left">
          <img class="m-product-img" :src="item.prmainpic">
        </div>
        <div class="m-part-right">
          <div class="m-right-row">
            <div class="m-product-name"><span class="m-product-tag">【{{title}}】</span>{{item.prtitle}}</div>
          </div>
          <div class="m-product-description"></div>
          <!--<div class="m-product-description">{{item.prdescription}}</div>-->
          <div class="m-price-share">
            <div class="m-product-price" v-if="item.prprice"><span class="m-price-time">￥{{item.prprice | money}}</span></div>
            <!--<img class="m-share-img" src="/static/images/icon-gray-share.png" alt="" @click="productShare(item)">-->
            <!--<div class="m-share-text" @click.stop="productShare(item)">分享</div>-->
          </div>
          <img class="m-invite-course" src="/static/images/invite.png" v-if="show_invite" @click="show_invite = false">
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import common from '../../../common/js/common';
  import axios from 'axios';
  import api from '../../../api/api';
  import { Toast } from 'mint-ui';
  import wx from 'weixin-js-sdk';
  import wxapi from '../../../common/js/mixins';

  export default {
    data() {
      return {
        name: '',
        page_num: 1,
        page_size: 10,
        title: "",
        banner: "",
        remarks: "",
        productList: [],
        show_invite: false,
        guess: {}
      }
    },
    mixins: [wxapi],
    components: {},
    mounted() {
      common.changeTitle('活动商品');
      this.getProduct();               // 获取商品
      // 倒计时
      const TIME_COUNT = 1;
      let count = TIME_COUNT;
      let time = setInterval(() => {
        if(count > 0 && count <= TIME_COUNT) {
          count --;
        }else {
          this.shareIndex();               // 分享后点击进入首页
          clearInterval(time);
        }
      }, 300);
      wxapi.wxRegister(location.href.split('#')[0]);
      localStorage.removeItem('share');
      localStorage.removeItem('url');
    },
    methods: {
      // 跳转页面
      changeRoute(v, item) {
        localStorage.setItem('guessproduct', JSON.stringify(item));
        this.$router.push({ path: v ,query:{which:'guess'}});
      },
      // 商品分享按钮
      productShare(item) {
        if(common.isWeixin()) {
          if(localStorage.getItem('token')) {
            let options = {};
            let which = this.$route.query.which;
            if(which == "new") {
              options = {
                title: item.prtitle,
                desc: item.prtitle,
                imgUrl: item.tcmainpic,
                link: window.location.href.split('#')[0] + '?fmfpid=' + item.fmfpid + '&which=new'
              };
            }else if(which == "try") {
              options = {
                title: item.tctitle,
                desc: item.tcdescription,
                imgUrl: item.tcmainpic,
                link: window.location.href.split('#')[0] + '?tcid=' + item.tcid + '&which=try'
              };
            }
            axios.get(api.secret_usid + '?token=' + localStorage.getItem('token')).then(res => {
              if(res.data.status == 200) {
                options.link += '&secret_usid=' + res.data.data.secret_usid;
                // 点击分享
                this.show_invite = true;
              }
            });

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
          }else {
            Toast('请登录后再试');
          }
        }else {
          Toast('请在微信公众号分享');
        }
      },
      // 分享后点击进入首页
      shareIndex() {
        let which = this.$route.query.which;
        let options = {};
        if(which == "new") {
          options = {
            title: this.title,
            desc: this.remarks,
            imgUrl: this.productList[0].tcmainpic,
            link: location.href.split('#')[0] + '?activityId=new'
          }
        }else if(which == "try") {
          options = {
            title: this.title,
            desc: this.remarks,
            imgUrl: this.productList[0].tcmainpic,
            link: location.href.split('#')[0] + '?activityId=try'
          }
        }else if(which == "guess") {
          options = {
            title: this.title,
            desc: this.remarks,
            imgUrl: this.banner,
            link: window.location.href.split('#')[0] + '?uaid=guess'
          }
        }
        if(localStorage.getItem('token')) {
          axios.get(api.secret_usid + '?token=' + localStorage.getItem('token')).then(res => {
            if(res.data.status == 200) {
              options.link += '&secret_usid=' + res.data.data.secret_usid;
            }
          })
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
          console.log(options)
          wx.onMenuShareAppMessage(options);
        }
        // 获取“分享到朋友圈”按钮点击状态及自定义分享内容接口（即将废弃）
        if(wx.onMenuShareTimeline) {
          wx.onMenuShareTimeline(options);
        }
      },
      // 获取商品
      getProduct() {
        this.guess = JSON.parse(localStorage.getItem('guess'));
        this.title = this.guess.acname;
        this.banner = this.guess.actopPic;
        this.remarks = this.guess.acdesc;
        this.productList = [];
        let product = {};
        for(let i in this.guess.fresh_man) {
          product = this.guess.fresh_man[i].product;
          product.gnaaid = this.guess.fresh_man[i].gnaaid;
          this.productList.push(product);
        }
      },
    }
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>
  @import "../../../common/css/index";

  .m-activity-product {
    min-height: 100%;
    .m-img-box {
      margin-bottom: -15px;
      .m-member-img {
        width: 750px;
        height: 360px;
      }
      .m-top-bg {
        width: 750px;
        height: 67px;
        background: url("/static/images/icon-bg.png") no-repeat;
        background-size: 100% 100%;
        position: absolute;
        top: 295px;
        left: 0;
      }
    }
    .m-product-content {
      padding: 70px 50px 0 50px;
    }
  }
</style>
