<template>
  <div class="m-circle" @touchmove="touchMove">
    <!--<div class="m-circle" @touchmove.stop="touchMove">-->
    <!--搜索-->
      <div class="m-selected-search left">
        <div class="m-search-input-box" @click="changeRoute('/search','shtype','news' )">
          <span class="m-icon-search"></span>
          <span class="m-search-text">搜索内容/用户</span>
        </div>
<!--        <span class="m-icon-upload" @click="changeRoute('/circle/newEdit')"></span>-->
      </div>
      <div class="m-circle-content">
        <div class="m-flex-between m-circle-nav">
          <nav-list :navlist="nav_list" :isScroll="true" :is-get="true" @navClick="navClick"></nav-list>
          <span class="m-add-nav-label" @click="changeRoute('/circle/circleSort')">+</span>
        </div>

        <!--<mt-loadmore :top-method="loadTop" ref="loadmore">-->
          <div class="m-circle-body">
              <m-circle :index="index" v-for="(item,index) in news_list"  :key="index" :circle="item" @followClick="followClick" @likeClick="likeClick" @clickCollect="clickCollect"></m-circle>
            <bottom-line v-if="bottom_show"></bottom-line>
          </div>
          <!--</mt-loadmore>-->
      </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import navList from '../../../components/common/navlist';
  import common from '../../../common/js/common';
  import { Toast } from 'mint-ui';
  import wxapi from '../../../common/js/mixins';
  import wx from 'weixin-js-sdk';
  import bottomLine from '../../../components/common/bottomLine';
  import mCircle from '../../../components/common/circle';
  export default {
    name: 'circleIndex',
    data() {
      return {
        nav_list: [
          {
            itdesc: "我是描述",
            itid: "",
            itname: "全部",
            itrecommend: true,
            itsort: null,
            ittype: 10,
            active: false,
            psid: ""
          }
        ],
        news_list: null,
        page_info: {
          page_num: 1,
          page_size: 10
        },
        select_nav: null,
        isScroll: true,
        total_count: 0,
        bottom_show: false,
        show_invite: false
      }
    },
    mixins: [wxapi],
    inject: ['reload'],
    components: { navList, bottomLine,mCircle },
    mounted() {
      common.changeTitle('发现');
      if(!localStorage.getItem('circleIndex')) {
        localStorage.setItem('circleIndex', 0);
      }
      wxapi.wxRegister(location.href.split('#')[0]);
      if(this.$store.state.scrollTop >0 ||   this.$store.state.isChange){
        for(let a in this.$store.state.all_data){
          this._data[a] = this.$store.state.all_data[a]
        }
        document.documentElement.scrollTop =this.$store.state.scrollTop;
      }else{
        this.getNav();
      }
      if(sessionStorage.getItem('circleProduct')) {
        this.$router.push('/shop');
        sessionStorage.removeItem('circleProduct')
      }
    },
    //离开时记录位置
    beforeRouteLeave (to, from, next) {
      if(to.path == '/circle/detail' || to.path == '/search'){
        // sessionStorage.setItem('scrollTop',document.documentElement.scrollTop || document.body.scrollTop)
        this.$store.state.scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        this.$store.state.all_data = this._data;
        this.$store.state.isChange = true;
      }else{
        this.$store.state.scrollTop = 0;
        this.$store.state.isChange = false;
      }
      next();
    },
    // 引入keepAlive后代替beforeDestroy
    deactivated() {
      if(this.$route.path == '/circle/detail') {
        localStorage.setItem('circleDetail', 1);
      }else {
        localStorage.setItem('circleDetail', 0);
        localStorage.removeItem('circleIndex');
      }
    },
    methods: {
      // 分享圈子
      shareCircle(items) {
        if(localStorage.getItem('token')) {
          let options = {
            title: items.netitle,
            desc: items.netext,
            imgUrl: items.usheader,       // 初步考虑用用户头像
            link: location.href.split('#')[0] + '?neid=' + items.neid
          };
          this.$http.get(this.$api.secret_usid + '?token=' + localStorage.getItem('token')).then(res => {
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
          // Toast('请登录后再试');
          if(!localStorage.getItem('token')){
            let url = location.href.split('#')[0] + '?neid=' + items.neid
            // localStorage.setItem('login_to',url);
            // this.$router.push('/login');
            this.$store.state.show_login = true;
            return false;
          }
        }
      },
      /*跳转路由*/
      changeRoute(v,params,value){
        if(v == '/circle/detail'){
          if(value == 'comments') {
            sessionStorage.setItem('showComments', 'show');
            this.$router.push({path:v,query:{neid:params.neid}});
            return false;
          }else {
            this.$router.push({path:v,query:{neid:params.neid}});
            sessionStorage.setItem('circleFrom', 'buyer');
            return false;
          }
        }
        if(params == 'shtype'){
          this.$router.push({path:v,query:{shtype:value}})
        }else{
          this.$router.push({path:v})
        }
      },
      /*导航切换*/
      navClick(index){
        localStorage.setItem('circleIndex', index);
        let arr = [].concat(this.nav_list);
        for(let i=0;i<arr.length;i++){
          arr[i].active = false;
        }
        arr[index].active = true;
        this.nav_list = [].concat(arr);
        this.select_nav = arr[index];
        this.page_info.page_num = 1;
        this.bottom_show = false;
        this.getNews(this.nav_list[index].itid)
      },
      /*获取导航*/
      getNav(){
        this.$http.get(this.$api.items_list, { params: { ittype:10,token:localStorage.getItem('token')}}).then(res => {
          if(res.data.status == 200){
            this.nav_list = [
              {
                itdesc: "我是描述",
                itid: "",
                itname: "全部",
                itrecommend: true,
                itsort: null,
                ittype: 10,
                active: false,
                psid: ""
              }
            ];
            if(res.data.data.length == 0){
              this.nav_list = this.nav_list.concat([])
            }else{
              let arr=this.nav_list.concat(res.data.data);
              for(let i=0;i<arr.length;i++){
                arr[i].active = false;
              }
              if(localStorage.getItem('circleIndex')) {
                arr[localStorage.getItem('circleIndex')].active = true;
              }
              this.nav_list = [].concat(arr);
            }
            this.select_nav = this.nav_list[localStorage.getItem('circleIndex')];

            if(localStorage.getItem('circleDetail') == 1) {
              this.navClick(localStorage.getItem('circleIndex'));
            }else {
              if(this.$route.query.itid) {
                for(let i in this.nav_list) {
                  if(this.$route.query.itid == this.nav_list[i].itid) {
                    this.navClick(i);
                  }
                }
              }else {
                this.navClick(0);
              }
            }
          }
        })
      },
      /*获取资讯列表*/
      getNews(itid) {
        this.$http.get(this.$api.get_all_news,{
          params:{
            token:localStorage.getItem('token'),
            page_num:this.page_info.page_num,
            page_size: this.page_info.page_size,
            itid:itid,
            nestatus:'usual',
            kw:this.$route.query.kw
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
              this.news_list = [];
              this.page_info.page_num = 1;
              this.total_count = 0;
            }
          }
        })
      },
      /*点赞*/
      likeClick(i){
        this.$http.post(this.$api.favorite_news + '?token='+localStorage.getItem('token'),{
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
      //滚动加载更多
      touchMove(e){
        let scrollTop = common.getScrollTop();
        let scrollHeight = common.getScrollHeight();
        let ClientHeight = common.getClientHeight();
        if (scrollTop + ClientHeight  >= scrollHeight -10) {
          if(this.isScroll){
            this.isScroll = false;
            if(this.news_list.length == this.total_count){
              this.bottom_show = true;
            }else{
              for(let i=0;i<this.nav_list.length;i++){
                if(this.nav_list[i].active){
                  this.getNews(this.nav_list[i].itid);
                }
              }
            }
          }
        }
      },
      // 下拉刷新
      loadTop() {
        this.page_info.page_num = 1;
        for(let i = 0; i < this.nav_list.length; i ++) {
          if(this.nav_list[i].active) {
            this.getNews(this.nav_list[i].itid);          // 获取订单列表
          }
        }
        this.$refs.loadmore.onTopLoaded();
      },
      //  收藏
      clickCollect(index){
        this.$http.post(this.$api.collection_collect+'?token=' +localStorage.getItem('token'),{
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
        this.$http.post(this.$api.collection_collect+'?token=' +localStorage.getItem('token'),{
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
            // arr[index].follow = !arr[index].follow;
            //
            for(let i in arr){
              if(arr[i].author.usname == this.news_list[index].author.usname){
                arr[i].follow = !arr[i].follow;
              }
            }
            this.news_list = [].concat(arr)
          }
        })
      }
    }
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>
  @import "../../../common/css/index";
  .m-circle{
    min-height: 100vh;
    overflow-x: hidden;
    .m-circle-content{
      .m-circle-nav{
        box-shadow:0 3px 6px rgba(0,0,0,0.16);
        margin-bottom: 10px;
        .m-add-nav-label{
          display: block;
          padding: 0 30px;
          margin-left: 30px;
          border-left: 1px solid #EFEFEF;
          font-size: 30px;
          color: #C1C1C1;
        }
      }
      .m-scroll-l{
        width: 640px;
        overflow-x: auto;
        overflow-y: hidden;
        margin: 20px 0 0;
        padding: 0 68px 0 28px;
        .m-circle-nav{
          width: 101%;
          overflow-y: hidden;
          text-align: left;
          display: inline;
          white-space: nowrap;
          overflow-x: scroll;
          padding-right: 62px;
          li{
            display: inline-block;
            padding: 5px;
            height: 34px;
            line-height: 34px;
            margin-right: 62px;
            &.active{
              border-bottom: 3px solid @mainColor;
            }
          }
        }
      }
      .m-circle-body{
        margin-bottom: 20px;
        padding-bottom: 20px;
        background-color: #fff;
      }
    }
  }
</style>
