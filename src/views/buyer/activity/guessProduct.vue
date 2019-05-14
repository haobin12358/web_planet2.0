<template>
  <div class="m-activity-product">
    <div class="m-activity-product-text-box">
      <div class="m-left">{{title}}</div>
      <!--<div class="m-activity-product-text m-ft-24">{{remarks}}</div>-->
    </div>
    <!--内容-->
    <div class="m-product-content">
      <div class="m-product-item" v-for="item in productList" @click="changeRoute('/guessProductDetail', item)">
        <span class="m-down-price" v-if="item.skudiscount">
          直降{{item.skudiscount}}元
        </span>
        <div class="m-product-img" :style="{backgroundImage:'url(' + item.prmainpic +')'}">

        </div>
<!--        <img class="m-product-img" :src="item.prmainpic">-->
        <div class="m-product-name"><span class="m-product-tag">【{{title}}】</span>{{item.prtitle}}</div>
        <div class="m-product-price" v-if="item.prprice"><span class="m-price-time">￥{{item.prprice | money}}</span></div>
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
      if(this.$store.state.scrollTop >0 ||  this.$store.state.isChange){
        for(let a in this.$store.state.all_data){
          this._data[a] = this.$store.state.all_data[a]
        }
        document.documentElement.scrollTop =this.$store.state.scrollTop;
      }else{
        this.getProduct();               // 获取商品
      }

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
    //离开时记录位置
    beforeRouteLeave (to, from, next) {
      if(to.path.indexOf('Detail') > -1){
        this.$store.state.scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        this.$store.state.all_data = this._data;
        this.$store.state.isChange = true;
      }else{
        this.$store.state.scrollTop = 0;
        this.$store.state.isChange = false;
      }
      next();
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
   .m-activity-product-text-box{
     padding: 30px 20px;
     .flex-row(space-between);
     font-size: 28px;
     color: #000;
   }
    .m-product-content {
      padding-left: 20px;
      .flex-row(flex-start);
      flex-wrap: wrap;
      .m-product-item{
        width: 340px;
        margin-right: 20px;
        text-align: left;
        position: relative;
        &:nth-child(even){
          margin-right: 0;
        }
        .m-product-img{
          width: 340px;
          height: 453px;
          display: block;
          overflow:hidden;

          background-position: center center;
          background-repeat: no-repeat;
          -webkit-background-size:cover;
          -moz-background-size:cover;
          background-size:cover;
        }
        .m-product-name{
          font-size: 24px;
          width: 340px;
          overflow: hidden; // 超出的文本隐藏
          text-overflow: ellipsis;    // 溢出用省略号显示
          display: -webkit-box; // 将对象作为弹性伸缩盒子模型显示。
          -webkit-box-orient: vertical; // 从上到下垂直排列子元素（设置伸缩盒子的子元素排列方式）
          -webkit-line-clamp: 2; // 这个属性不是css的规范属性，需要组合上面两个属性，表示显示的行数。
        }
        .m-product-price{
          font-size: 24px;
          font-weight: 600;
        }
        .m-down-price{
          position: absolute;
          top:0;
          left:0;
          width: 84px;
          height: 100px;
          box-sizing: border-box;
          background: url("/static/images/newActivity/down-price.png") no-repeat;
          background-size: 100% 100%;
          color: #fff;
          font-size: 20px;
          padding: 10px 20px;
        }
      }

    }
  }
</style>
