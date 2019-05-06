<template>
  <div class="m-activity-product-detail">
    <div class="m-member-swipe" v-if="product.image">
      <mt-swipe :auto="3000">
        <mt-swipe-item class="product-swipe" v-for="(item, index) in product.image" v-bind:key="item.tciid">
          <img class="product-img" :src="item.tcipic" @click="previewImage(index, product.image)">
        </mt-swipe-item>
      </mt-swipe>
<!--      <span class="m-icon-back" @click="changeBack"></span>-->
<!--      <span class="m-icon-gray-share" @click="shareProduct"></span>-->
    </div>
    <!--商品详情的文字信息-->
    <div class="m-detail-text">
      <div class="m-text-row">
        <div class="m-text-name">{{product.tctitle}}</div>
        <div class="m-text-price" v-if="product.tcdeposit">押金：￥{{product.tcdeposit | money}}</div>
        <div class="m-text-price" v-if="product.prprice">￥{{product.prprice | money}}</div>
      </div>
      <div class="m-text-row">
        <div class="m-text-description">{{product.tcdescription}}</div>
        <div class="m-text-time" v-if="product.zh_deadline">（<span class="m-time-bold">{{product.zh_deadline}}</span>）</div>
      </div>
      <div class="m-text-row">
        <div class="m-text-courier">快递：{{product.tcfreight}} 元</div>
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
    <div class="m-product-detail-foot">
      <div class="m-icon-box">
        <img src="/static/images/product/icon-service.png" class="m-icon" @click.stop="changeRoute('/personal/serviceCenter')" />
        <p>客服</p>
      </div>
      <div class="m-icon-box" v-if="$route.query.which == 'new'">
        <img src="/static/images/product/icon-share.png" class="m-icon" @click="sendShare" />
        <p>推广</p>
      </div>
      <div class="m-product-detail-btn">
        <span @click="buy">立即购买</span>
      </div>
    </div>
    <div class="m-modal-img" v-if="show_img">
      <div class="m-modal-state">
        <span class="m-close" @click="show_img = false"> X</span>
        <img :src="share_img" class="m-share-img" alt="">
      </div>
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
        show_invite: false,
        show_img:false,
        share_img:'',
        share_url:'',
      }
    },
    mixins: [wxapi],
    components: { sku },
    beforeDestroy() {
      this.which = this.$route.query.which;
      if(this.which == "new") {
        this.$router.push('/activityProduct?which=new');
      }else if(this.which == "try") {
        this.$router.push('/activityProduct?which=try');
      }
    },
    mounted() {
      common.changeTitle('活动商品详情');
      this.getProductDetail();              // 获取商品详情
      wxapi.wxRegister(location.href.split('#')[0]);
      localStorage.removeItem('share');
      localStorage.removeItem('url');
      localStorage.removeItem('login_to');
      // if(common.isWeixin()) {
        if(localStorage.getItem('token')) {
          // 倒计时
          const TIME_COUNT = 1;
          let count = TIME_COUNT;
          let time = setInterval(() => {
            if(count > 0 && count <= TIME_COUNT) {
              count --;
            }else {
              this.shareProduct(1);
              clearInterval(time);
            }
          }, 300);
        }
      // }
    },
    methods: {
      //改变路由
      changeRoute(v){
          this.$router.push({path:v});
      },
      // 分享商品
      shareProduct(val) {
          if(localStorage.getItem('token')) {
            let options = {};
            let which = this.$route.query.which;
            if(which == "new") {
              options = {
                title: this.product.prtitle,
                desc: this.product.prdescription,
                imgUrl: this.product.prmainpic,
                link:location.href.split('#')[0] + '?fmfpid=' + this.$route.query.fmfpid + '&which=new'
              };
            }else if(which == "try") {
              options = {
                title: this.product.tctitle,
                desc: this.product.tcdescription,
                imgUrl: this.product.tcmainpic,
                link: location.href.split('#')[0] + '?tcid=' + this.$route.query.tcid + '&which=try'
              };
            }
            axios.get(api.secret_usid + '?token=' + localStorage.getItem('token')).then(res => {
              if(res.data.status == 200) {
                options.link += '&secret_usid=' + res.data.data.secret_usid;
                this.share_url = options.link;
                console.log(options.link)
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
            // Toast('请登录后再试');
          }

      },
      //推广
      sendShare(){
        if(this.share_img== ''){
          axios.get(api.get_promotion,{
            params:{
              prid:this.product.prid,
              token:localStorage.getItem('token'),
              url:this.share_url
            }
          }).then(res => {
            if(res.data.status == 200){
              this.share_img = res.data.data;
              this.show_img = true;
            }
          },error => {
            Toast({ message: error.data.message,duration:1000, className: 'm-toast-fail' });
          })
        }else{
          this.show_img = true;
        }
      },
      // 返回上一页
      changeBack(){
        this.$router.go(-1);
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
        this.which = this.$route.query.which;
        if(this.which == "new") {
          let params = {
            token: localStorage.getItem('token'),
            fmfpid: this.$route.query.fmfpid
          };
          axios.get(api.fresh_man_get, { params: params }).then(res => {
            if(res.data.status == 200){
              this.product = res.data.data;
              this.product.tctitle = res.data.data.prtitle;
              this.product.tcfreight = res.data.data.prfreight;
              this.product.tcdesc = res.data.data.prdesc;
              this.product.tcid = res.data.data.prid;
              this.product.tcattribute = res.data.data.prattribute;
              if(this.product.image) {
                for(let i = 0; i < this.product.image.length; i ++) {
                  this.product.image[i].tciid = this.product.image[i].piid;
                  this.product.image[i].tcipic = this.product.image[i].pipic;
                }
              }
            }
          });
        }else if(this.which == "try") {
          let params = {
            token: localStorage.getItem('token'),
            tcid: this.$route.query.tcid
          };
          axios.get(api.get_commodity_detail, { params: params }).then(res => {
            if(res.data.status == 200){
              this.product = res.data.data;
              this.product.prmainpic = res.data.data.tcmainpic;
            }
          });
        }
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
            this.$router.push({ path: '/submitOrder', query: { product: JSON.stringify(arr), from: this.which }});
          }else {
            let which = this.$route.query.which;
            let url;
            if(which == "new") {
              url = window.location.href.split('#')[0] + '?fmfpid=' + this.$route.query.fmfpid + '&which=new'

            }else if(which == "try") {
              url =  window.location.href.split('#')[0] + '?tcid=' + this.$route.query.tcid + '&which=try'
            }
            localStorage.setItem('login_to',url)
            // this.$router.push('/login');
            this.$store.state.show_login = true;
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
    .m-product-detail-foot{
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      padding: 0 0 0 0;
      /*padding: 26px 0 98px;*/
      background-color: #fff;
      .flex-row(space-around);
      .m-icon-box{
        .flex-col(center);
        width: 80px;
        font-size: 18px;
        .m-icon{
          display: block;
          width: 40px;
          height: 40px;
        }
      }
      .m-product-detail-btn{
        display: inline-block;
        height: 98px;
        line-height: 98px;
        span{
          color: #ffffff;
          display: inline-block;
          width: 580px;
          text-align: center;
          font-size: 30px;
          background:linear-gradient(313deg,@mainColor 0%,@subColor 100%);
          margin: 0;
          &:first-child{
            margin-right: -6px;
          }
        }
      }
    }
    .m-modal-img{
      position: fixed;
      width: 100%;
      height: 100%;
      top: 0;
      bottom: 0;
      left:0;
      right: 0;
      background-color: rgba(0,0,0,0.4);
      .m-modal-state{
        position: absolute;
        left: 50%;
        margin-left: -250px;
        top:50%;
        margin-top: -350px;
        width: 500px;
        height: 700px;
        background-color: #fff;
        border-radius: 10px;
        .m-close{
          position: absolute;
          top: 20px;
          right: 20px;
          font-size: 40px;
        }
        .m-share-img{
          display: block;
          width: 500px;
          height: 700px;
        }
      }
    }
  }
</style>
