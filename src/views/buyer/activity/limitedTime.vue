<template>
  <div class="m-limitedTime" v-if="brand_info" @touchmove="touchMove">
    <div class="m-brand-info" >
      <img :src="brand_info.tlatoppic" class="m-brand-img" alt="">
      <span class="m-icon-bg"></span>
    </div>
    <div class="m-limitedTime-title">
      <p>限时特惠</p>
      <p class="m-time">活动时间：{{brand_info.tlastarttime}} - {{brand_info.tlaendtime}}</p>
    </div>
<!--    <nav-list class="m-width" :navlist="nav_list" @navClick="navClick"></nav-list>-->
    <div class="m-scroll">
      <ul class="m-nav-list m-width" >
        <template v-for="(item,index) in nav_list">
          <li :class="item.active?'active':''" @click="navClick(index)">{{item.tlaname}}
          </li>
        </template>
      </ul>
    </div>


    <p class="m-no-data" v-if="product_list && product_list.length == 0">暂无数据</p>
    <product :list="product_list" :isAct="true" :limited="true" v-else></product>

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
        total_count: 0
      }
    },
    components:{ navList, product, bottomLine },
    mounted() {
      common.changeTitle('限时特惠');
      this.getNav();
      // this.getProduct();
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
              this.shareList(1);
              clearInterval(time);
            }
          }, 300);
        }
      }
    },
    methods: {
      // 分享商品
      shareList(val) {
        if(common.isWeixin()) {
          if(localStorage.getItem('token')) {
            let options = {};
            let title = '',id = '';
            for(let i in this.nav_list){
              if(this.nav_list[i].active){
                title = this.nav_list[i].tlaname,
                  id = this.nav_list[i].tlaid;
              }
            }
            options = {
              title: title,
              desc: `活动时间：${this.brand_info.tlastarttime} - ${this.brand_info.tlaendtime}`,
              imgUrl: this.brand_info.tlatoppic,
              link: window.location.href.split('#')[0] + '?tlaid=' + id
            };
            axios.get(api.secret_usid + '?token=' + localStorage.getItem('token')).then(res => {
              if(res.data.status == 200) {
                options.link += '&secret_usid=' + res.data.data.secret_usid
                console.log(options.link)
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
            // Toast('请登录后再试');
          }
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
              for(let i=0;i<this.nav_list.length;i++){
                if(this.nav_list[i].active){
                  if(i != 0){
                    this.getProduct(this.nav_list[i].params + (this.nav_list[i].desc_asc?'|asc':'|desc'));
                  }else{
                    this.getProduct()
                  }
                }
              }
            }
          }
        }
      },
      //  导航点击
      navClick(index){
        this.page_info.page_num = 1;
        this.total_count= 0;
        this.bottom_show = false;
        let arr = [].concat(this.nav_list);
        for(let i=0;i<arr.length;i++){
          arr[i].active = false;
        }
        arr[index].active = true;

          this.getProduct(arr[index].tlaid);


          this.brand_info = arr[index];
        this.nav_list = [].concat(arr);
        this.shareList(1);

      },
      /*获取商品*/
      getProduct(id){
        let start = this.page_info.page_num;
        axios.get(api.timelimited_list_product,{
          params:{
            tlaid:id,
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
              console.log(start)
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
          }
        },error => {
          Toast({ message: error.data.message,duration:1000, className: 'm-toast-fail' });
        })
      },
      //获取所有限时活动
      getNav(){
        axios.get(api.timelimited_list_activity).then(res => {
          if(res.data.status == 200){
            this.nav_list = res.data.data;
            for(let i in this.nav_list){
              this.nav_list[i].active = false;
            }

            let _index  =0;
            if(this.$route.query.tlaid){
              for(let i in this.nav_list){
                if(this.nav_list[i].tlaid == this.$route.query.tlaid){
                  _index = i;
                  break;
                }
              }
            }
            this.nav_list[_index].active = true;

            this.brand_info = this.nav_list[_index];
            this.getProduct(this.nav_list[_index].tlaid);
          }
        })
      }

    },
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  @import "../../../common/css/index";
  .m-limitedTime{
    .m-brand-info{
      height:440px;
      width: 100%;
      position: relative;
      /*margin-bottom: 18px;*/
      .m-brand-img{
        display: block;
        width: 100%;
        height: 440px;
        background-color: #9fd0bf;
      }
      .m-icon-bg{
        position: absolute;
        bottom: -3px;
        left: 0;
        width: 100%;
        height: 67px;
        background: url("/static/images/icon-bg.png") no-repeat;
        background-size: 100% 100%;
      }
    }
    .m-width {
      /*width: 600px;*/
      /*padding: 0 75px;*/
      box-shadow: 0 5px 6px rgba(0,0,0,0.16);
      margin-bottom: 40px;
    }
    .m-limitedTime-title{
      font-size: 30px;
      line-height: 42px;
      text-align: left;
      padding-left: 47px;
      p{
        margin-bottom: 14px;
        &.m-time{
          font-size: 24px;
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
