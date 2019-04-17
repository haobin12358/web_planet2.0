<template>
  <div class="m-activity-product-detail">
    <div class="m-member-swipe" v-if="product.images">
      <mt-swipe :auto="3000">
        <mt-swipe-item class="product-swipe" v-for="(item, index) in product.images" v-bind:key="item.piid">
          <img class="product-img" :src="item.pipic" @click="previewImage(index, product.images)">
        </mt-swipe-item>
      </mt-swipe>
      <span class="m-icon-back" @click="changeBack"></span>
      <span class="m-icon-gray-share" @click="shareProduct"></span>
    </div>
    <div class="m-activity-time">
      活动时间：{{product.tlastarttime}} - {{product.tlaendtime}}

    </div>
    <!--商品详情的文字信息-->
    <div class="m-detail-text">

      <div class="m-text-row">
        <div class="m-text-name">{{product.tctitle}}</div>
        <div class="m-activity-price">
          <div class="m-price" v-if="product.tlpprice">活动价：￥{{product.tlpprice | money}}</div>
          <div  v-if="product.prprice"><s>原价：￥{{product.prprice | money}}</s></div>
        </div>

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
    <sku v-if="show_sku" :now_select="select_value" :isAct="true" :now_num="canums" :product="product" @changeModal="changeModal" @sureClick="sureClick" :activity="true"></sku>

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

    <div class="m-product-detail-foot">
      <span class="m-icon-car" @click.stop="changeRoute('/shop')"></span>
      <span class="m-icon-service" @click.stop="changeRoute('/personal/serviceCenter')"></span>
      <div class="m-product-detail-btn">
        <span class="active" @click="addCart" v-if="can_buy == true">加入购物车</span>
        <span class="cancel" v-else>加入购物车</span>
        <span @click="buy" v-if="can_buy == true">立即购买</span>
        <span class="cancel" v-else>立即购买</span>

      </div>
      <img class="m-invite-course" src="/static/images/invite.png" v-if="show_invite" @click="show_invite = false">
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
        can_buy:false
      }
    },
    mixins: [wxapi],
    components: { sku },
    beforeDestroy() {

    },
    mounted() {
      common.changeTitle('活动商品详情');
      this.getProductDetail();              // 获取商品详情
      wxapi.wxRegister(location.href.split('#')[0]);
      localStorage.removeItem('share');
      localStorage.removeItem('url');
      localStorage.removeItem('login_to');
      if(common.isWeixin()) {
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
      }
      let time = setInterval(() => {
        this.can_buy = this.nowInDateBetwen(this.product.tlastarttime,this.product.tlaendtime);
      }, 1000);
    },
    methods: {
      //改变路由
      changeRoute(v){
        this.$router.push({path:v});
      },
      // 分享商品
      shareProduct(val) {
        if(common.isWeixin()) {
          if(localStorage.getItem('token')) {
            let options = {};
              options = {
                title: this.product.prtitle,
                desc: this.product.prdescription,
                imgUrl: this.product.prmainpic,
                link: window.location.href.split('#')[0] + '?tlpid=' + this.$route.query.tlpid
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
            localStorage.setItem('login_to',window.location.href.split('#')[0] + '?tlpid=' + this.$route.query.tlpid);
            // this.$router.push('/login');
            // this.$router.push('/login');
            this.$store.state.show_login = true;
          }
        }else {
          Toast('请在微信公众号分享');
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
          let params = {
            // token: localStorage.getItem('token'),
            tlpid: this.$route.query.tlpid
          };
          axios.get(api.timelimited_get, { params: params }).then(res => {
            if(res.data.status == 200){
              this.product = res.data.data;
              this.product.tctitle = res.data.data.prtitle;
              this.product.tcfreight = res.data.data.prfreight;
              this.product.tcdesc = res.data.data.prdesc;
              this.product.tcid = res.data.data.prid;
              this.product.tcattribute = res.data.data.prattribute;
              this.can_buy = this.nowInDateBetwen(this.product.tlastarttime,this.product.tlaendtime);
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
        }else   if(this.cart_buy == 'cart'){
          this.postCart();
          this.cart_buy = null;
        }
        this.changeModal('show_sku', false);
      },
      // 加入购物车
      addCart(){
        /*if(this.select_value){
            this.postCart();
        }else{
          this.show_sku = true;
        }*/
        this.show_sku = true;
        this.cart_buy = 'cart';
      },
      // 加入购物请求
      postCart(){
        if(localStorage.getItem('token')) {
          axios.post(api.cart_create + '?token=' + localStorage.getItem('token'), {
            skuid: this.select_value.skuid,
            canums: this.canums,
            cafrom: 4,
            contentid: this.$route.query.tlpid
          }).then(res => {
            if (res.data.status == 200) {
              Toast({message: res.data.message, duration: 1000, className: 'm-toast-success'});
            }
          }, error => {
            Toast({message: error.data.message, duration: 1000, className: 'm-toast-fail'});
          })
        }else{
          let url
          url = window.location.href.split('#')[0] + '?tlpid=' + this.$route.query.tlpid
          localStorage.setItem('login_to',url)
          // this.$router.push('/login');
          this.$store.state.show_login = true;
        }
      },
      // 立即下单
      buy() {
        if(this.select_value) {
          let product = {};
          product.pb = this.product.brand;
          product.cart = [];
          product.cart.push({ product: { prtitle: this.product.tctitle }, sku: this.select_value, canums: "1", prid: this.product.tcid,cafrom:4,contentid:this.$route.query.tlpid});
          let arr = [];
          arr.push(product);
          if(localStorage.getItem('token')) {
            this.$router.push({ path: '/submitOrder', query: { product: JSON.stringify(arr), from: this.which }});
          }else {
            let url
            url = window.location.href.split('#')[0] + '?tlpid=' + this.$route.query.tlpid
            localStorage.setItem('login_to',url)
            // this.$router.push('/login');
            this.$store.state.show_login = true;
          }
        }else {
          this.changeModal('show_sku', true);
          this.cart_buy = 'buy';
        }
      },
    //  比较时间
      nowInDateBetwen (d1,d2) {
        //如果时间格式是正确的，那下面这一步转化时间格式就可以不用了
        let dateBegin = new Date(d1.replace(/-/g, "/"));//将-转化为/，使用new Date
        let dateEnd = new Date(d2.replace(/-/g, "/"));//将-转化为/，使用new Date
        // var dateBegin = new Date(d1);//将-转化为/，使用new Date
        // var dateEnd = new Date(d2);//将-转化为/，使用new Date
        let dateNow = new Date();//获取当前时间

        let beginDiff = dateNow.getTime() - dateBegin.getTime();//时间差的毫秒数
        let beginDayDiff = Math.floor(beginDiff / (24 * 3600 * 1000));//计算出相差天数

        let endDiff = dateEnd.getTime() - dateNow.getTime();//时间差的毫秒数
        let endDayDiff = Math.floor(endDiff / (24 * 3600 * 1000));//计算出相差天数
        if (endDayDiff < 0) {//已过期
          return 'done'
        }
        if (beginDayDiff < 0) {//没到开始时间
          return 'wait';
        }
        return true;
      },

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
    .m-activity-time{
      font-size: 28px;
      background:linear-gradient(312deg,rgba(34,167,210,1) 0%,rgba(168,217,233,1) 100%);
      color: #fff;
      line-height: 50px;
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
      .m-activity-price{
        text-align: right;
        font-size: 24px;
        color:#BABABA;
        .m-price{
          color: #EF9B2D;
          font-size: 30px;
        }
      }
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
      padding: 26px 0;
      /*padding: 26px 0 98px;*/
      background-color: #fff;
      text-align: left;
      .m-icon-car{
        display: inline-block;
        width: 53px;
        height: 53px;
        background: url("/static/images/icon-car.png") no-repeat;
        background-size: 100% 100%;
        margin: 0 29px 0 15px;
        vertical-align: middle;
      }
      .m-icon-service{
        display: inline-block;
        width: 53px;
        height: 53px;
        background: url("/static/images/icon-service.png") no-repeat;
        background-size: 100% 100%;
        margin-right: 20px;
        vertical-align: middle;
      }
      .m-product-detail-btn{
        display: inline-block;
        height: 62px;
        line-height: 62px;
        span{
          color: #ffffff;
          display: inline-block;
          width: 246px;
          text-align: center;
          background-color: @mainColor;
          margin: 0;
          border-radius: 0 10px 10px 0;
          &.active{
            background-color: @mainColor;
            margin-right: -3px;
            border-radius: 10px 0 0 10px;
          }
          &.m-border{
            background-color: #fff;
            border: 3px solid  @mainColor;
            color: @mainColor;
            border-radius: 10px;
          }
          &.cancel{
            background-color: #a4a4a4;
          }
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
