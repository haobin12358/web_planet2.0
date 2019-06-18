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
    <!--商品详情的文字信息-->
    <div class="m-detail-text">

      <div class="m-flex-between">
        <div>
          <div class="m-flex-between">
            <p class="m-flex-start">

              <span class="m-ya">押金<span class="m-low">(最低价)</span></span>
              <span class="m-activity-price" v-if="product.mbadeposit">￥{{product.mbadeposit | money}}</span>
            </p>
            <p class="m-flex-start" v-if="product.currentprice != null">
              <span class="m-red">当前</span>
              <span class="m-activity-price m-red" >￥{{product.currentprice | money}}</span>
            </p>
          </div>
          <p class=" m-flex-between">
            <span>可购价：￥{{product.purchaseprice}}</span>
          </p>
          <p class="m-marking-price m-flex-between">
            <span>价格：<s>￥{{product.prprice}}</s></span>
            <span>市场价：<s>￥{{product.prlineprice  }}</s></span>
          </p>
        </div>
      </div>
      <div class="m-flex-between m-product-title-box">
        <span class="m-product-title">{{product.prtitle}}</span>
        <!--        <img src="/static/images/product/icon-collect-active.png" v-if="product.collected" @click="clickCollect" class="m-icon-collect" alt="">-->
        <!--        <img src="/static/images/product/icon-product-collect.png" v-else @click="clickCollect" class="m-icon-collect" alt="">-->
      </div>
      <div class="m-info-list">
        <span>快递：{{product.mbafreight }} 元</span>
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
          <span v-for="(item, index) in select_value.skuattritedetail">{{product.prattribute[index]}} <span v-if="item">:</span> {{item}} </span>
        </template>
        <template v-else>
          <span v-for="item in product.tcattribute">{{item}} </span>
        </template>
      </div>
      <img class="m-right-img" src="/static/images/icon-right.png" alt="">
    </div>

    <div class="m-text-row m-sku-row" @click="changeModal('show_rule', true)">
      <div class="m-text-courier ">规则</div>
      <div class="m-group-rule m-text-description">{{product.rules}}</div>
      <span class="m-right-img"></span>
    </div>
    <div class="m-text-row m-sku-row" v-if="product.records && product.records.length > 0">
      <div class="m-text-courier ">拆盒记录</div>
      <div class="m-record m-text-description">
        <ul>
          <li v-for="(item,index) in product.records">
            <img :src="item.usheader" class="m-record-head" alt="">
            <span>{{item.record_str}}</span>
          </li>
        </ul>
<!--        <span v-else>暂无分享记录</span>-->
      </div>
      <span></span>
    </div>
    <img class="m-invite-course" src="/static/images/invite.png" v-if="show_invite" @click="show_invite = false">
    <div class="m-detail-img-box">
      <img class="m-detail-img" v-for="item in product.prdesc" :src="item" alt="">
    </div>

    <div class="m-product-detail-foot">
      <template v-if="!product.trade">
        <div class="m-product-detail-btn" v-if="product.topaydeposit">
          <span @click="nowBuy" >支付押金</span>
        </div>
        <div class="m-product-detail-btn m-share" v-else @click="shareProduct">
          <span class="m-flex-center"><img src="/static/images/newActivity/icon-activity-share.png" class="m-icon-share" alt=""><b>邀请好友帮拆礼盒</b></span>
        </div>
      </template>
      <template v-else>
        <div class="m-share-text" v-if=" !product.lowest ">再努力一下获取更多优惠</div>
        <div class="m-share-text" v-else="product.lowest ">恭喜已获得最高优惠</div>
        <div class="m-product-detail-btn m-two">
          <span @click="shareProduct" v-if="!product.lowest">分享帮拆</span>
          <span class="cancel" v-else>分享帮拆</span>
          <span class="cancel" v-if="!product.trade || product.mbjstatus == 10">支付差价</span>
          <span @click="payChange" v-else-if="product.lowest">立即下单</span>
          <span @click="payChange" v-else>支付差价</span>
        </div>
      </template>

    </div>
   ]
    <div class="m-modal-img" v-if="show_img">
      <div class="m-modal-state">
        <span class="m-close" @click="changeModal('show_img',false)"> X</span>
        <img :src="share_img" class="m-share-img" alt="">
      </div>
    </div>
    <div class="m-modal-img" v-if="show_rule">
      <div class="m-modal-state">
        <span class="m-close" @click="changeModal('show_rule',false)"> X</span>
        <div class="m-group-rule">
          {{product.rules}}
        </div>
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
        show_rule:false,
        num_disable:true,
        number:null,
        digits:null
      }
    },
    mixins: [wxapi],
    components: { sku },
    beforeRouteLeave (to, from, next) {
      // if(to.path == '/activity'  ){
      //   this.$store.state.scrollTop = 0;
      //   this.$store.state.isChange = false;
      // }
      next();
    },
    mounted() {
      common.changeTitle('活动商品详情');
      this.getProductDetail();              // 获取商品详情
      wxapi.wxRegister(location.href.split('#')[0]);
      localStorage.removeItem('share');
      localStorage.removeItem('url');
      localStorage.removeItem('login_to');
      // if(common.isWeixin()) {
      // if(localStorage.getItem('token')) {
      //   // 倒计时
      //   const TIME_COUNT = 1;
      //   let count = TIME_COUNT;
      //   let time = setInterval(() => {
      //     if(count > 0 && count <= TIME_COUNT) {
      //       count --;
      //     }else {
      //       this.shareProduct(1);
      //       clearInterval(time);
      //     }
      //   }, 300);
      //   // }
      // }
      if(this.$route.query.omid){
        this.num_disable = false;
      }
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
            title: '您的好友邀请您帮忙拆盒子',
            desc: this.product.prdescription,
            imgUrl: this.product.prmainpic,
            link: location.href.split('#')[0] + '?mbjid=' + this.$route.query.mbjid
          };
          axios.get(api.secret_usid + '?token=' + localStorage.getItem('token')).then(res => {
            if(res.data.status == 200) {
              options.link += '&secret_usid=' + res.data.data.secret_usid;
              this.share_url = options.link;
              console.log(this.share_url)
            }
          });
          this.show_invite = true;
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
          localStorage.setItem('login_to',window.location.href.split('#')[0] + '?mbjid=' +  this.$route.query.mbjid);
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
        let params ;
        if(this.$route.query.mbaid){
          params = {
            token: localStorage.getItem('token'),
            mbaid: this.$route.query.mbaid
          };
        }else if(this.$route.query.mbjid){
          params = {
            token: localStorage.getItem('token'),
            mbjid: this.$route.query.mbjid
          };
        }
        axios.get(api.magicbox_get, { params: params }).then(res => {
          if(res.data.status == 200){
            console.log(res.data.data);
            this.product = res.data.data;
            //
            // this.can_buy = this.nowInDateBetwen(this.product.tlastarttime,this.product.tlaendtime);
          }
        });

      },
      // sku确定
      sureClick(item, num) {
        this.canums = num;
        this.select_value = item;
        if(this.cart_buy == 'buy') {
          this.nowBuy();
          this.cart_buy = null;
        }else   if(this.cart_buy == 'cart'){
          this.postCart();
          this.cart_buy = null;
        }
        this.changeModal('show_sku', false);
      },

      payChange(){
        this.select_value = '';
        for(let i in this.product.skus){
          if(this.product.skus[i].mbsid == this.product.selectedsku){
            this.select_value = this.product.skus[i];
          }
        }
        this.buy();
      },
      nowBuy(){

        if(this.select_value){
          console.log(this.select_value);
          let _params = {
            mbaid: this.product.mbaid,
            mbsid: this.select_value.mbsid,
            omclient: 0,
          }
          axios.post(api.magicbox_join + "?token=" + localStorage.getItem('token'), _params).then(res => {
            if(res.data.status == 200) {
                this.wxPay(res.data.data.args,res.data.data.omid);
                localStorage.removeItem('product');
            }
          });
        }
        else {
            this.changeModal('show_sku', true);
            this.cart_buy = 'buy';

        }

      },
      // 调起微信支付
      wxPay(data,omid) {
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
              sessionStorage.setItem('use', 'used');

              if(res.err_msg == "get_brand_wcpay_request:ok" ){             // 支付成功
                  // that.$router.push('/personal/myWallet');
                  // let id = '';
                  // for(let j = 0; j < that.product_info[0].cart.length; j ++) {
                  //   if(that.product_info[0].cart[j].contentid && that.product_info[0].cart[j].contentid != ''){
                  //     id = that.product_info[0].cart[j].contentid;
                  //   }
                  // }
                  that.$router.push({path:'/magicList',query:{}});
              }else if(res.err_msg == "get_brand_wcpay_request:cancel" ){   // 支付过程中用户取消
                Toast('支付已取消');
                that.$router.push({path:'/activity',query:{actype:2}})
              }else if(res.err_msg == "get_brand_wcpay_request:fail" ){     // 支付失败
                Toast('支付失败');
                that.$router.push({path:'/activity',query:{actype:2}})
              }
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
      // 立即下单
      buy() {
        if(this.select_value) {
          let product = {};
          product.pb = this.product.brand;
          product.cart = [];
          let _from = '';
          if(this.$route.query.mbaid){
            _from = 'mbaid';
          }else if(this.$route.query.mbjid){
            _from = 'mbjid';
          }
          product.cart.push({ product: { prtitle: this.product.tctitle }, sku: this.select_value, canums: "1", prid: this.product.prid,cafrom:4,contentid: this.$route.query.mbjid });
          let arr = [];
          arr.push(product);
          if(localStorage.getItem('token')) {
            this.$router.push({ path: '/submitOrder', query: { product: JSON.stringify(arr),mbjid:this.$route.query.mbjid, from: _from,spreadprice:this.product.spreadprice}});
          }else {
            let url
            // url = window.location.href.split('#')[0] + '?mbjid=' + this.$route.query.mbjid
            localStorage.setItem('login_to',url)
            // this.$router.push('/login');
            this.$store.state.show_login = true;
          }
        }else {
          this.changeModal('show_sku', true);
          this.cart_buy = 'buy';
        }
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
    .m-ya{
      color: #E22300;
      font-size: 32px;
      .m-low{
        font-size: 24px;
      }
    }
    .m-activity-price{
      color: #E22300;
      font-size: 40px;
      font-weight: 600;
      &.m-red{
        color: @mainColor;
      }
    }
    .m-activity-label{
      display: inline-block;
      width: 40px;
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
        &.m-group-rule{
          padding: 0 0 0 0;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
      .m-record{
        max-height: 300px;
        overflow-y: auto;
        ul{
          li{
            margin-bottom: 10px;
            .flex-row(flex-start);
          }
        }
        .m-record-head{
          display: inline-block;
          width: 60px;
          height: 60px;
          margin-right: 20px;
        }

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
        display: inline-block;
        width: 150px;
        text-align: left;
      }
      .m-right-img {
        width: 15px;
        height: 24px;
        padding-top: 5px;
      }
    }
    .m-group-box{
      .flex-row(space-between);
      .m-avator-box{
        position: relative;
        height: 60px;
        width: 140px;
        .m-avator{
          position: absolute;
          left: 0;
          top: 0;
          width: 60px;
          height: 60px;
          background-color: #F4F4F4;
          border: 1px solid #c1c1c1;
          border-radius: 50%;
          &:nth-child(3){
            left: 80px;
            /*z-index: 1;*/
          }
          &:nth-child(2){
            left: 40px;
            /*z-index: -1;*/
          }
          &.active{
            border: 1px solid @mainColor;
          }
          img{
            width: 60px;
            height: 60px;
            border-radius: 50%;
            display: inline-block;
          }
        }
      }
      .m-group-result-btn{
        color: #E67E22;
        &.active{
          color: @mainColor;
        }
        .m-red-group{
          color: #E22300;
          font-size: 20px;
        }
      }
      .m-one-num{
        background: #F4F4F4;
        border: 1px solid #c1c1c1;
        border-radius: 50%;
        width: 60px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        color: #C1C1C1;
        font-weight: 600;
        font-size: 28px;
        margin-right: 10px;
        position: relative;
        .m-group-input{
          display: block;
          position: absolute;
          top: 0;
          left: 0;
          width: 60px;
          height: 60px;
          background-color: transparent;
          border: 1px solid transparent;
          color: transparent;
        }
        &.active{
          background: linear-gradient(180deg,@mainColor 0%,@subColor 100%);
          color: #fff;
          border: 1px solid transparent;
        }
      }
      .m-group-btn{
        color: @mainColor;
        display: inline-block;
        width: 150px;
        height: 40px;
        line-height: 40px;
        border: 1px solid @mainColor;
        text-align: center;
        &.cancel{
          color: #999;
          display: inline-block;
          width: 150px;
          height: 40px;
          border: 1px solid #999;
          text-align: center;
        }
        &.m-full{
          background:linear-gradient(270deg,rgba(39,174,96,1) 0%,rgba(106,206,148,1) 100%);
          color: #fff;
          &.cancel{
            background: #C1C1C1;
            border: 1px solid #C1C1C1;
          }
        }
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
      z-index: 10;
      .m-share-text{
        height: 98px;
        line-height: 98px;
        color: @mainColor;
        font-size: 30px;
        font-weight: 500;

      }
      .m-product-detail-btn{
        display: inline-block;
        height: 98px;
        line-height: 98px;
        .m-icon-share{
          display: inline-block;
          width: 40px;
          height: 40px;
          margin-right: 20px;
          vertical-align: middle;
          margin-bottom: 10px;
        }
        span{
          color: #ffffff;
          display: inline-block;
          width: 750px;
          text-align: center;
          font-size: 30px;
          background:linear-gradient(313deg,@mainColor 0%,@subColor 100%);
          margin: 0;
          &.active{
            background-color: @mainColor;
            margin-right: -3px;
            /*border-radius: 10px 0 0 10px;*/
          }
          &.cancel{
            background: #C1C1C1;
          }
        }
        &.m-two{
          span{
            width: 375px;
            &:first-child{
              margin-right: -10px;
            }
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
        .m-group-rule{
          margin: 80px 20px 20px 20px;
          height: 600px;
          overflow-y: scroll;
          text-align: left;
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
</style>
