<template>
  <div class="m-limitedTime"  @touchmove="touchMove">

    <div class="m-limit-title">
      <span>{{tlaname}}</span>
      <div class="m-flex-end">
        <span class="m-active" v-if="show_time">距离{{status}}</span>
        <span class="m-active" v-else>已结束</span>
        <span class="m-activity-time" v-if="show_time"><img src="/static/images/index/icon-time.png" class="m-icon-time" alt="">{{show_time}}</span>
      </div>
    </div>
    <product :list="product_list" :isAct="true" :limited="true" ></product>

    <bottom-line v-if="bottom_show"></bottom-line>
  </div>
</template>

<script>
  import navList from '../../../components/common/navlist';
  import product from '../components/product';
  import common from "../../../common/js/common";
  import axios from 'axios';
  import api from '../../../api/api'
  import {Toast} from 'mint-ui';
  import bottomLine from '../../../components/common/bottomLine';
  import wx from 'weixin-js-sdk';
  import wxapi from '../../../common/js/mixins';
  export default {
    data() {
      return{
        nav_list: [
        ],
        brand_info: null,
        product_list: null,
        bottom_show: false,
        page_info: { page_num: 1, page_size: 6 },
        isScroll: true,
        total_count: 0,
        timer:'',
        show_time:'',
        tlaname:'',
        tlastarttime:'',
        tlaendtime:'',
        tlatoppic:'',
        status:'',
        endDate:''

      }
    },
    components:{ navList, product, bottomLine },
    mounted() {
      common.changeTitle('限时特惠');
      this.getProduct();
      this.timeOut();
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
              this.shareList(1);
              clearInterval(time);
            }
          }, 300);
        // }
      }
    },
    methods: {
      // 分享商品
      shareList(val) {
          if(localStorage.getItem('token')) {
            let options = {};
            let title = '',id = '';

            id = this.$route.query.tlaid;
            options = {
              title: this.tlaname,
              desc: `活动时间：${this.tlastarttime} - ${this.tlaendtime}`,
              imgUrl: this.tlatoppic,
              link: window.location.href.split('#')[0] + '?tlaid=' + id
            };

            axios.get(api.secret_usid + '?token=' + localStorage.getItem('token')).then(res => {
              if(res.data.status == 200) {
                options.link += '&secret_usid=' + res.data.data.secret_usid

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
      //滚动加载更多
      touchMove(e){
        let scrollTop = common.getScrollTop();
        let scrollHeight = common.getScrollHeight();
        let ClientHeight = common.getClientHeight();
        if (scrollTop + ClientHeight  >= scrollHeight -10) {
          if(this.isScroll){
            this.isScroll = false;
            if(this.product_list.length == this.total_count){
              this.bottom_show = true;
            }else{
                this.getProduct()
            }
          }
        }
      },
      /*获取商品*/
      getProduct(){
        let start = this.page_info.page_num;
        axios.get(api.timelimited_list_product,{
          params:{
            tlaid:this.$route.query.tlaid,
            page_size:this.page_info.page_size,
            page_num:start,
            token:localStorage.getItem('token')
          }
        }).then(res => {
          if(res.data.status == 200){

            if(res.data.data.length >0){
              this.page_info.page_num = this.page_info.page_num +1;
            }else{
              this.page_info.page_num = 1;
              this.total_count= 0;
              if(start == 1){
                this.product_list = res.data.data;
              }
              return false;
            }
            if(start >1){
              this.product_list = this.product_list.concat(res.data.data);
            }else{
              this.product_list = res.data.data;
            }
            this.isScroll = true;
            this.total_count = res.data.total_count;

            this.tlaname = res.data.tla.tlaname;
            this.tlastarttime = res.data.tla.tlatlastarttime;
            this.tlaendtime = res.data.tla.tlaendtime;
            // this.tlatoppic = this.product_list[0].tlatoppic;
            if(res.data.tla.duration_start){
              this.endDate = res.data.tla.tlastarttime;
              this.status = '开始'
            }else if(res.data.tla.duration_end){
              this.endDate = res.data.tla.tlaendtime;
              this.status = '结束'
            }
            this.timeOut();
          }
        },error => {
          Toast({ message: error.data.message,duration:1000, className: 'm-toast-fail' });
        })
      },
      // 倒计时
      timeOut() {

        let that = this;


          if(this.endDate){
            if(this.timer){
              clearInterval(this.timer);
            }
            let endDate;
            endDate = new Date(this.endDate);
            this.timer = setInterval(function () {
              let now = new Date();
              let leftTime = endDate.getTime()-now.getTime();
              let dd = parseInt(leftTime / 1000 / 60 / 60 / 24, 10);//计算剩余的天数
              let hh = parseInt(leftTime / 1000 / 60 / 60 % 24, 10);//计算剩余的小时数
              let mm = parseInt(leftTime / 1000 / 60 % 60, 10);//计算剩余的分钟数
              let ss = parseInt(leftTime / 1000 % 60, 10);//计算剩余的秒数
              dd = that.checkTime(dd);
              hh = that.checkTime(hh);
              mm = that.checkTime(mm);
              ss = that.checkTime(ss);//小于10的话加0
              let str =  `${dd}天${hh}:${mm}:${ss}`;
              if(dd == '00' && hh == '00' && mm== '00' && ss =='00'){
                  that.show_time = '';
                  clearInterval(that.timer);
                  that.timeOut();
              }else{
                that.show_time = str;
              }
            },1000)
          }


      },
      checkTime(i) {
        if (i < 10) {
          i = "0" + i;
        }
        return i;
      }

    },
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  @import "../../../common/css/index";
  .m-limitedTime{
    .m-limit-title{
      .flex-row(space-between);
      padding: 20px 0 20px 20px;
      border-bottom: 1px solid #F2F2F2;
      font-weight: 600;
      font-size: 28px;
      .m-active{
        color: @mainColor;
        font-size: 24px;
        font-weight: 400;
        margin-right: 20px;
      }
      .m-activity-time{
        color: #fff;
        padding: 0 15px;
        background:linear-gradient(270deg,@mainColor 0%,@subColor 100%);
        font-size: 20px;
        .flex-row(center);
        .m-icon-time{
          display: inline-block;
          width: 20px;
          height: 20px;
          margin-right: 10px;
        }
      }
    }
    .m-brand-text{
      padding: 0 36px;
      text-align: left;
      .m-normal{
        height: 64px;
        line-height: 32px;
        overflow: hidden;
        text-indent: 2em;
        width: 676px;
        display:block;
        word-break: break-all;
        word-wrap: break-word;
      }
      .m-fold{
        height: auto;
      }
      .m-up-fold{
        text-align: right;
        padding: 19px 160px 34px;
        font-size: 22px;
        color: #999;
        .m-icon-unfold{
          display: inline-block;
          width: 22px;
          height: 10px;
          background: url("/static/images/icon-brand-unfold.png") no-repeat;
          background-size: 100% 100%;
          margin-left: 10px;
          vertical-align: middle;
        }
        .m-icon-packup{
          display: inline-block;
          width: 22px;
          height: 10px;
          background: url("/static/images/icon-packup.png") no-repeat;
          background-size: 100% 100%;
          margin-left: 10px;
          vertical-align: middle;
        }
      }
    }
    .m-scroll{
      overflow-y: hidden;

    }
    .m-nav-list{
      .flex-row(flex-start);
      flex-wrap: nowrap;
      height: auto ;
      box-shadow: 0 3px 6px rgba(0,0,0,0.16);
      /*padding: 6px 10px;*/
      overflow-x: scroll;
      overflow-y: hidden;
      width: 140%;
      li{
        margin-right: 20px;
      }
    }
  }
</style>
