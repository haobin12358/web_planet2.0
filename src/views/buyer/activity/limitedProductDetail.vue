<template>
  <div class="m-activity-product-detail">
    <div class="m-member-swipe" v-if="product.images">
      <mt-swipe :auto="3000">
        <mt-swipe-item class="product-swipe" v-for="(item, index) in product.images" v-bind:key="item.piid">
          <img class="product-img" :src="item.pipic" @click="previewImage(index, product.images)">
        </mt-swipe-item>
      </mt-swipe>
<!--      <span class="m-icon-back" @click="changeBack"></span>-->
<!--      <span class="m-icon-gray-share" @click="shareProduct"></span>-->
    </div>
    <div class="m-activity-time">
      活动时间：{{product.tlastarttime}} - {{product.tlaendtime}}
    </div>
    <!--商品详情的文字信息-->
    <div class="m-detail-text">

      <div class="m-flex-between">
        <div>
          <div class="m-flex-between">
            <p class="m-flex-start">
              <span class="m-activity-price" v-if="product.tlpprice">￥{{product.tlpprice | money}}</span>
              <img src="/static/images/newActivity/limit-label.png" class="m-activity-label" alt="">
            </p>
            <h3 v-if="product.profict">
              <span class="m-profict-title">预计赚：</span>
              <span class="m-red">￥{{product.profict}}</span>
            </h3>
          </div>

          <p class="m-marking-price m-flex-between">
            <span>价格：<s>{{product.prprice| money}}</s></span>
            <span>市场价：<s>￥{{product.prlineprice | money }}</s></span>
          </p>
        </div>
      </div>
      <div class="m-flex-between m-product-title-box">
        <span class="m-product-title">{{product.prtitle}}</span>
<!--        <img src="/static/images/product/icon-collect-active.png" v-if="product.collected" @click="clickCollect" class="m-icon-collect" alt="">-->
<!--        <img src="/static/images/product/icon-product-collect.png" v-else @click="clickCollect" class="m-icon-collect" alt="">-->
      </div>
      <div class="m-info-list">
        <span>快递：{{product.prfreight | money}} 元</span>
        <span>月销：{{product.prsalesvalue}}</span>
        <span >{{product.brand.pbname}}</span>
        <!--          <div @click="changeRoute('/brandDetail')">-->
        <!--            <span class="m-brand-name">{{product_info.brand.pbname}}</span>-->
        <!--            <span class="m-more"></span>-->
        <!--          </div>-->
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
<!--    <div class="m-product-detail-more">-->
<!--      <div class="m-flex-start">-->
<!--        <span class="m-label">优惠券</span>-->
<!--        <template v-for="(a, b) in product.coupons.slice(0,2)">-->
<!--          <span class="m-coupon-label" v-if="a.codiscount == '10'" ><span v-if="a.codownline != 0"> 满{{a.codownline}}</span><span v-else>无限制</span>减{{a.cosubtration}}</span>-->
<!--          <span class="m-coupon-label" v-else >{{a.codiscount}}折</span>-->
<!--        </template>-->
<!--      </div>-->
<!--      <div>-->
<!--        <span class="m-ft-20" v-if="product.coupons.length > 0"  @click="show_coupon = true">领劵</span>-->
<!--        <span class="m-ft-20" v-else>暂无</span>-->
<!--        <span class="m-more"  @click="show_coupon = true"></span>-->
<!--      </div>-->
<!--    </div>-->
    <div class="m-detail-img-box">
      <img class="m-detail-img" v-for="item in product.tcdesc" :src="item" alt="">
    </div>
    <div class="m-product-detail-foot">
      <span class="m-icon-car" @click.stop="changeRoute('/shop')"></span>
      <span class="m-icon-service" @click.stop="changeRoute('/personal/serviceCenter')"></span>
      <div class="m-product-detail-btn">
        <span class="active" @click="addCart" v-if="can_buy == true">加入购物车</span>
        <span class="cancel" v-else>加入购物车</span>
        <span @click="buy" v-if="can_buy == true">立即购买</span>
        <span class="cancel" v-else>立即购买</span>

      </div>

    </div>
    <div class="m-product-detail-foot">
      <div class="m-icon-box">
        <img src="/static/images/product/icon-service.png" class="m-icon" @click.stop="changeRoute('/personal/serviceCenter')" />
        <p>客服</p>
      </div>
      <div class="m-icon-box">
        <img src="/static/images/product/icon-bottom-car.png" class="m-icon" @click.stop="changeRoute('/shop')" />
        <p>购物车</p>
      </div>
      <div class="m-icon-box">
        <img src="/static/images/product/icon-share.png" class="m-icon" @click="sendShare" />
        <p>推广</p>
      </div>
      <div class="m-product-detail-btn">
        <span class="active" @click="addCart" v-if="can_buy == true">加入购物车</span>
        <span class="cancel" v-else>加入购物车</span>
        <span @click="buy" v-if="can_buy == true">立即购买</span>
        <span class="cancel" v-else>立即购买</span>
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
        can_buy:false,
        show_img:false,
        share_img:'',
        share_url:'',
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
        // }
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

          if(localStorage.getItem('token')) {
            let options = {};
              options = {
                title: this.product.prtitle,
                desc: this.product.prdescription,
                imgUrl: this.product.prmainpic,
                link: location.href.split('#')[0] + '?tlpid=' + this.$route.query.tlpid
              };
            axios.get(api.secret_usid + '?token=' + localStorage.getItem('token')).then(res => {
              if(res.data.status == 200) {
                options.link += '&secret_usid=' + res.data.data.secret_usid;
                this.share_url = options.link;
                console.log(this.share_url)
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
      background:linear-gradient(312deg,@mainColor 0%,@subColor 100%);
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
      padding: 25px 0 15px 30px;
      box-shadow: 0 3px 6px rgba(0,0,0,0.16);
    }
    .m-marking-price{
      width: 700px;
      span{
        &:first-child{
          color: #C1C1C1;
          font-size: 24px;
        }
      }
    }
    .m-info-list{
      display: flex;
      flex-flow: row;
      align-items: center;
      justify-content: space-between;
      color: #999999;
      padding-right: 25px;
      .m-brand-name {
        font-size: 24px;
        font-weight: bold;
        color: @mainColor;
      }
      .m-more{
        display: inline-block;
        width: 13px;
        height: 19px;
        background: url("/static/images/icon-right.png") no-repeat;
        background-size: 100% 100%;
        margin-left: 10px;
      }
    }
    .m-activity-price{
      color: #E22300;
      font-size: 40px;
      font-weight: 600;
    }
    .m-activity-label{
      display: inline-block;
      width: 90px;
      height: 40px;
      margin-left: 20px;
    }
    .m-product-title-box{
      padding: 20px 0;
      .m-product-title{
        font-size: 28px;
        color: #000000;
        margin-right: 20px;
        text-align: left;
        overflow: hidden; // 超出的文本隐藏
        text-overflow: ellipsis;    // 溢出用省略号显示
        display: -webkit-box; // 将对象作为弹性伸缩盒子模型显示。
        -webkit-box-orient: vertical; // 从上到下垂直排列子元素（设置伸缩盒子的子元素排列方式）
        -webkit-line-clamp: 2; // 这个属性不是css的规范属性，需要组合上面两个属性，表示显示的行数。
      }
      .m-icon-collect{
        display: inline-block;
        width: 75px;
        height: 40px;
      }
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
      padding: 0 0 0 26px;
      /*padding: 26px 0 98px;*/
      background-color: #fff;
      .flex-row(space-between);
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
          width: 210px;
          text-align: center;
          font-size: 30px;
          background:linear-gradient(313deg,@mainColor 0%,@subColor 100%);
          margin: 0;
          &:first-child{
            margin-right: -6px;
          }
          &.active{
            background-color: @mainColor;
            margin-right: -3px;
            /*border-radius: 10px 0 0 10px;*/
          }
          &.cancel{
            background: #a4a4a4;
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
