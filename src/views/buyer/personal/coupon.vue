<template>
  <div class="m-coupon" @touchmove="touchMove">
    <div class="m-flex-center m-search-top">
      <div class="m-search-input-box">
        <input type="text" v-model="code" maxlength="20"  @keypress="keyPress" placeholder="请输入优惠码兑换">
        <span class="m-icon-close" @click="clearInput"></span>
        <span class="m-btn" @click="createToc">兑换</span>
      </div>

      <!--<span @click="changeRoute" v-if="searchContent">搜索</span>-->
    </div>
    <mt-loadmore :top-method="loadTop">
      <div class="m-nav">
        <nav-list :navlist="nav_list" :isScroll="false" @navClick="navClick"></nav-list>
      </div>
      <div class="m-coupon-content">
        <coupon-card :couponList="couponList"></coupon-card>
      </div>
      <bottom-line v-if="bottom_show"></bottom-line>
    </mt-loadmore>
  </div>
</template>

<script type="text/ecmascript-6">
  import couponCard from '../components/couponCard';
  import navList from '../../../components/common/navlist';
  import common from '../../../common/js/common';
  import axios from 'axios';
  import api from '../../../api/api';
  import { Toast } from 'mint-ui';
  import bottomLine from '../../../components/common/bottomLine';

  export default {
    data() {
      return {
        nav_list:[
          { name: '未使用', params: '2', active: true }, { name: '已使用', params: '1', active: false }, { name: '已过期', params: '0', active: false }
        ],
        couponList: [],            // 优惠券list
        status: "2",               // 暂存navList点击的优惠券状态，默认是未使用("0")开头
        navName: "未使用",          // 暂存navList点击的name
        page_num: 1,
        page_size: 10,
        isScroll: true,
        total_count: 0,
        bottom_show: false,
        code:''
      }
    },
    inject:['reload'],
    components: { navList, couponCard, bottomLine },
    methods: {
      // navList的点击事件
      navClick(index){
        this.page_num = 1;
        this.total_count = 0;
        this.bottom_show = false;

        let arr = [].concat(this.nav_list);
        for(let i = 0; i < arr.length; i ++) {
          arr[i].active = false;
        }
        arr[index].active = true;
        this.status = arr[index].params;
        this.navName = arr[index].name;
        this.couponList = [];
        this.getUserCoupon();            // 获取用户个人优惠券
        this.nav_list = [].concat(arr);
      },
      // 获取用户个人优惠券
      getUserCoupon() {
        let params = {
          token: localStorage.getItem('token'),
          page_num : this.page_num,
          page_size : this.page_size
        };
        if(this.status == "0") {
          params.canuse = "false";
        }else if(this.status == "1") {
          params.ucalreadyuse = "true";
        }else if(this.status == "2") {
          params.ucalreadyuse = "false";
          params.canuse = "true";
        }
        axios.get(api.list_user_coupon, { params: params }).then(res => {
          if(res.data.status == 200){
            this.isScroll = true;
            if(res.data.data.length > 0) {
              if(this.page_num > 1) {     // 把新数据给list续上
                let list = [];
                for(let i = 0; i < res.data.data.length; i ++) {
                  list.push(res.data.data[i].coupon);
                }
                this.couponList = this.couponList.concat(list);
              }else{
                for(let i = 0; i < res.data.data.length; i ++) {
                  this.couponList.push(res.data.data[i].coupon);
                }
              }
              this.page_num = this.page_num + 1;
              this.total_count = res.data.total_count;
            }
            for(let i = 0; i < this.couponList.length; i ++) {
              if(this.couponList[i].title_subtitle.left_text.length > 8) {
                this.couponList[i].title_subtitle.left_text = this.couponList[i].title_subtitle.left_text.substr(0, 8) + "..";
              }
              this.couponList[i].navName = this.navName;
            }
            // 优惠券显示内容精简
            for(let i in this.couponList) {
              if(this.couponList[i].cosubtration.toString().length > 4) {
                this.couponList[i].cosubtration = 999
              }
              this.couponList[i].codiscount = this.couponList[i].codiscount.toString().slice(0, 3)
            }
          }else{
            this.couponList = [];
            this.page_num = 1;
            this.total_count = 0;
            return false;
          }
        });
      },
      //滚动加载更多
      touchMove(e){
        let scrollTop = common.getScrollTop();
        let scrollHeight = common.getScrollHeight();
        let ClientHeight = common.getClientHeight();
        if (scrollTop + ClientHeight  >= scrollHeight - 10) {
          if(this.isScroll) {
            this.isScroll = false;
            if(this.couponList.length == this.total_count) {
              this.bottom_show = true;
            }else {
              this.getUserCoupon();         // 获取优惠券列表
            }
          }
        }
      },
      // 下拉刷新
      loadTop() {
        this.reload();
      },
      /*清楚搜索内容*/
      clearInput(){
        this.code = '';
      },
      /*键盘搜索*/
      keyPress(e){
        if(e.keyCode == 13){
          this.createToc();
        }
      },
      //创建话题
      createToc(){
        if(!this.code){
          Toast('请先填写需要兑换的优惠码');
          return false;
        }
        this.$http.post(this.$api.coupon_code + '?token=' +localStorage.getItem('token'),{
          cccode:this.code
        }).then(res => {
          if(res.data.status == 200){
            this.getUserCoupon();
            Toast(res.data.message);
          }else{
            Toast(res.data.message);
          }
        })
      },

    },
    mounted() {
      common.changeTitle('我的优惠券');
      this.getUserCoupon();            // 获取用户个人优惠券
    }
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>
  @import "../../../common/css/index";

  .m-coupon{
    min-height: 100vh;
    background-color: #fff;
    .m-nav {
      /*width: 600px;*/
      /*margin: 0 75px;*/
      margin-bottom: 20px;
    }
    .m-nav-list{
      padding: 0 80px;
    }
    .m-search-top{
      border-bottom: 1px solid @borderColor;
      padding: 20px 33px;

      .m-search-input-box{
        width: 684px;
        background-color: #eee;
        height: 50px;
        position: relative;
        input{
          position: absolute;
          top: 0;
          left:0;
          width: 530px;
          height: 50px;
          line-height: 50px;
          background-color: transparent;
          border: none;
          padding-left: 40px;
          font-size: 24px;
        }
        .m-icon-close{
          position: absolute;
          right: 115px;
          top:12.5px;
          width: 25px;
          height: 25px;
          background: url("/static/images/icon-search-close.png") no-repeat;
          background-size: 100% 100%;
        }
        .m-btn{
          position: absolute;
          right:0;
          top:5px;
          height: 40px;
          line-height: 40px;
          border-left: 1px solid #C1C1C1;
          padding: 0 20px;
          color: @mainColor;
        }
      }

    }
    .m-coupon-content{
      /*padding: 20px 0 0 0;*/
    }
  }
</style>
