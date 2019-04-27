<template>
    <div class="m-selected"  @touchmove="touchMove">
      <!--<mt-loadmore :top-method="loadTop" ref="loadmore">-->
        <!--搜索-->
<!--        <div class="m-selected-search">-->
<!--          <span class="m-icon-home"></span>-->
<!--          <div class="m-search-input-box" @click="changeRoute('/search')">-->
<!--            <span class="m-icon-search"></span>-->
<!--            <span class="m-search-text">商品搜索</span>-->
<!--          </div>-->
<!--        </div>-->
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
                <img src="/static/images/index/icon-zheng.png" class="m-icon-label">
                <span>正品保证</span>
              </li>
              <li>
                <img src="/static/images/index/icon-zhuan.png" class="m-icon-label">
                <span>专业精选</span>
              </li>
              <li>
                <img src="/static/images/index/icon-tui.png" class="m-icon-label">
                <span>十五天无忧退换</span>
              </li>
            </ul>
          </div>
          <div class="m-selected-label-right" @click="changeRoute('personal/couponCenter')">
<!--            <span class="m-icon-gift"></span>-->
            <span>立即领取</span>
          </div>
        </div>

      <div class="m-selected-one" v-if="activity_img">
        <img :src="activity_img.enpic" @click="goActivity" class="m-activity-img" alt="">
      </div>
        <div class="m-selected-one">
          <!--商品分类-->
          <div class="m-scroll " v-if="icon_list">
            <ul class="m-equipment-icon-ul">
              <li v-for="(item,index) in icon_list" @click="changeRoute('equipment/detail',item)">
                <img :src="item.pcpic" alt="">
                <span class="m-name">{{item.pcname}}</span>
              </li>
            </ul>
          </div>
        </div>

      <div class="m-selected-activity">
        <div class="m-row" @click="changeRoute('/activity')">
         <div>
           <img src="/static/images/index/icon-limit.png" class="m-img-limit" alt="">
           <p class="m-time-box">
             <img src="/static/images/index/icon-time.png" class="m-icon-time" alt="">
             <span>12:23:30</span>
           </p>
         </div>
          <div>
            <h3 class="m-limit-title">商品名称商品名称商品名称…</h3>
            <p>
              <span class="m-limit-price">¥123</span>
              <s class="m-underline">¥123</s>
            </p>
          </div>
          <img src="" class="m-product-img" alt="">
        </div>
        <div class="m-row">
          <div class="m-col">
            <h3 class="m-activity-name">拼团竞猜</h3>
            <div class="m-activity-box">
              <div>
                <p class="m-red">¥999</p>
                <p><s class="m-underline">¥123</s></p>
              </div>
              <img src="" class="m-product-img" alt="">
            </div>
          </div>
          <div class="m-col">
            <h3 class="m-activity-name">拼团竞猜</h3>
            <div class="m-activity-box">
              <div>
                <p class="m-red">¥999</p>
                <p><s class="m-underline">¥123</s></p>
              </div>
              <img src="" class="m-product-img" alt="">
            </div>
          </div>
        </div>
      </div>
<!--        <div class="m-selected-one">-->

          <m-circle :index="index" v-for="(item,index) in news_list"  :key="index" :circle="item" @followClick="followClick" @likeClick="likeClick" @clickCollect="clickCollect"></m-circle>
<!--        </div>-->
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
  import mCircle from '../../../components/common/circle';
  import { Toast} from 'mint-ui';
    export default {
      name: 'SelectedIndex',
      data() {
        return {
          swipe_list:null,
          hot_list:null,
          news_list: [],
          icon_list:null,
          page_info:{
            page_num :1,
            page_size:6
          },
          isScroll: true,
          total_count: 0,
          bottom_show: false,
          activity_img:null
        }
      },
      mixins: [wxapi],
      components: { product,bottomLine,mCircle},
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
        this.getCategory();
        this.getImg();
        this.getNews();
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
        goActivity(){
          window.location.href = this.activity_img.contentlink;
        },
        /*获取轮播图*/
        getSwipe(){
          axios.get(api.list_banner_index).then(res => {
            if(res.data.status == 200){
              this.swipe_list = res.data.data;
            }
          })
        },
        //获取首页活动图
        getImg(){
          this.$http.get(api.get_entry).then(res => {
            if(res.data.status == 200){
              this.activity_img = res.data.data;
            }
          })
        },
        //获取装备信息
        getCategory(){
          axios.get(api.category_list).then(res => {
            if(res.data.status == 200){
              this.icon_list = [].concat(res.data.data);
            }
          })
        },
        /*获取资讯列表*/
        getNews() {
          axios.get(api.get_all_news,{
            params:{
              token:localStorage.getItem('token'),
              page_num:this.page_info.page_num,
              page_size: this.page_info.page_size,
              nestatus:'usual',
              kw:this.$route.query.kw,
              itid:'index'
            }
          }).then(res => {
            if(res.data.status == 200){
              this.isScroll =true;
              if(res.data.data.length >0){
                for(let i in res.data.data){
                  if(res.data.data[i].netext)
                    res.data.data[i].netext = res.data.data[i].netext.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>').replace(/\s/g, '&nbsp;')
                }
                if(this.page_info.page_num >1){
                  this.news_list =  this.news_list.concat(res.data.data);
                }else{
                  this.news_list = res.data.data;
                }
                this.page_info.page_num = this.page_info.page_num + 1;
                this.total_count = res.data.total_count;
              }else{
                this.news_list = null;
                this.page_info.page_num = 1;
                this.total_count = 0;
              }
            }
          })
        },
        /*点赞*/
        likeClick(i){
          // if(!localStorage.getItem('token')){
          //   Toast('请登录后再试');
          //   let url = location.href.split('#')[0] + '?neid=' + this.news_list[i].neid
          //   localStorage.setItem('login_to',url);
          //   this.$router.push('/login');
          //   return false;
          // }
          axios.post(api.favorite_news + '?token='+localStorage.getItem('token'),{
            neid:this.news_list[i].neid,
            tftype:1
          }).then(res => {
            if(res.data.status == 200){
              let arr = [].concat(this.news_list);
              if(arr[i].is_favorite){
                arr[i].favoritnumber = arr[i].favoritnumber-1;
              }else{
                arr[i].favoritnumber = arr[i].favoritnumber+1;
              }
              arr[i].is_favorite = !arr[i].is_favorite;
              this.news_list = [].concat(arr);
            }
          })
        },
        //  收藏
        clickCollect(index){
          this.$http.post(api.collection_collect+'?token=' +localStorage.getItem('token'),{
            uclcollection:this.news_list[index].neid,
            uclcotype:1
          }).then(res => {
            if(res.data.status == 200){
              Toast(
                {
                  message: res.data.message,
                  duration: 500
                });
              let arr = [].concat(this.news_list)
              arr[index].collected = !arr[index].collected;
              // arr.splice(index,1);
              this.news_list = [].concat(arr)
            }
          })
        },
        //  关注
        followClick(index){
          this.$http.post(api.collection_collect+'?token=' +localStorage.getItem('token'),{
            uclcollection:this.news_list[index].neid,
            uclcotype:2
          }).then(res => {
            if(res.data.status == 200){
              Toast(
                {
                  message: res.data.message,
                  duration: 500
                });
              let arr = [].concat(this.news_list)
              arr[index].follow = !arr[index].follow;
              this.news_list = [].concat(arr)
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
              if(this.news_list.length == this.total_count){
                this.bottom_show = true;
              }else{
                    this.getNews();
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
    width: 750px;
    padding: 30px 33px;
    margin: 20px auto;
    height: 60px;
    /*border-radius: 50px;*/
    /*box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);*/
    box-sizing: border-box;
    .flex-row(space-between);
    color: #000;
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
        color: #666666;
        li{
          margin-right: 20px;
        }
        .m-icon-label{
          display: inline-block;
          width: 20px;
          height: 20px;
          margin-right: 10px;
        }
      }
    }
    .m-selected-label-right{
      width: 160px;
      height: 50px;
      /*border-radius: 50px;*/
      /*box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);*/
      background:linear-gradient(270deg,@mainColor 0%,@subColor 100%);
      font-size: 28px;
      color: #fff;
      line-height: 50px;
      text-align: center;
      font-weight: 600;
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
    padding: 0 33px ;
    .m-activity-img{
      display: block;
      width: 684px;
      height: 150px;
      background-color: #edb3b1;
    }
  }
  .m-equipment-icon-ul{
    .flex-row(flex-start);
    margin-top: 20px;
    li{
      /*margin-right: 10px;*/
      font-size: 21px;
      line-height: 24px;
      letter-spacing: -0.4px;
      position: relative;
      width: 120px;
      /*height: 180px;*/
      box-shadow: none;
      margin: 0 15px 10px 0;
      .flex-col(center);
      img{
        display: block;
        width: 80px;
        height: 80px;
        /*box-shadow:5px 5px 6px rgba(0,0,0,0.16);*/
      }
      .m-name{
        display: block;
        width: 120px;
        text-align: center;
      }
    }
  }
  .m-selected-activity{
    padding: 0 40px;
    .m-row{
      .flex-row(space-between);
      border-bottom: 1px solid #f4f4f4;
      text-align: left;
      .m-img-limit{
        display: block;
        width: 148px;
        height: 36px;
        margin-bottom: 18px;
      }
      .m-time-box{
        color: #fff;
        .flex-row(center);
        font-size: 20px;
        background-color: @mainColor;
        margin: 0 10px  18px 0;
      }
      .m-icon-time{
        display: inline-block;
        width: 20px;
        height: 20px;
        margin-right: 10px;

      }
      .m-limit-title{
        width: 302px;
        height: 33px;
        line-height: 33px;
        overflow: hidden; // 超出的文本隐藏
        text-overflow: ellipsis;    // 溢出用省略号显示
        white-space:nowrap;
        font-weight: 400;
        margin-bottom: 6px;
      }
      .m-limit-price{
        font-weight: 600;
        font-size: 32px;
        margin-right: 15px;
      }
      .m-underline{
        color: #B4B4B4;
        font-size: 20px;
      }
      .m-product-img{
        display: block;
        width: 180px;
        height: 120px;
        margin-left: 20px;
      }
      .m-col{
        width: 49%;
        padding: 23px 0 10px ;
        &:first-child{
          border-right: 1px solid #f4f4f4;
        }
        .m-activity-name{
          font-size: 32px;
          font-weight: 600;
        }
        .m-activity-box{
          .flex-row(space-between,flex-end);
          .m-red{
            color: #E22300;
            font-size: 32px;
            font-weight: 600;
            margin-bottom: 20px;
          }
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
    white-space:nowrap;
  }
}


</style>
