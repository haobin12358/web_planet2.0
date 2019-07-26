<template>
    <div class="m-selected"  @touchmove="touchMove">
      <div class="m-selected-search left">
        <div class="m-search-input-box" @click="changeRoute('/search')">
          <span class="m-icon-search"></span>
          <span class="m-search-text">{{$route.query.kw || '搜索户外箱包'}}</span>
        </div>
      </div>
        <div class="m-swipe">
          <mt-swipe :auto="3000" v-if="swipe_list">
            <mt-swipe-item v-for="item in swipe_list" :key="item.ibid">
              <img :src="item.ibpic" class="img" @click="changeRouteImg('/productDetail', item)">
            </mt-swipe-item>
          </mt-swipe>
        </div>
        <!--标签-->
<!--        <div class="m-selected-label">-->
<!--          <div class="m-selected-label-left">-->
<!--            <div class="m-selected-label-l">-->
<!--              <span>大行星优惠码兑换</span>-->
<!--&lt;!&ndash;              <span>假一赔十</span>&ndash;&gt;-->
<!--            </div>-->
<!--            <ul class="m-selected-label-ul">-->
<!--              <li>-->
<!--                <img src="/static/images/index/icon-zheng.png" class="m-icon-label">-->
<!--                <span>正品保证</span>-->
<!--              </li>-->
<!--              <li>-->
<!--                <img src="/static/images/index/icon-zhuan.png" class="m-icon-label">-->
<!--                <span>专业精选</span>-->
<!--              </li>-->
<!--              <li>-->
<!--                <img src="/static/images/index/icon-tui.png" class="m-icon-label">-->
<!--                <span>十五天无忧退换</span>-->
<!--              </li>-->
<!--            </ul>-->
<!--          </div>-->
<!--          <div class="m-selected-label-right" @click="changeRoute('personal/coupon')">-->
<!--            <span>立即兑换</span>-->
<!--          </div>-->
<!--        </div>-->

<!--      <div class="m-selected-one" v-if="top_img">-->
<!--        <img :src="top_img.enpic" @click="changeRouteImg('/activity',top_img)" class="m-activity-img" alt="">-->
<!--      </div>-->
        <div class="m-selected-one">
          <!--场景分类-->
          <div class="m-scroll " v-if="icon_list">
            <ul class="m-equipment-icon-ul">
              <li v-for="(item,index) in icon_list" @click="changeRoute('/scene',item)">
                <img :src="item.pspic" alt="">
                <span class="m-name">{{item.psname}}</span>
              </li>
            </ul>
          </div>
        </div>

      <div class="m-selected-activity">
        <div class="m-row" v-if="center_img" @click="changeRouteImg('/activity',center_img)">
          <img :src="center_img.enpic" class="m-center-img" alt="">
        </div>
        <div class="m-row">
          <div class="m-col" v-if="left_img" @click="changeRouteImg('/activity',left_img)">
            <img :src="left_img.enpic" alt="">
          </div>
          <div class="m-col" v-if="right_img"  @click="changeRouteImg('/activity',right_img)">
            <img :src="right_img.enpic" alt="">
          </div>
        </div>
      </div>
      <div class="m-discount-box">
        <div class="m-scroll " >
          <ul class="m-discount-list">
            <li v-for="(item,index) in discount_list">
              <discount :item="item" :index="index" @haveDiscount="haveDiscount"></discount>
            </li>
<!--            <li class="m-brand">-->
<!--              <span class="m-label">全平台</span>-->
<!--              <div class="m-discount-num">100</div>-->
<!--              <div class="m-discount-condition">满128元可用</div>-->
<!--              <div class="m-discount-info">全平台均可使用-->
<!--                全平台均可使...</div>-->
<!--              <div class="m-discount-btn">立即领取</div>-->
<!--              <div class="m-discount-line"></div>-->
<!--            </li>-->
<!--            <li class="m-zhe">-->
<!--              <span class="m-label">折扣券</span>-->
<!--              <div class="m-discount-num">100<span class="m-word">折</span></div>-->
<!--              <div class="m-discount-condition">满128元可用</div>-->
<!--              <div class="m-discount-info">全平台均可使用-->
<!--                全平台均可使...</div>-->
<!--              <div class="m-discount-btn">立即领取</div>-->
<!--              <div class="m-discount-line"></div>-->
<!--            </li>-->
<!--            <li>-->
<!--              <span class="m-label">全平台</span>-->
<!--              <div class="m-discount-num">100</div>-->
<!--              <div class="m-discount-condition">满128元可用</div>-->
<!--              <div class="m-discount-info">全平台均可使用-->
<!--                全平台均可使...</div>-->
<!--              <div class="m-discount-btn">立即领取</div>-->
<!--              <div class="m-discount-line"></div>-->
<!--            </li>-->
          </ul>
        </div>
      </div>
<!--      <m-circle :index="index" v-for="(item,index) in news_list"  :key="index" :circle="item" @followClick="followClick" @likeClick="likeClick" @clickCollect="clickCollect"></m-circle>-->
      <!--    商品列表-->
      <div class="m-line-title">
        <span class="m-cut-line"></span>
        <span class="m-name">新品·推荐</span>
      </div>
      <product :list="product_list"></product>
      <bottom-line v-if="bottom_show"></bottom-line>
      <!--</mt-loadmore>-->
    </div>

</template>

<script type="text/ecmascript-6">
  import common from '../../../common/js/common';
  import wxapi from '../../../common/js/mixins';
  import wx from 'weixin-js-sdk';
  import bottomLine from '../../../components/common/bottomLine';
  // import mCircle from '../../../components/common/circle';
  import discount from '../../../components/common/discount';
  import product from '../components/product';
  import { Toast} from 'mint-ui';
    export default {
      name: 'SelectedIndex',
      data() {
        return {
          swipe_list:null,
          hot_list:null,
          news_list: [],
          discount_list:[],
          icon_list:null,
          page_info:{
            page_num :1,
            page_size:10
          },
          isScroll: true,
          total_count: 0,
          bottom_show: false,
          top_img:null,
          center_img:null,
          left_img:null,
          right_img:null,
          product_list:[]
        }
      },
      mixins: [wxapi],
      components: { bottomLine,  product,discount},
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
        if(!localStorage.getItem('token')){
          localStorage.removeItem('is_new');
        }
        if(this.$store.state.scrollTop >0 ){
          for(let a in this.$store.state.all_data){
            this._data[a] = this.$store.state.all_data[a]
          }
        }else{
          this.getSwipe();
          this.getCategory();
          this.getImg();
          this.getProduct();
          this.getDiscount();
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
      //离开时记录页面滚动位置
      beforeRouteLeave (to, from, next) {
        if(to.path == '/circle/detail'){
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
        //处理各个图片点击跳转路由
        dealUrl(url,name){
          if(localStorage.getItem('share') == 'mbjid' || url.indexOf('mbjid') > 0) {
            //魔术礼盒
            let params ;
            if(url.indexOf('&secret_usid') > 0){
              params = url.split('?mbjid=')[1].split('&secret_usid')[0];
            }else{
              params = url.split('?mbjid=')[1];
            }
            this.$router.push({ path: '/openMagicBox', query: { mbjid: params }});
          }else if(localStorage.getItem('share') == 'fmfpid' || url.indexOf('fmfpid') > 0) {
            //活动商品详情
            let params = url.split('?fmfpid=')[1].split('&secret_usid')[0].split('&which=');
            this.$router.push({ path: '/activityProductDetail', query: { fmfpid: params[0], which: params[1] }})
          }else if(localStorage.getItem('share') == 'tlpid' || url.indexOf('tlpid') > 0) {
            //限时活动商品详情
            let params ;
            if(url.indexOf('&secret_usid') > 0){
              params = url.split('?tlpid=')[1].split('&secret_usid')[0];
            }else{
              params = url.split('?tlpid=')[1];
            }
            this.$router.push({ path: '/limitedProductDetail', query: { tlpid: params}})
          }else if(localStorage.getItem('share') == 'tcid' || url.indexOf('tcid') > 0) {
            //新人，试用活动商品详情
            let params = url.split('?tcid=')[1].split('&secret_usid')[0].split('&which=');
            this.$router.push({ path: '/activityProductDetail', query: { tcid: params[0], which: params[1] }})
          }else if(localStorage.getItem('share') == 'neid' || url.indexOf('neid') > 0) {
            //圈子详情
            let params ;
            if(url.indexOf('&secret_usid') > 0){
              params = url.split('?neid=')[1].split('&secret_usid')[0];
            }else{
              params = url.split('?neid=')[1];
            }
            this.$router.push({ path: '/circle/detail', query: { neid: params }})
          }else if(localStorage.getItem('share') == 'tlaid' || url.indexOf('tlaid') > 0) {
            //单一限时活动页面
            let params ;
            if(url.indexOf('&secret_usid') > 0){
              params = url.split('?tlaid=')[1].split('&secret_usid')[0];
            }else{
              params = url.split('?tlaid=')[1];
            }
            this.$router.push({ path: '/limitedTime', query: { tlaid: params }})
          }else if(localStorage.getItem('share') == 'gift' || url.indexOf('gfid') >0){
            let params;
            if(url.indexOf('&secret_usid') > 0){
              params = url.split('?gfid=')[1].split('&secret_usid')[0];
            }else{
              params = url.split('?gfid=')[1];
            }

            this.$router.push({ path: '/gift', query: { prid: params.split('&from')[0] }})
          }else if(localStorage.getItem('share') == 'pbid' || url.indexOf('pbid') >0){
            let params;
            if(url.indexOf('&secret_usid') > 0){
              params = url.split('?pbid=')[1].split('&secret_usid')[0];
            }else{
              params = url.split('?pbid=')[1];
            }

            this.$router.push({ path: '/brandDetail', query: { pbid: params.split('&from')[0] }})
          }else if(localStorage.getItem('share') == 'prid' || url.indexOf('prid') > 0) {
            //商品详情，开店大礼包
            let params;
            if(url.indexOf('&secret_usid') > 0){
              params = url.split('?prid=')[1].split('&secret_usid')[0];
            }else{
              params = url.split('?prid=')[1];
            }
            if(url.indexOf('from=gift') >0 ){
              this.$router.push({ path: '/gift', query: { prid: params.split('&from')[0] }})
            }else{
              this.$router.push({ path: '/productDetail', query: { prid: params }})
            }

          }else if(localStorage.getItem('share') == 'ipid' || url.indexOf('ipid') > 0) {
            //星币商城商品详情
            let params;
            if(url.indexOf('&secret_usid') > 0){
              params = url.split('?ipid=')[1].split('&secret_usid')[0];
            }else{
              params = url.split('?ipid=')[1];
            }
            this.$router.push({ path: '/personal/starProductDetail', query: { ipid: params }})
          }else if(localStorage.getItem('share') == 'activityId=new' || url.indexOf('activityId=new') > 0) {
            //新人首单
            this.$router.push({ path: '/activityProduct', query: { which: 'new' }})
          }else if(localStorage.getItem('share') == 'activityId=try' || url.indexOf('activityId=try') > 0) {
            //试用商品
            this.$router.push({ path: '/activityProduct', query: { which: 'try' }})
          }else if(localStorage.getItem('share') == 'activityId=guess' || url.indexOf('activityId=guess') > 0) {
            //竞猜商品
            this.$router.push({ path: '/guessProduct', query: { which: 'guess' }})
          }else if(localStorage.getItem('share') == 'uaid' || url.indexOf('uaid') > 0) {
            //竞猜商品详情
            this.$router.push({ path: '/guessProductDetail'})
          }else if(localStorage.getItem('share') == 'index' || url.indexOf('index') > 0) {
            //首页
            this.$router.push({ path: '/selected'})
          }else if(localStorage.getItem('share') == 'actype' || url.indexOf('actype') > 0) {
            //活动首页
            let params;
            if(url.indexOf('&secret_usid') > 0){
              params = url.split('?actype=')[1].split('&secret_usid')[0];
            }else{
              params = url.split('?actype=')[1];
            }
            this.$router.push({ path: '/activity', query: { actype: params }})
          }else if(localStorage.getItem('share') == 'ggid' || url.indexOf('ggid') > 0) {
            let params;
            if(url.indexOf('&secret_usid') > 0){
              params = url.split('?ggid=')[1].split('&secret_usid')[0];
            }else{
              params = url.split('?ggid=')[1];
            }
            //首页
            this.$router.push({ path: '/groupProductDetail',query:{ggid:params}})
          }else if(name){
            location.href = url
          }
        },
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
        /*获取轮播图*/
        getSwipe(){
          this.$http.get(this.$api.list_banner_index).then(res => {
            if(res.data.status == 200){
              this.swipe_list = res.data.data;
            }
          })
        },
        //获取首页活动图
        getImg(){
          this.$http.get(this.$api.get_entry).then(res => {
            if(res.data.status == 200){
              if(res.data.data.length >0){
                let arr = res.data.data;
                for(let i in arr){
                  if(arr[i].entype == 0){
                    this.top_img = arr[i]
                  }else if(arr[i].entype == 1 ){
                    this.center_img = arr[i]
                  }else if(arr[i].entype == 2 ){
                    this.left_img = arr[i]
                  }else if(arr[i].entype == 3 ){
                    this.right_img = arr[i]
                  }
                }
              }
            }
          })
        },
        //获取场景信息
        getCategory(){
          this.$http.get(this.$api.scene_list).then(res => {
            if(res.data.status == 200){
              this.icon_list = [].concat(res.data.data);
            }
          })
        },
        //获取商品列表
        getProduct(id){
          let start = this.page_info.page_num;
          let _kw = this.$route.query.kw || '';
          this.$http.get(this.$api.product_list,{
            params:{
              pcid:id,
              page_size:this.page_info.page_size,
              page_num:start,
              kw:_kw,
              token:localStorage.getItem('token'),
              itid:'home_recommend'
            }
          }).then(res => {
            if(res.data.status == 200){
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
        //获取优惠列表
        getDiscount(){
          this.$http.get(this.$api.coupon_list,{
            params:{
              page_size:20,
              page_num:1,
              token:localStorage.getItem('token'),
              itid:'home_recommend_category'
            }
          }).then(res => {
            if(res.data.status == 200){
              this.discount_list = res.data.data;
            }
          },error => {
            Toast({ message: error.data.message,duration:1000, className: 'm-toast-fail' });
          })
        },
        //领取优惠券
        haveDiscount(item,index){
          console.log(item,index)
          this.$http.post(this.$api.coupon_fetch + '?token=' + localStorage.getItem('token'), { coid: item }).then(res => {
            Toast(res.data.message);
            if(res.data.status == 200){
              this.discount_list.splice(index,1);

            }
          });
        },
        /*获取资讯列表*/
        // getNews() {
        //   this.$http.get(this.$api.get_all_news,{
        //     params:{
        //       token:localStorage.getItem('token'),
        //       page_num:this.page_info.page_num,
        //       page_size: this.page_info.page_size,
        //       nestatus:'usual',
        //       kw:this.$route.query.kw,
        //       itid:'index'
        //     }
        //   }).then(res => {
        //     if(res.data.status == 200){
        //       this.isScroll =true;
        //       if(res.data.data.length >0){
        //         //处理圈子详情中的换行和空格
        //         for(let i in res.data.data){
        //           if(res.data.data[i].netext)
        //             res.data.data[i].netext = res.data.data[i].netext.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>').replace(/\s/g, '&nbsp;')
        //         }
        //         if(this.page_info.page_num >1){
        //           this.news_list =  this.news_list.concat(res.data.data);
        //         }else{
        //           this.news_list = res.data.data;
        //         }
        //         this.page_info.page_num = this.page_info.page_num + 1;
        //         this.total_count = res.data.total_count;
        //       }else{
        //         this.news_list = null;
        //         this.page_info.page_num = 1;
        //         this.total_count = 0;
        //       }
        //     }
        //   })
        // },
        /*点赞*/
        // likeClick(i){
        //   this.$http.post(this.$api.favorite_news + '?token='+localStorage.getItem('token'),{
        //     neid:this.news_list[i].neid,
        //     tftype:1
        //   }).then(res => {
        //     if(res.data.status == 200){
        //       let arr = [].concat(this.news_list);
        //       if(arr[i].is_favorite){
        //         arr[i].favoritnumber = arr[i].favoritnumber-1;
        //       }else{
        //         arr[i].favoritnumber = arr[i].favoritnumber+1;
        //       }
        //       arr[i].is_favorite = !arr[i].is_favorite;
        //       this.news_list = [].concat(arr);
        //     }
        //   })
        // },
        //  收藏
        // clickCollect(index){
        //   this.$http.post(this.$api.collection_collect+'?token=' +localStorage.getItem('token'),{
        //     uclcollection:this.news_list[index].neid,
        //     uclcotype:1
        //   }).then(res => {
        //     if(res.data.status == 200){
        //       Toast(
        //         {
        //           message: res.data.message,
        //           duration: 500
        //         });
        //       let arr = [].concat(this.news_list);
        //       arr[index].collected = !arr[index].collected;
        //       // arr.splice(index,1);
        //       this.news_list = [].concat(arr)
        //     }
        //   })
        // },
        //  关注
        // followClick(index){
        //   this.$http.post(this.$api.collection_collect+'?token=' +localStorage.getItem('token'),{
        //     uclcollection:this.news_list[index].neid,
        //     uclcotype:2
        //   }).then(res => {
        //     if(res.data.status == 200){
        //       Toast(
        //         {
        //           message: res.data.message,
        //           duration: 500
        //         });
        //       let arr = [].concat(this.news_list);
        //       // arr[index].follow = !arr[index].follow;
        //       //
        //       for(let i in arr){
        //         if(arr[i].author.usname == this.news_list[index].author.usname){
        //           arr[i].follow = !arr[i].follow;
        //         }
        //       }
        //       this.news_list = [].concat(arr);
        //     }
        //   })
        // },
        //滚动加载更多
        touchMove(e) {
          let scrollTop = common.getScrollTop();
          let scrollHeight = common.getScrollHeight();
          let ClientHeight = common.getClientHeight();
          if (scrollTop + ClientHeight  >= scrollHeight -10) {
            if(this.isScroll){
              this.isScroll = false;
              if(this.product_list.length == this.total_count){
                this.bottom_show = true;
              }else{
                    this.getProduct();
              }
            }
          }
        },
        changeRouteImg(v,item){
          if(item.contentlink){
            // location.href = item.contentlink;
            let url = item.contentlink;
            this.dealUrl(url,'change');
          }
        },
        /*查看更多*/
        changeRoute(v, item) {
          switch(v) {
            case '/scene':
              //场景
              if(item){
                this.$router.push({path:v,query:{psid:item.psid}});
              }else{
                this.$router.push({path:v});
              }
              break;
            default:
              this.$router.push({path:v,});
          }
        },
        /*下拉刷新*/
        loadTop(){
          this.reload();
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
  .m-selected-search{
    padding: 0 20px 10px;
    width: 710px;
    .m-search-input-box{
      .flex-row(flex-start);
      background-color: #F4F4F4;
      /*color: #fff;*/
      .m-icon-search{
        background: url("/static/images/icon-search.png") no-repeat;
        background-size: 100%;
        margin: 0 20px 0 30px;
      }
    }
  }
  .m-selected-label{
    width: 750px;
    padding: 30px 33px;
    margin: 20px auto;
    height: 60px;
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
      background:linear-gradient(270deg,@mainColor 0%,@subColor 100%);
      font-size: 28px;
      color: #fff;
      line-height: 50px;
      text-align: center;
      font-weight: 600;
    }
  }
  .m-selected-title{
    font-size: 36px;
    font-weight: bold;
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
    padding: 0 20px ;
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
      font-size: 21px;
      line-height: 24px;
      letter-spacing: -0.4px;
      position: relative;
      width: 120px;
      box-shadow: none;
      margin: 0 15px 10px 0;
      .flex-col(center);
      img{
        display: block;
        width: 80px;
        height: 80px;
        margin-bottom: 10px;
      }
      .m-name{
        display: block;
        width: 120px;
        text-align: center;
      }
    }
  }
  .m-discount-box{
    .m-scroll{
      margin: 0;
    }
  }
  .m-discount-list{
    .flex-row(flex-start);
    background-color: #F2F2F2;
    li{
      flex-shrink: 0;
      margin: 20px 0 20px 20px;
    }
  }
  .m-selected-activity{
    .m-row{
      .flex-row(center);
      border-bottom: 1px solid #f4f4f4;
      text-align: left;
      .m-center-img{
        display: block;
        width: 100%;
        height: 120px;
      }
      .m-col{
        img{
          display: block;
          width: 375px;
          height: 200px;
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
      height: 1px;
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
