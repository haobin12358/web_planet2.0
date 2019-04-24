<template>
  <div class="m-activity" ref="activity">
    <!--<div class="m-activity-top-bg"></div>-->

    <img :src="selecte_nav.actoppic" class="m-activity-top-img" alt="">
    <nav-list :navlist="activityList" :is-act="true" @navClick="navClick"></nav-list>
    <mt-loadmore :top-method="loadTop" ref="loadmore">
      <div  v-if="selecte_nav.acname == '限时特惠'">
        <div class="m-one-limit">
          <div class="m-limit-title">
            <span>限时特惠</span>
            <div class="m-flex-end">
              <span class="m-active">距离开始</span>
              <span class="m-activity-time"><img src="/static/images/index/icon-time.png" class="m-icon-time" alt="">12.34</span>
            </div>
          </div>
          <div class="m-hot">
           <div class="m-hot-left">
             <p class="m-hot-hot">HOT</p>
             <p class="m-line-left"></p>
             <p> 好物推荐</p>
           </div>
            <div class="m-hot-right">
             <ul>
               <li>
                 <img src="" class="m-hot-product-img" alt="">
                 <p>2019新款卫衣</p>
                 <p class="m-num">¥999</p>
               </li>
               <li>
                 <img src="" class="m-hot-product-img" alt="">
                 <p>2019新款卫衣</p>
                 <p class="m-num">¥999</p>
               </li>
               <li>
                 <img src="" class="m-hot-product-img" alt="">
                 <p>2019新款卫衣</p>
                 <p class="m-num">¥999</p>
               </li>
             </ul>
            </div>
          </div>
        </div>
        <div class="m-one-limit">
          <div class="m-limit-title">
            <span>限时特惠</span>
            <div class="m-flex-end">
              <span class="m-active">距离开始</span>
              <span class="m-activity-time"><img src="/static/images/index/icon-time.png" class="m-icon-time" alt="">12.34</span>
            </div>
          </div>
          <div class="m-limit-center-content">
            <ul class="m-center-product-ul">
              <li>
                <img src="" class="m-product-img" alt="">
                <p class="m-product-name"> 2019新款卫衣</p>
                <p class="m-flex-between">
                  <span class="m-num">¥999</span>
                  <s>¥999</s>
                </p>
              </li>
              <li>
                <img src="" class="m-product-img" alt="">
                <p class="m-product-name"> 2019新款卫衣</p>
                <p class="m-flex-between">
                  <span class="m-num">¥999</span>
                  <s>¥999</s>
                </p>
              </li>
              <li>
                <img src="" class="m-product-img" alt="">
                <p class="m-product-name"> 2019新款卫衣</p>
                <p class="m-flex-between">
                  <span class="m-num">¥999</span>
                  <s>¥999</s>
                </p>
              </li>
              <li>
                <img src="" class="m-product-img" alt="">
                <p class="m-product-name"> 2019新款卫衣</p>
                <p class="m-flex-between">
                  <span class="m-num">¥999</span>
                  <s>¥999</s>
                </p>
              </li>
              <li>
                <img src="" class="m-product-img" alt="">
                <p class="m-product-name"> 2019新款卫衣</p>
                <p class="m-flex-between">
                  <span class="m-num">¥999</span>
                  <s>¥999</s>
                </p>
              </li>
            </ul>
            <p class="m-more-text">
              <span>更多折扣</span>
              <img src="/static/images/newpersonal/icon-more.png" class="m-icon-more" alt="">
            </p>
          </div>
        </div>
        <div class="m-one-limit">
          <div class="m-limit-title">
            <span>限时特惠</span>
            <div class="m-flex-end">
              <span class="m-active">距离开始</span>
              <span class="m-activity-time"><img src="/static/images/index/icon-time.png" class="m-icon-time" alt="">12.34</span>
            </div>
          </div>
          <div class="m-limit-center-content">
            <ul class="m-center-product-ul">
              <li>
                <img src="" class="m-product-img" alt="">
                <p class="m-product-name"> 2019新款卫衣</p>
                <p class="m-flex-between">
                  <span class="m-num">¥999</span>
                  <s>¥999</s>
                </p>
              </li>
              <li>
                <img src="" class="m-product-img" alt="">
                <p class="m-product-name"> 2019新款卫衣</p>
                <p class="m-flex-between">
                  <span class="m-num">¥999</span>
                  <s>¥999</s>
                </p>
              </li>
              <li>
                <img src="" class="m-product-img" alt="">
                <p class="m-product-name"> 2019新款卫衣</p>
                <p class="m-flex-between">
                  <span class="m-num">¥999</span>
                  <s>¥999</s>
                </p>
              </li>
              <li>
                <img src="" class="m-product-img" alt="">
                <p class="m-product-name"> 2019新款卫衣</p>
                <p class="m-flex-between">
                  <span class="m-num">¥999</span>
                  <s>¥999</s>
                </p>
              </li>
              <li>
                <img src="" class="m-product-img" alt="">
                <p class="m-product-name"> 2019新款卫衣</p>
                <p class="m-flex-between">
                  <span class="m-num">¥999</span>
                  <s>¥999</s>
                </p>
              </li>
            </ul>
            <p class="m-more-text">
              <span>更多折扣</span>
              <img src="/static/images/newpersonal/icon-more.png" class="m-icon-more" alt="">
            </p>
          </div>
        </div>
      </div>
      <bottom-line v-if="bottom_show"></bottom-line>
    </mt-loadmore>
  </div>
</template>

<script type="text/ecmascript-6">
  import common from '../../../common/js/common';
  import navList from '../../../components/common/navlist';
  import bottomLine from '../../../components/common/bottomLine';
  import { Toast } from 'mint-ui';

  export default {
    name: 'activityIndex',
    data() {
      return {
        name: '',
        activityList: [],
        selecte_nav:{},
        page_info:{
          page_num:1,
          page_size:10
        },
        isScroll: true,
        total_count: 0,
        bottom_show: false,
      }
    },
    components: {navList,bottomLine},
    methods: {
      // 跳转页面
      changeRoute(v) {
        switch(v) {
          case 0:
            this.$router.push({ path: "/activityProduct", query: { which: "new" }});
            break;
          case 1:
            this.$router.push("/dailyGuess");
            break;
          case 2:
            this.$router.push("/pandora");
            break;
          case 3:
            this.$router.push({ path: "/activityProduct", query: { which: "try" }});
            break;
          case 4:
            this.$router.push({ path: "/limitedTime"});   //限时活动
            break;
        }
      },
      // 导航点击
      navClick(index) {
        this.page_info.page_num = 1;
        this.total_count = 0;
        this.bottom_show = false;
        let arr = [].concat(this.activityList);
        if(arr[index].active) {
          return false;
        }
        for(let i = 0; i < arr.length; i ++) {
          arr[i].active = false;
        }
        arr[index].active = true;
        this.activityList = [].concat(arr);
        this.selecte_nav = this.activityList[index];
      },
      // 获取活动list
      getActivit() {
        this.$http.get(this.$api.activity_list + "?token=" + localStorage.getItem('token')).then(res => {
          if(res.data.status == 200){
            this.activityList = res.data.data;
            for(let i in this.activityList){
              this.activityList[i].active = false;
            }
            console.log(this.activityList)
            this.navClick(0);
            // this.$refs.activity.style.height = this.activityList.length * 520 + 'px';
          }
        });
      },
      // 下拉刷新
      loadTop() {
        this.page_info.page_num = 1;
        // for(let i = 0; i < this.order_list.length; i ++) {
        //   if(this.order_list[i].time_interVal){
        //     clearInterval(this.order_list[i].time_interVal);
        //   }
        //
        // }
        // for(let i = 0; i < this.nav_list.length; i ++) {
        //   if(this.nav_list[i].active) {
        //     this.getOrderList(this.nav_list[i].status);          // 获取订单列表
        //   }
        // }
        this.$refs.loadmore.onTopLoaded();
      },
    },
    mounted() {
      common.changeTitle('活动');
      if(this.$route.query.token) {
        localStorage.setItem('token', this.$route.query.token);
      }
      this.getActivit();                // 获取活动list
    }
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>
  @import "../../../common/css/index";

  .m-activity {
    /*height: 100%;*/
    /*overflow-y: hidden;*/
    min-height: 100vh;
    background-color: #ffffff;
    color: #000;
    .m-activity-top-img{
      display: block;
      width: 750px;
      height: 250px;
    }
    .m-one-limit{
      width: 100%;
      border-bottom: 10px solid #F4F4F4;
      .m-limit-title{
        .flex-row(space-between);
        padding: 5px 0 5px 20px;
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
      .m-hot{
        .flex-row(space-between);
        padding: 20px;
        .m-hot-left{
          width: 88px;
          height: 258px;
          padding: 10px;
          box-sizing: border-box;
          background: url("/static/images/newActivity/icon-hot.png") no-repeat;
          background-size: 100% 100%;
          text-align: left;
          margin-right: 30px;
          .m-hot-hot{
            font-size: 28px;
            font-weight: 600;
          }
          .m-line-left{
            border-left: 1px solid #000;
            height: 117px;
            margin: 7px 0 7px 10px;
          }
        }
        .m-hot-right{
          ul{
            .flex-row(flex-start);
            li{
              margin-right: 20px;
              width: 180px;
              text-align: left;
              &:last-child{
                margin-right: 0;
              }
              .m-hot-product-img{
                display: block;
                width: 180px;
                height: 180px;
              }
              .m-num{
                font-weight: 600;
                font-size: 32px;
              }
            }
          }
        }
      }
      .m-limit-center-content{
        padding: 0 45px;
        .m-more-text{
          color: #C1C1C1;
          font-size: 24px;
          .flex-row(flex-end);
          margin: 20px 0;
          .m-icon-more{
            display: inline-block;
            width: 17px;
            height: 30px;
            margin-left: 10px;
          }
        }
        ul.m-center-product-ul{
          .flex-row(flex-start);
          flex-flow: wrap;
          li{
            margin: 20px 20px 0 0;
            width: 150px;
            &:nth-child(4n){
              margin-right: 0;
            }
            .m-product-img{
              display: block;
              width: 150px;
              height: 150px;
            }
            .m-product-name{
              width: 150px;
              height: 28px;
              line-height: 28px;
              font-size: 20px;
              overflow: hidden;
              text-overflow: ellipsis;    // 溢出用省略号显示
              white-space:nowrap;
            }
            .m-num{
              font-size: 24px;
            }
            s{
              font-size: 16px;
              color: #C1C1C1;
            }
          }
        }
      }
      &:last-child{
        border-bottom: none;
        .m-limit-center-content{
          ul.m-center-product-ul{
            .flex-row(flex-start);
            flex-flow: wrap;
            li{
              margin: 20px 20px 0 0;
              width: 320px;
              &:nth-child(2n){
                margin-right: 0;
              }
              .m-product-img{
                display: block;
                width: 320px;
                height: 450px;
              }
              .m-product-name{
                width: 320px;
                height: 28px;
                line-height: 28px;
                font-size: 20px;
                overflow: hidden;
                text-overflow: ellipsis;    // 溢出用省略号显示
                white-space:nowrap;
              }
              .m-num{
                font-size: 24px;
              }
              s{
                font-size: 16px;
                color: #C1C1C1;
              }
            }
          }
        }
      }
    }
  }
</style>
