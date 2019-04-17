<template>
    <div class="m-selected"  @touchmove="touchMove">
      <!--<mt-loadmore :top-method="loadTop" ref="loadmore">-->
        <!--搜索-->
        <div class="m-selected-search">
          <span class="m-icon-home"></span>
          <div class="m-search-input-box" @click="changeRoute('/search')">
            <span class="m-icon-search"></span>
            <span class="m-search-text">商品搜索</span>
          </div>
        </div>
        <!--轮播图-->
        <div class="m-swipe">
          <mt-swipe :auto="3000" v-if="swipe_list">
            <mt-swipe-item v-for="item in swipe_list" :key="item.ibid">
              <img :src="item.ibpic" class="img" @click="changeRoute('/productDetail', item)">
            </mt-swipe-item>
          </mt-swipe>
        </div>
        <!--标签-->
        <div class="m-selected-label">
          <div class="m-selected-label-left">
            <div class="m-selected-label-l">
              <span>100%正品保证</span>
              <span>假一赔十</span>
            </div>
            <ul class="m-selected-label-ul">
              <li>
                <span class="m-icon-label"></span>
                <span>正品保证</span>
              </li>
              <li>
                <span class="m-icon-label"></span>
                <span>专业精选</span>
              </li>
              <li>
                <span class="m-icon-label"></span>
                <span>十五天无忧退换</span>
              </li>
            </ul>
          </div>
          <div class="m-selected-label-right" @click="changeRoute('personal/couponCenter')">
            <span class="m-icon-gift"></span>
            <span>签到有礼</span>
          </div>
        </div>
        <!--场景推荐-->
        <div class="m-selected-one">
          <h3 class="m-selected-title m-flex-between" @click="changeRoute('scene')">
            <span>场景推荐</span>
            <span class="m-scenes-text">Scenes</span>
            <span class="m-selected-title-more">
              <span>查看更多</span>
              <span class="m-icon-more"></span>
            </span>
          </h3>
          <div class="m-scroll">
            <ul class="m-selected-scene-ul">
              <li v-for="(item,index) in scene_list" @click.stop = "sceneClick(item)" >
                <img :src="item.pspic" class="m-selected-scene-img" alt="" >
                <img src="/static/images/icon-hot.png" class="m-hot" v-if="item.countdown" alt="">
                <div class="m-time-box" v-if="item.countdown">
                  <img src="/static/images/icon-time.png" class="m-time" alt="">
                  <span>{{item.hour}}:{{item.min}}:{{item.sec}}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <!--品牌推荐-->
        <div class="m-selected-one">
          <h3 class="m-selected-title m-flex-between">
            <span>品牌推荐</span>
            <span class="m-scenes-text">Brand</span>
            <span class="m-selected-title-more"  @click="changeRoute('brandList')">
              <span>查看更多</span>
              <span class="m-icon-more"></span>
            </span>
          </h3>
          <div class="m-scroll ">
            <ul class="m-selected-brand-ul" v-if="brand_list">
              <li v-for="(item,index) in brand_list" @click="brandProduct(item, index)">
              <!--<li v-for="(item,index) in brand_list" @click="changeRoute('/brandDetail',item)">-->
                <img :src="item.pblogo" :class="item.active?'active':''" class="m-selected-brand-img" alt="" >
              </li>
            </ul>
          </div>
          <div class="m-scroll">
            <ul class="m-selected-brand-product-ul">
              <li v-for="(item,index) in brand_product" @click.stop="productClick(item)">
                <img :src="item.prmainpic" class="m-selected-brand-product-img" alt="" >
                <div class="m-selected-brand-product-text">
                  <h3>
                    <span class="m-brand-name">【{{item.brand.pbname}}】</span>
                    <span>{{item.prtitle}}</span>
                  </h3>
                  <p class="m-flex-between m-ft-18">
                    <span class="money-text m-ft-b">￥{{item.prprice |money}}</span>
                    <s class="money-text m-grey m-ft-18" v-if="item.prlineprice">￥{{item.prlineprice | money}}</s>
                  </p>
                </div>
              </li>
            </ul>
          </div>
          <!--商品分类-->
          <h3 class="m-selected-title m-flex-between">
            <span>商品分类</span>
            <span class="m-selected-title-more"  @click="changeRoute('equipment/detail')">
              <span>查看更多</span>
              <span class="m-icon-more"></span>
            </span>
          </h3>
          <div class="m-scroll " v-if="icon_list">
            <ul class="m-equipment-icon-ul">
              <li v-for="(item,index) in icon_list" @click="changeRoute('equipment/detail',item)">
                <img :src="item.pcpic" alt="">
                <span class="m-name">{{item.pcname}}</span>
              </li>
            </ul>
          </div>
          <div class="m-selected-hot m-flex-start" v-if="hot_list && hot_list.length>0">
            <img class="m-hot-sales" src="/static/images/hot_sales.png">

            <mt-swipe style="height: 100%;background: white;" :auto="3000" v-if="hot_list">
              <mt-swipe-item v-for="item in hot_list" :key="item.prid" @click.native.stop="productClick(item)">
                <img :src="item.prmainpic" style="height: 100%;max-width: 100%;text-align: center;">
              </mt-swipe-item>
            </mt-swipe>

          </div>
        </div>
        <div class="m-selected-one">
          <h3 class="m-selected-title m-flex-between">
            <span>为您精选</span>
            <!--<span class="m-selected-title-more">
              <span>查看更多</span>
              <span class="m-icon-more"></span>
            </span>-->
          </h3>
          <product :list="recommend_for_you_list"></product>
        </div>
      <bottom-line v-if="bottom_show"></bottom-line>
      <!--</mt-loadmore>-->
    </div>

</template>

<script type="text/ecmascript-6">
  import product from '../components/product';
  import common from '../../../common/js/common';
  import axios from 'axios';
  import api from '../../../api/api';
  import wxapi from '../../../common/js/mixins';
  import wx from 'weixin-js-sdk';
  import bottomLine from '../../../components/common/bottomLine';
    export default {
      name: 'SelectedIndex',
      data() {
        return {
          swipe_list:null,
          brand_list:null,
          brand_product:null,
          hot_list:null,
          scene_list:null,
          recommend_for_you_list: [],
          icon_list:null,
          page_info:{
            page_num :1,
            page_size:6
          },
          isScroll: true,
          total_count: 0,
          bottom_show: false,
        }
      },
      mixins: [wxapi],
      components: { product,bottomLine },
      inject:['reload'],
      mounted() {
        common.changeTitle('首页');
        // this.$store.state.show_login = true;
        // 将分享的usid保存
        if(this.$route.query.secret_usid) {
          localStorage.setItem('secret_usid', this.$route.query.secret_usid)
        }
        wxapi.wxRegister(location.href.split('#')[0]);
        // localStorage.removeItem('share');
        // localStorage.removeItem('url');
        if(!localStorage.getItem('token')){
          localStorage.removeItem('is_new');
        }
        if(localStorage.getItem('token')) {
          // 倒计时
          const TIME_COUNT = 1;
          let count = TIME_COUNT;
          let time = setInterval(() => {
            if(count > 0 && count <= TIME_COUNT) {
              count --;
            }else {
              this.shareCode();
              clearInterval(time);
            }
          }, 500);
        }
        if(localStorage.getItem('share') && localStorage.getItem('url') && localStorage.getItem('login_to')) {
          let url = localStorage.getItem('url');
           if(localStorage.getItem('share') == 'fmfpid') {
            let params = url.split('?fmfpid=')[1].split('&secret_usid')[0].split('&which=');
            this.$router.push({ path: '/activityProductDetail', query: { fmfpid: params[0], which: params[1] }})
          }else if(localStorage.getItem('share') == 'tcid') {
            let params = url.split('?tcid=')[1].split('&secret_usid')[0].split('&which=');
            this.$router.push({ path: '/activityProductDetail', query: { tcid: params[0], which: params[1] }})
          }else if(localStorage.getItem('share') == 'neid') {
             let params = url.split('?neid=')[1].split('&secret_usid')[0];
             this.$router.push({ path: '/circle/detail', query: { neid: params }})
           }else if(localStorage.getItem('share') == 'prid') {
             let params;
             if(url.indexOf('&secret_usid') > 0){
               params = url.split('?prid=')[1].split('&secret_usid')[0];
             }else{
               params = url.split('?prid=')[1];
             }
             this.$router.push({ path: '/productDetail', query: { prid: params }})
           }else if(localStorage.getItem('share') == 'tlpid') {
             let params = url.split('?tlpid=')[1].split('&secret_usid')[0];
             this.$router.push({ path: '/limitedProductDetail', query: { tlpid: params[0]}})
           }
        }
      },
      activated() {
        // 倒计时
        const TIME_COUNT = 1;
        let count = TIME_COUNT;
        let time = setInterval(() => {
          if(count > 0 && count <= TIME_COUNT) {
            count --;
          }else {
            if(localStorage.getItem('share') && localStorage.getItem('url')) {
              let url = localStorage.getItem('url');
              if(localStorage.getItem('share') == 'mbjid') {
                let params = url.split('?mbjid=')[1].split('&secret_usid')[0];
                this.$router.push({ path: '/pandora', query: { mbjid: params }})
              }else if(localStorage.getItem('share') == 'fmfpid') {
                let params = url.split('?fmfpid=')[1].split('&secret_usid')[0].split('&which=');
                this.$router.push({ path: '/activityProductDetail', query: { fmfpid: params[0], which: params[1] }})
              }else if(localStorage.getItem('share') == 'tlpid') {
                let params = url.split('?tlpid=')[1].split('&secret_usid')[0];
                this.$router.push({ path: '/limitedProductDetail', query: { tlpid: params[0]}})
              }else if(localStorage.getItem('share') == 'tcid') {
                let params = url.split('?tcid=')[1].split('&secret_usid')[0].split('&which=');
                this.$router.push({ path: '/activityProductDetail', query: { tcid: params[0], which: params[1] }})
              }else if(localStorage.getItem('share') == 'neid') {
                let params = url.split('?neid=')[1].split('&secret_usid')[0];
                this.$router.push({ path: '/circle/detail', query: { neid: params }})
              }else if(localStorage.getItem('share') == 'tlaid') {
                let params = url.split('?tlaid=')[1].split('&secret_usid')[0];
                this.$router.push({ path: '/limitedTime', query: { tlaid: params }})
              }else if(localStorage.getItem('share') == 'prid') {
                let params;
                if(url.indexOf('&secret_usid') > 0){
                   params = url.split('?prid=')[1].split('&secret_usid')[0];
                }else{
                  params = url.split('?prid=')[1];
                }
                this.$router.push({ path: '/productDetail', query: { prid: params }})
              }else if(localStorage.getItem('share') == 'activityId=new') {
                this.$router.push({ path: '/activityProduct', query: { which: 'new' }})
              }else if(localStorage.getItem('share') == 'activityId=try') {
                this.$router.push({ path: '/activityProduct', query: { which: 'try' }})
              }else if(localStorage.getItem('share') == 'activityId=guess') {
                this.$router.push({ path: '/guessProduct', query: { which: 'guess' }})
              }else if(localStorage.getItem('share') == 'uaid') {
                this.$router.push({ path: '/dailyGuess'})
              }else if(localStorage.getItem('share') == 'index') {
                this.$router.push({ path: '/selected'})
              }
            }
            if(localStorage.getItem('href')) {
              // 倒计时
              const TIME_COUNT = 1;
              let count = TIME_COUNT;
              let time = setInterval(() => {
                if(count > 0 && count <= TIME_COUNT) {
                  count --;
                  // alert(localStorage.getItem('href'));
                  location.href = localStorage.getItem('href');
                }else {
                  localStorage.removeItem('href');
                  clearInterval(time);
                }
              }, 500);
            }
            clearInterval(time);
          }
        }, 100);

        this.getSwipe();
        this.getBrand();
        this.getScene();
        this.getCategory();
        if(sessionStorage.getItem('shop')) {
          this.$router.push('/shop');
          sessionStorage.removeItem('shop');
        }
        if(sessionStorage.getItem('new')) {
          localStorage.setItem('toLogin', 'toLogin')
        }
        wxapi.wxRegister(location.href.split('#')[0]);
        if(localStorage.getItem('token')) {
          // 倒计时
          const TIME_COUNT = 1;
          let count = TIME_COUNT;
          let time = setInterval(() => {
            if(count > 0 && count <= TIME_COUNT) {
              count --;
            }else {
              this.shareCode();
              clearInterval(time);
            }
          }, 300);
        }
      },
      methods: {
        // 分享
        shareCode() {
          if(localStorage.getItem('token')) {
            // alert(1);
            let options = {
              title: '大行星',
              desc: '挑你所爱  走你所想  一个有野心的户外平台',
              imgUrl: this.swipe_list[0].ibpic,
              link:  location.href.split('#')[0]+'?page=index'
            };
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

        },
        /*获取轮播图*/
        getSwipe(){
          axios.get(api.list_banner_index).then(res => {
            if(res.data.status == 200){
              this.swipe_list = res.data.data;
            }
          })
        },
        //获取场景
        getScene(){
          axios.get(api.scene_list,{
            params:{
              token:localStorage.getItem('token') || ''
            }
          }).then(res => {
            if(res.data.status == 200){
              this.scene_list = [].concat(res.data.data);
              for(let i = 0; i < this.scene_list.length; i ++) {
                if(this.scene_list[i].countdown) {
                  this.timeOut();       // 倒计时
                }
              }
            }
          })
        },
        /*获取品牌推荐*/
        getBrand(){
          axios.get(api.brand_recommend_index,{
            params:{
              page_num:this.page_info.page_num,
              page_size:this.page_info.page_size
            }
          }).then(res => {
            if(res.data.status == 200){
              this.brand_list = res.data.data.brands;
              // this.brand_product = res.data.data.product;
              this.hot_list = res.data.data.hot;
              this.isScroll = true;
              if(res.data.data.recommend_for_you.length > 0){
                if(this.page_info.page_num == 1){
                  this.recommend_for_you_list = res.data.data.recommend_for_you;
                }else{
                  this.recommend_for_you_list = this.recommend_for_you_list.concat(res.data.data.recommend_for_you);
                }
                this.page_info.page_num = this.page_info.page_num + 1;
              }else if(this.page_info.page_num == 1 && res.data.data.recommend_for_you.length == 0){
                this.recommend_for_you_list = [];
                this.page_info.page_num = 1;
              }
              this.total_count = res.data.total_count;
              this.getBrandProduct();
            }
          })
        },
        /*获取品牌下的推荐商品*/
        getBrandProduct(pbid) {
          if(localStorage.getItem('brandIndex') == null) {
            localStorage.setItem('brandIndex', 0);
          }
          axios.get(api.product_list, { params:
              { pbid: pbid || this.brand_list[localStorage.getItem('brandIndex')].pbid, itid: 'index_brand_product' }}).then(res => {
            if(res.data.status == 200) {
              this.brand_product = res.data.data;
              if(localStorage.getItem('brandIndex')) {
                this.brand_list[localStorage.getItem('brandIndex')].active = true;
              }else {
                this.brand_list[0].active = true;
              }
            }
          })
        },
        // 品牌logo点击效果
        brandProduct(item, index) {
          localStorage.setItem('brandIndex', index);
          if(item.active) {
            // console.log('two');
            this.$router.push({ path: 'brandDetail', query: { pbid: item.pbid, pbname: item.pbname }});
          }else {
            if(index > -1) {
              for(let i in this.brand_list) {
                this.brand_list[i].active = false
              }
              this.brand_list[index].active = true;
              this.brand_list = this.brand_list.concat()
            }
            this.getBrandProduct(item.pbid);
          }
        },
        //获取装备信息
        getCategory(){
          axios.get(api.category_list).then(res => {
            if(res.data.status == 200){
              this.icon_list = [].concat(res.data.data);
            }
          })
        },
        //滚动加载更多
        touchMove(e) {
          let scrollTop = common.getScrollTop();
          let scrollHeight = common.getScrollHeight();
          let ClientHeight = common.getClientHeight();
          if (scrollTop + ClientHeight  >= scrollHeight -10) {
            if(this.isScroll){
              this.isScroll = false;
              console.log(this.recommend_for_you_list.length,this.total_count)
              if(this.recommend_for_you_list.length == this.total_count){
                this.bottom_show = true;
              }else{
                    this.getBrand();
              }
            }
          }
        },
        /*查看更多*/
        changeRoute(v, item) {
          switch(v) {
            case 'equipment/detail':
              if(item){
                this.$router.push({path:v,query:{pcid:item.pcid}});
              }else{
                this.$router.push({path:v});
              }
              break;
            case '/brandDetail':
              this.$router.push({ path: v, query: { pbid: item.pbid,pbname: item.pbname }});
              break;
            case '/productDetail':
              if(item.contentlink) {
                window.location.href = item.contentlink;
              }
              // this.$router.push({ path: v, query: { prid: item.prid }});
              break;
            default:
              this.$router.push({path:v,});
          }
        },
        /*场景点击*/
        sceneClick(item){
          this.$router.push({path:'/scene',query:{ psid:item.psid}})
        },
        /*商品点击*/
        productClick(item){
          if(item.prid){
            this.$router.push({path:'/productDetail',query:{ prid:item.prid}});
          }
        },
        /*下拉刷新*/
        loadTop(){
          this.reload();
        },
        // 倒计时
        timeOut() {
          let arr = [].concat(this.scene_list);

          for(let i in arr) {
            let arr_int = [];
            if(arr[i].countdown) {
              if(arr[i].countdown.substr(0, 1) > -1) {
                arr[i].hour = 0;
                arr[i].min = 0;
                arr[i].sec = 0;
                arr_int = arr[i].countdown.split(':');
                arr[i].hour = arr_int[0];
                arr[i].min = arr_int[1];
                arr[i].sec = arr_int[2];
                let TIME_OUT = Number(arr[i].min) * 60 + Number(arr[i].sec);
                let count = TIME_OUT;
                if(arr[i].time_interVal){
                  clearInterval(arr[i].time_interVal);
                }
                arr[i].time_interVal  = setInterval(() => {
                  if(count > 0 && count <= TIME_OUT) {
                    count --;
                    arr[i].sec --;
                    if(this.scene_list[i].sec < 10 && this.scene_list[i].sec > -1) {
                      arr[i].sec = '0' + arr[i].sec;
                    }
                    if(this.scene_list[i].sec == -1) {
                      arr[i].sec = 59;
                      if(this.scene_list[i].min > 0) {
                        arr[i].min -= 1;
                      }
                      if(this.scene_list[i].min < 10) {
                        if(this.scene_list[i].min !== '00') {
                          arr[i].min = '0' + arr[i].min;
                        }else {
                          arr[i].countdown = null;
                        }
                      }
                    }
                    this.scene_list = [].concat(arr);
                  }else {
                    this.scene_list[i].countdown = null;
                    clearInterval(arr[i].time_interVal);
                  }
                }, 1000);
                console.log(this.scene_list)
              }else {
                this.scene_list[i].countdown = null
              }
            }
          }
        },
      }
    }
</script>
<style lang="less" rel="stylesheet/less" scoped>
  @import "../../../common/css/index";
  @import "../../../common/css/scroll";
.m-selected{
  width: 100%;
  overflow-x: hidden;
  .m-swipe{
    /*padding: 0 33px;*/
    /*margin: auto;*/
  }
  /*.m-selected-scene-ul{*/
    /*li{*/
      /*position: relative;*/
      /*.m-hot{*/
        /*position: absolute;*/
        /*top:-34px;*/
        /*left: -10px;*/
        /*width: 68px;*/
        /*height: 68px;*/
      /*}*/
      /*.m-time-box{*/
        /*position: absolute;*/
        /*bottom: 0;*/
        /*left: 0;*/
        /*text-align: center;*/
        /*width: 100%;*/
        /*height: 33px;*/
        /*line-height: 33px;*/
        /*background-color: #F15A24;*/
        /*color: #fff;*/
        /*font-size: 24px;*/
        /*.m-time{*/
          /*display: inline-block;*/
          /*width: 24px;*/
          /*height: 24px;*/
          /*vertical-align: text-top;*/
        /*}*/
      /*}*/
    /*}*/
  /*}*/
  .m-selected-label{
    width: 615px;
    padding: 15px 33px;
    margin: 20px auto;
    height: 60px;
    border-radius: 50px;
    box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
    background-image: linear-gradient(to right, @subColor, @mainColor);
    .flex-row(space-between);
    .m-selected-label-left{
      text-align: left;
      .m-selected-label-l{
        margin-bottom: 8px;
        span{
          display: inline-block;
          padding: 0 22px;
          font-size: 21px;
          font-weight: bold;
          &:first-child{
            border-right: 1px solid #333333;
            padding-left: 0;
          }
        }
      }
      .m-selected-label-ul{
        .flex-row(flex-start);
        font-size: 18px;
        letter-spacing: -0.4px;
        li{
          margin-right: 20px;
        }
        .m-icon-label{
          display: inline-block;
          width: 20px;
          height: 20px;
          background: url("/static/images/icon-label.png") no-repeat;
          background-size: 100% 100%;
          margin-right: 10px;
        }
      }
    }
    .m-selected-label-right{
      width: 160px;
      height: 50px;
      border-radius: 50px;
      box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
      background-color: #fff;
      font-size: 21px;
      line-height: 50px;
      text-align: center;
      .m-icon-gift{
        display: inline-block;
        width: 27px;
        height: 31px;
        background: url("/static/images/icon-gift.png") no-repeat;
        background-size: 100% 100%;
        vertical-align: text-bottom;
      }
    }
  }
  .m-selected-title{
    font-size: 36px;
    font-weight: bold;
    /*padding: 0 33px;*/
    margin: 40px 33px -20px 33px;
    .m-scenes-text {
      flex: 1;
      text-align: left;
      margin-left: 10px;
      color: #999999;
    }
    .m-selected-title-more{
      font-size: 21px;
      font-weight: normal;
      color: #999999;
      .m-icon-more{
        display: inline-block;
        width: 23px;
        height: 23px;
        background: url("/static/images/icon-more.png") no-repeat;
        background-size: 100% 100%;
        vertical-align: text-top;
      }
    }
  }
  .m-selected-one{
    .m-one-activity{
      padding: 0 33px ;
      &.m-top{
        padding-top: 30px;
      }
      .m-activity-img{
        display: block;
        width: 682px;
        height: 325px;
        background-color: #edb3b1;
        border-radius: 10px;
      }
      .m-activity-ul{
        text-align: left;
        margin: 15px 0;
        .flex-row(space-between);
        li{
          .m-one-activity-img{
            display: block;
            width: 200px;
            height: 200px;
            background-color: #edb3b1;
          }
          .m-one-activity-text{
            width: 200px;
            font-size: 19px;
            margin-top: 10px;
            h3{
              width: 200px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
        }
      }
    }
  }
  .m-equipment-icon-ul{
    .flex-row(flex-start);
    li{
      /*margin-right: 10px;*/
      font-size: 21px;
      line-height: 24px;
      letter-spacing: -0.4px;
      position: relative;
      width: 180px;
      /*height: 180px;*/
      margin-top: 0;
      margin-bottom: 10px;
      box-shadow: none;
      margin-right: 15px;
      img{
        display: block;
        width: 120px;
        height: 120px;
        border-radius: 50%;
        /*box-shadow:5px 5px 6px rgba(0,0,0,0.16);*/
      }
      .m-name{
        display: block;
        width: 120px;
        text-align: center;
      }
    }
  }
  .m-selected-hot{
    background-color: #f1f1f1;
    width: 685px;
    height: 360px;
    border-radius: 10px;
    margin: 30px 32px;
    .m-hot-sales {
      width: 164px;
      height: 360px;
    }
    .m-hot-box{
      width: 160px;
      background-color: #e9e9e9;
      height: 360px;
      font-weight: bold;
      font-size: 30px;
      border-radius: 10px;
      padding:0 10px;
      .m-hot{
        font-size: 58px;
        color: @mainColor;
        margin-top: 120px;
        display: block;
      }
    }
    .m-one-product{
      margin: 20px;
      position: relative;
      width: 160px;
      height: 160px;
      .m-one-product-img{
        display: block;
        width: 160px;
        height: 160px;
        background-color: #fff;
      }
      &.m-l{
        width: 300px;
        height: 335px;
        margin-right: 0;
        .m-one-product-img{
          display: block;
          width: 300px;
          height: 335px;
          background-color: #fff;
        }
        .m-one-product-text{
          h3{
            width: 300px;
          }
        }
      }
      .m-one-product-text{
        position: absolute;
        top: 8px;
        left: 0;
        text-align: left;
        h3{
          width: 160px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
  .money-text {
    width: 240px;
    font-size: 20px;
    padding: 5px;
    overflow: hidden; // 超出的文本隐藏
    text-overflow: ellipsis;    // 溢出用省略号显示
  }
}


</style>
