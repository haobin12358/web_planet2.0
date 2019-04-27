<template>
  <div class="m-activity-product-detail">
    <div class="m-member-swipe" v-if="product.images">
      <mt-swipe :auto="3000">
        <mt-swipe-item class="product-swipe" v-for="(item, index) in product.images" v-bind:key="item.tciid">
          <img class="product-img" :src="item.tcipic" @click="previewImage(index, product.images)">
        </mt-swipe-item>
      </mt-swipe>
      <span class="m-icon-back" @click="changeBack"></span>
      <!--<span class="m-icon-gray-share" @click="shareProduct"></span>-->
    </div>
    <!--商品详情的文字信息-->
    <div class="m-detail-text">
      <div class="m-text-row">
        <div class="m-text-name">{{product.prtitle}}</div>
        <!--<div class="m-text-price" v-if="product.tcdeposit">押金：￥{{product.tcdeposit | money}}</div>-->
        <div class="m-text-price" v-if="product.prprice">￥{{product.prprice | money}}</div>
      </div>
      <div class="m-text-row">
        <div class="m-text-description">{{product.prdescription}}</div>
        <div class="m-text-time" v-if="product.zh_deadline">（<span class="m-time-bold">{{product.zh_deadline}}</span>）</div>
      </div>
      <div class="m-text-row">
        <span>快递：{{product.prfreight}} 元</span>
        <span>月销：{{product.month_sale_value}}</span>
        <div @click="changeRoute('/brandDetail')" v-if="product.brand">
          <span class="m-brand-name" >{{product.brand.pbname}}</span>
          <span class="m-more"></span>
        </div>
      </div>
    </div>
    <!--选择sku-->
    <sku v-if="show_sku" :now_select="select_value" :now_num="canums" :product="product" @changeModal="changeModal" @sureClick="sureClick" :activity="true"></sku>

    <div class="m-text-row m-sku-row" @click="changeModal('show_sku', true)">
      <div class="m-text-courier">规格</div>
      <div class="m-text-description">
        <template v-if="select_value">
          <span v-for="(item, index) in select_value.skuattritedetail">{{product.tcattribute[index]}} <span v-if="item">:</span> {{item}} </span>
        </template>
        <template v-else>
          <span v-for="item in product.tcattribute">{{item}} </span>
        </template>
      </div>
      <img class="m-right-img" src="/static/images/icon-right.png" alt="">
    </div>
    <div class="m-detail-img-box">
      <img class="m-detail-img" v-for="item in product.tcdesc" :src="item" alt="">
    </div>
    <img class="m-invite-course" src="/static/images/invite.png" v-if="show_invite" @click="show_invite = false">

    <div class="m-detail-btn-box">
      <!--<div class="m-detail-service"></div>-->
      <div class="m-buy-btn m-ft-30" @click="buy">立即下单</div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import common from '../../../common/js/common';
  import axios from 'axios';
  import api from '../../../api/api';
  import sku from '../components/sku';
  import { Toast } from 'mint-ui';
  import wx from 'weixin-js-sdk';
  import wxapi from '../../../common/js/mixins';

  let scroll = (function (className) {
    let scrollTop;
    return {
      afterOpen: function () {
        scrollTop = document.scrollingElement.scrollTop || document.body.scrollTop;
        document.body.classList.add(className);
        document.body.style.top = -scrollTop + 'px';
      },
      beforeClose: function () {
        document.body.classList.remove(className);
        document.scrollingElement.scrollTop = scrollTop;
        document.body.scrollTop = scrollTop;
      }
    };
  })('scroll');

  export default {
    data() {
      return {
        name: '',
        tcid: "",
        product: {},
        show_sku: false,
        select_value: null,
        canums: 1,
        cart_buy: null,
        which: '',
        show_invite: false
      }
    },
    mixins: [wxapi],
    components: { sku },
    beforeDestroy() {
      // this.which = this.$route.query.which;
      // if(this.which == "new") {
      //   this.$router.push('/activityProduct?which=new');
      // }else if(this.which == "try") {
      //   this.$router.push('/activityProduct?which=try');
      // }
    },
    mounted() {
      common.changeTitle('购买礼包');
      this.getProductDetail();              // 获取商品详情
      this.getUser();
      // wxapi.wxRegister(location.href.split('#')[0]);
      // localStorage.removeItem('share');
      // localStorage.removeItem('url');
      // if(common.isWeixin()) {
      //   if(localStorage.getItem('token')) {
      //     // 倒计时
      //     const TIME_COUNT = 1;
      //     let count = TIME_COUNT;
      //     let time = setInterval(() => {
      //       if(count > 0 && count <= TIME_COUNT) {
      //         count --;
      //       }else {
      //         this.shareProduct(1);
      //         clearInterval(time);
      //       }
      //     }, 100);
      //   }
      // }
    },
    methods: {
      // 分享商品
      shareProduct(val) {
        if(common.isWeixin()) {
          if(localStorage.getItem('token')) {
            let options = {};
            options = {
              title: this.product.prtitle,
              desc: this.product.prdescription,
              imgUrl: this.product.prmainpic,
              link: window.location.href.split('#')[0] + '?prid=' + this.product.tcid
            };
            axios.get(api.secret_usid + '?token=' + localStorage.getItem('token')).then(res => {
              if(res.data.status == 200) {
                options.link += '&secret_usid=' + res.data.data.secret_usid;
                if(val !== 1) {
                  // 点击分享
                  this.show_invite = true;
                }
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
      // 返回上一页
      changeBack(){
        this.$router.go(-1);
      },
      //改变路由
      changeRoute(v){
        this.$router.push({path:v,query:{pbid:this.product.pbid}});
      },
      // 获取身份
      getUser() {
        axios.get(api.get_home + "?token=" + localStorage.getItem('token')).then(res => {
          if(res.data.status == 200) {
            if(res.data.data.uslevel == "1") {            // 1 - 买家 - 去商家大礼包list页面

            }else if(res.data.data.uslevel == "2") {      // 2 - 卖家 - 去卖家版首页

            }else if(res.data.data.uslevel == "3") {      // 3 - 申请成为卖家中
              this.$router.push("/selected");
            }else if(res.data.data.uslevel == "4") {      // 4 - 已购买大礼包，但是未认证 - 去认证
              // Toast('请完成店主身份认证');
              this.$router.push("/personal");
            }
          }
        });
      },
      // 预览图片
      previewImage(index, image) {

        let images = [];
        for(let i = 0; i < image.length; i ++) {
          if(image[i].pipic){
            images.push(image[i].pipic);
          }else if(image[i].tcipic){
            images.push(image[i].tcipic);
          }
        }
        let options = {
          current: image[index].pipic, // 当前显示图片的http链接
          urls: images,                  // 当前预览图片的list
        };
        wxapi.previewImage(options);
      },
      // 改变模态框 - 商品sku
      changeModal(v,bool) {
        this[v] = bool;
        if(bool){
          scroll.afterOpen();
        }else{
          scroll.beforeClose();
        }
      },
      // 获取商品详情
      getProductDetail() {
          axios.get(api.product_get + '?prid=' + this.$route.query.prid).then(res => {
            if(res.data.status == 200){
              this.product = res.data.data;
              this.product.tctitle = res.data.data.prtitle;
              this.product.tcfreight = res.data.data.prfreight;
              this.product.tcdesc = res.data.data.prdesc;
              this.product.tcid = res.data.data.prid;
              this.product.tcattribute = res.data.data.prattribute;
              if(this.product.images) {
                for(let i = 0; i < this.product.images.length; i ++) {
                  this.product.images[i].tciid = this.product.images[i].piid;
                  this.product.images[i].tcipic = this.product.images[i].pipic;
                }
              }
            }
          });

      },
      // sku确定
      sureClick(item, num) {
        this.canums = num;
        this.select_value = item;
        if(this.cart_buy == 'buy') {
          this.buy();
          this.cart_buy = null;
        }
        this.changeModal('show_sku', false);
      },
      // 立即下单
      buy() {
        if(this.select_value) {
          let product = {};
          product.pb = this.product.brand;
          product.cart = [];
          product.cart.push({ product: { prtitle: this.product.tctitle }, sku: this.select_value, canums: "1", prid: this.product.tcid});
          let arr = [];
          arr.push(product);
          if(localStorage.getItem('token')) {
            this.$router.push({ path: '/submitOrder', query: { product: JSON.stringify(arr),gift:'gift'}});
          }else {
            Toast('请登录后再试');
          }
        }else {
          this.changeModal('show_sku', true);
          this.cart_buy = 'buy';
        }
      }
    }
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>
  @import "../../../common/css/index";

  .m-activity-product-detail {
    .mint-swipe{
      width: 750px;
      height: 750px;
    }
    .product-swipe {
      width: 750px;
      height: 750px;
    }
    .product-img{
      display: block;
      background-color: #EEEEEE;
      max-width: 750px;
      max-height: 750px;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      margin: auto;
    }
    .m-member-swipe{
      position: relative;
      width: 750px;
      height: 750px;
      .m-icon-back{
        position: absolute;
        top: 45px;
        left: 45px;
        width: 70px;
        height: 70px;
        background: url("/static/images/yuan-back.png") no-repeat;
        background-size: 100% 100%;
      }
      .m-icon-gray-share {
        position: absolute;
        top: 45px;
        right: 45px;
        display: block;
        width: 70px;
        height: 70px;
        background: url("/static/images/yuan-share.png") no-repeat;
        background-size: 100% 100%;
      }
    }
    .m-detail-text {
      padding: 25px 25px 15px 30px;
      box-shadow: 0 3px 6px rgba(0,0,0,0.16);
    }
    .m-text-row {
      display: flex;
      justify-content: space-between;
      .m-text-name {
        font-size: 30px;
        font-weight: bold;
        color: #000000;
        margin-right: 20px;
        text-align: left;
      }
      .m-text-price {
        color: #C70000;
        font-size: 30px;
        font-weight: bold;
      }
      .m-text-description {
        font-size: 24px;
        text-align: left;
        width: 500px;
        padding: 0 0 15px 0;
      }
      .m-text-time {
        color: #C70000;
        font-size: 30px;
        .m-time-bold {
          font-weight: bold;
        }
      }
      .m-text-courier {
        color: #999999;
        font-size:24px;
      }
      .m-right-img {
        width: 15px;
        height: 24px;
        padding-top: 5px;
      }
    }
    .m-sku-row {
      padding: 30px 30px 10px 30px;
      box-shadow: 0 3px 6px rgba(0,0,0,0.16);
    }
    .m-detail-img-box {
      margin: 10px 0 100px 0;
      .m-detail-img {
        width: 750px;
        margin-bottom: -5px;
      }
    }
    .m-detail-btn-box {
      width: 750px;
      display: flex;
      align-items: center;
      padding: 20px 17px 20px 55px;
      background-color: #ffffff;
      position: fixed;
      bottom: 0;
      left: 0;
      .m-detail-service {
        width: 52px;
        height: 53px;
        background: url("/static/images/icon-service.png") no-repeat;
        background-size: 100% 100%;
      }
      .m-buy-btn {
        color: #ffffff;
        margin-left: 50px;
        padding: 11px 220px;
        /*border-radius: 10px;*/
        background-color: @mainColor;
      }
    }
    .m-invite-course {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1000;
    }
  }
</style>
