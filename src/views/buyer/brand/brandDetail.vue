<template>
    <div class="m-brandDetail"  @touchmove="touchMove">
      <div class="m-brand-info" :style="{'background':brand_info.pbthemecolor?brand_info.pbthemecolor: (brand_info.pbbackgroud? 'url('+ brand_info.pbbackgroud +') no-repeat': 'url(/static/images/index/brand-top-bg.png) no-repeat'),'backgroundSize':'100% 100%'}" >
        <img :src="brand_info.pblogo" class="m-logo"  alt="">
        <div class="m-info">
          <div class="m-flex-between">
            <span class="m-name">{{brand_info.pbname}}</span>
            <span class="m-btn" @click="changeRoute('/brandInfo')">查看更多</span>
          </div>
          <div class="m-desc">{{brand_info.pbslogan}}</div>
        </div>
      </div>
      <div class="m-swipe-box" v-if="brand_info.brandbanner">
<!--        <div class="m-title">Adidas夏日滑板</div>-->
        <mt-swipe :auto="autoplay">
          <mt-swipe-item v-for="(item,index) in brand_info.brandbanner" :key="item.bbid">
            <img :src="item.bbcontent.content" v-if="item.bbcontent.type == 'image'" class="img" @click="changeRouteImg('/productDetail', item)">
            <div class="m-video-box">
              <img src="/static/images/index/brand-video.png" v-if="autoplay" class="m-icon" alt="">
              <video :src="item.bbcontent.content.video"
                     :poster="item.bbcontent.content.thumbnail"
                     webkit-playsinline="true"
                     playsinline="true"
                     x-webkit-airplay="allow"
                     style="object-fit:fill"
                     loop
                     x5-video-player-type="h5"
                     :id="index"
                     @click="videoClick(index)"
                     v-if="item.bbcontent.type == 'video'"></video>
            </div>
          </mt-swipe-item>
        </mt-swipe>
      </div>
      <div class="m-brand-recommend" v-if="brand_info.new">
        <ul>
          <li class="m-logo-box">
            <img :src="brand_info.pblogo" class="m-logo" alt="">
            <div class="m-name">{{brand_info.pbname}}新品</div>
            <div>为你推荐</div>
          </li>
          <li v-for="(item,index) in brand_info.new" @click.stop="changeProduct(item)">
            <img :src="item.prmainpic" class="m-product" alt="">
            <span class="m-price">¥ {{item.prprice}}</span>
          </li>
        </ul>
      </div>
      <div class="m-dynamic">
        <div v-if="brand_info.brandtweets">
          <div class="m-flex-between">
            <div class="m-one-dynamic">
              <p class="m-title">动态动态</p>
              <img src="" class="m-product" alt="">
            </div>
            <div class="m-one-dynamic">
              <p class="m-title">动态动态</p>
              <img src="" class="m-product" alt="">
            </div>
          </div>
          <div class="m-flex-end">
            <span class="m-grey" @click="changeRoute('/dynamic')">历史动态</span>
            <img src="/static/images/newpersonal/icon-more.png" class="m-icon-more"  @click="changeRoute('/dynamic')" alt="" />
          </div>
        </div>
      </div>
      <div>
        <div class="m-line-title">
          <span class="m-cut-line"></span>
          <span class="m-name">更多·推荐</span>
        </div>
      </div>
      <product :list="product_list"></product>
    </div>
</template>

<script>
  import product from '../components/product';
  import common from '../../../common/js/common';
  import wxapi from '../../../common/js/mixins';
  import wx from 'weixin-js-sdk';
  import { Toast} from 'mint-ui';
    export default {
        name: "brandDetail",
      data(){
          return{
            autoplay:10000,
            swipe_list:[
              {
                ibpic:'',
                ibid:'1'
              },
              {
                ibpic:'',
                ibid:'2'
              }
            ],
            brand_info:{},
            page_info:{
              page_num :1,
              page_size:10
            },
            isScroll: true,
            total_count: 0,
            bottom_show: false,
            product_list:[]
          }
      },
      components: { product},
      mounted() {
        common.changeTitle('品牌详情');
        // this.$store.state.show_login = true;
        // 将分享的usid保存
        if(this.$route.query.secret_usid) {
          localStorage.setItem('secret_usid', this.$route.query.secret_usid)
        }
        wxapi.wxRegister(location.href.split('#')[0]);
        // localStorage.removeItem('share');
        if(!localStorage.getItem('token')){
          localStorage.removeItem('is_new');
        }
        if(this.$store.state.scrollTop >0 ){
          for(let a in this.$store.state.all_data){
            this._data[a] = this.$store.state.all_data[a]
          }
        }else{
          this.getData(this.$route.query.pbid);
          this.getProduct(this.$route.query.pbid);
        }

        // 倒计时
        const TIME_COUNT = 1;
        let count = TIME_COUNT;
        let time = setInterval(() => {
          if(count > 0 && count <= TIME_COUNT) {
            count --;
          }else {
            if(localStorage.getItem('share') && localStorage.getItem('url')) {
              let url = localStorage.getItem('url');
              this.dealUrl(url);
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
        }, 300);


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
      //离开时记录页面滚动位置
      beforeRouteLeave (to, from, next) {
        if(to.path == '/brand/detail'){
          // sessionStorage.setItem('scrollTop',document.documentElement.scrollTop || document.body.scrollTop)
          this.$store.state.scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
          //赋值页面所有的变量值
          this.$store.state.all_data = this._data;
        }else{
          this.$store.state.scrollTop = 0;
        }
        next();
      },
      methods: {
        // 分享
        shareCode() {
          if(localStorage.getItem('token')) {
            // alert(1);
            let options = {
              title: this.brand_info.pbname,
              desc: this.brand_info.pbslogan,
              // imgUrl: this.brand_info.brandbanner[0].ibpic,
              link:  location.href.split('#')[0]+'?pbid=' + this.brand_info.pbid
            };
            this.$http.get(this.$api.secret_usid + '?token=' + localStorage.getItem('token')).then(res => {
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
        //获取品牌详情
        getData(id){
          this.$http.get(this.$api.get_one_brand,{
            params:{
              pbid:id,
              token:localStorage.getItem('token')
            }
          }).then(res => {
            if(res.data.status == 200){

              this.brand_info = res.data.data;
            }
          },error => {
            Toast({ message: error.data.message,duration:1000, className: 'm-toast-fail' });
          })
        },
        /*查看更多*/
        changeRoute(v, item) {
            this.$router.push({path:v,query:{pbid:this.$route.query.pbid}});
        },
        //获取商品列表
        getProduct(id){
          let start = this.page_info.page_num;
          this.$http.get(this.$api.product_list,{
            params:{
              pbid:id,
              page_size:this.page_info.page_size,
              page_num:start,
              token:localStorage.getItem('token'),
              itid:'home_recommend'
            }
          }).then(res => {
            if(res.data.status == 200){
              console.log(res.data.data);
              if(res.data.data.length >0){
                this.page_info.page_num =   this.page_info.page_num +1;
              }else{
                this.product_list = [];
                return false;
              }
              if(start >1){
                this.product_list = this.product_list.concat(res.data.data);
              }else{
                this.product_list = res.data.data;
              }
              this.isScroll = true;
              this.total_count = res.data.total_count;
              this.total_page = res.data.total_page;
            }
          },error => {
            Toast({ message: error.data.message,duration:1000, className: 'm-toast-fail' });
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
              if(this.product_list.length == this.total_count){
                // this.bottom_show = true;
              }else{
                this.getProduct();
              }
            }
          }
        },
        changeProduct(item){
          if(this.gift) {
            this.$router.push({ path: '/gift', query: { prid: item.prid, from: this.gift }});
          }else if(this.limited || item.tlpid) {
            this.$router.push({ path: '/limitedProductDetail', query: { tlpid: item.tlpid }});
          }else{
            this.$router.push({ path: '/productDetail', query: { prid: item.prid }});

          }
        },
        videoClick(v){
          let vdo = document.getElementById(v);
          if(vdo.paused){
            this.autoplay = 0;
            vdo.play();
          }else{
            this.autoplay = 10000;
            vdo.pause();
          }

        }
      }
    }
</script>

<style scoped lang="less">
  @import "../../../common/css/index";
.m-brandDetail{
  .m-brand-info{
    padding: 40px 30px;
    .flex-row(flex-start);
    /*background-color: #0084D6;*/

    .m-logo{
      display: block;
      width: 120px;
      height: 120px;
      box-shadow:0px 3px 30px rgba(0,0,0,0.1);
      margin:0 30px;
      background-color: #ffffff;
    }
    .m-info{
      width: 500px;
      height: 120px;
      color: #fff;
      .flex-col(space-between);
      text-align: left;
      align-items: flex-start;
      .m-name{
        width: 360px;
        font-size: 40px;
        font-weight: 600;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .m-btn{
        font-size: 24px;
        padding: 5px 10px;
        display: inline-block;
        border: 1px solid #fff;
      }
      .m-desc{
        width: 500px;
        /*overflow: hidden;*/
        /*text-overflow: ellipsis;*/
        /*white-space: nowrap;*/
      }
    }
  }
  .m-swipe-box{
    padding:20px 25px;
    .m-title{
      font-size: 36px;
      font-weight: 600;
      text-align: left;
    }

  }
  .m-brand-recommend{
    padding: 15px;
    ul{
      background-color: #F2F2F2;
      padding: 10px 0 0 10px;
      .flex-row(flex-start);
      flex-wrap: wrap;
      li{
        width: 225px;
        height: 225px;
        margin: 0 10px 10px 0;
        text-align: left;
        position: relative;
        &.m-logo-box{
          padding: 10px;
          box-sizing: border-box;
          font-size: 28px;
        }
        .m-logo{
          display: block;
          width: 90px;
          height: 90px;
          /*background-color: #9fd0bf;*/
        }
        .m-name{
          font-weight: 600;
          font-size: 32px;
          margin-top: 39px;
        }
        .m-product{
          display: block;
          width: 225px;
          height: 225px;
          background-color: #9fd0bf;
        }
        .m-price{
          color: #000;
          position: absolute;
          bottom: 10px;
          left: 10px;
          font-size: 28px;
        }
      }
    }
  }
  .m-dynamic{
    padding: 30px;
    .m-one-dynamic{
      width: 340px;
      text-align: left;
      margin-bottom: 20px;
      .m-title{
        width: 340px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 32px;
        font-weight: 400;
      }
      .m-product{
        display: block;
        width: 340px;
        height: 440px;
      }
    }
    .m-icon-more{
      display: block;
      width: 12px;
      height: 21px;
      margin-left: 10px;
    }
  }
  .m-line-title{
    position: relative;
    margin-top: 20px;
    padding: 0 20px;
    box-sizing: border-box;
    width: 100%;
    height: 50px;
    /*line-height: 50px;*/
    .m-cut-line{
      width: 100%;
      height: 2px;
      background-color: #000000;
      display: inline-block;
    }
    .m-name{
      position: absolute;
      top:0;
      bottom: 0;
      left: 0;
      right: 0;
      width: 174px;
      margin: 0 auto;
      font-weight: 600;
      font-size: 36px;
      background-color: #fff;
    }
  }
}
</style>
