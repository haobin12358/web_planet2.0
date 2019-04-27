<template>
  <div class="m-couponCenter" @touchmove="touchMove">
    <mt-loadmore :top-method="loadTop">
      <div class="m-couponCenter-top">
        <span class="m-couponCenter-rule" @click="rulePopup = true">星币规则</span>

        <!--星币规则popup-->
        <mt-popup class="m-rule-popup" v-model="rulePopup" pop-transition="popup-fade">
          <div class="m-rule-btn">
            <div @click="rulePopup = false">取消</div>
          </div>
          <div class="m-rule-text">{{integral.integralrule}}</div>
        </mt-popup>

        <p class="m-couponCenter-top-p">累计星币：{{integral.usintegral}}</p>
        <div class="m-couponCenter-day">
          <span>已连续签到</span>
          <span class="m-couponCenter-day-bg">
          <span class="m-line"></span>
          <span class="m-num">{{one}}</span></span>
          <span class="m-couponCenter-day-bg">
          <span class="m-line"></span>
          <span class="m-num">{{two}}</span></span>
          <span class="m-couponCenter-day-bg">
          <span class="m-line"></span>
          <span class="m-num">{{three}}</span></span>
          <span>天</span>
        </div>
        <div class="m-couponCenter-week">
          <!--每周哪几天签到-->
          <!--<span class="m-circle active">1</span>
          <span class="m-circle-line"></span>
          <span class="m-circle">2</span>
          <span class="m-circle-line"></span>
          <span class="m-circle">3</span>
          <span class="m-circle-line"></span>
          <span class="m-circle">4</span>
          <span class="m-circle-line"></span>
          <span class="m-circle">5</span>
          <span class="m-circle-line"></span>
          <span class="m-circle">6</span>
          <span class="m-circle-line"></span>
          <span class="m-circle">7</span>-->
          <span class="m-couponCenter-week-btn" v-if="!signIn" @click="userSignIn">签到</span>
          <span class="m-couponCenter-week-btn active" v-if="signIn">已签到</span>
        </div>
      </div>
      <div class="m-couponCenter-content">
        <div class="m-nav">
          <nav-list :navlist="nav_list" :isScroll="true" @navClick="navClick"></nav-list>
        </div>
        <div class="m-couponCenter-content-ul">
          <coupon-card :couponList="couponList" @getCoupon="getCoupon"></coupon-card>
        </div>
      </div>
      <bottom-line v-if="bottom_show"></bottom-line>
    </mt-loadmore>
  </div>
</template>

<script type="text/ecmascript-6">
  import navList from '../../../components/common/navlist';
  import couponCard from '../components/couponCard';
  import common from '../../../common/js/common';
  import axios from 'axios';
  import api from '../../../api/api';
  import { Toast } from 'mint-ui';
  import bottomLine from '../../../components/common/bottomLine';

  export default {
    data() {
      return {
        nav_list: [],
        signIn: false,            // 是否已签到
        couponList: [],           // 优惠券list
        itid: "",                 // 暂存itid
        page_num: 1,
        page_size: 10,
        isScroll: true,
        total_count: 0,
        bottom_show: false,
        integral: {},             // 顶部数据对象
        one: "0",
        two: "0",
        three: "0",
        rulePopup: false,
      }
    },
    inject:['reload'],
    components: { navList, couponCard, bottomLine },
    methods: {
      // navList点击事件
      navClick(index){
        this.page_num = 1;
        this.total_count = 0;
        this.bottom_show = false;

        let arr = [].concat(this.nav_list);
        for(let i=0;i<arr.length;i++){
          arr[i].active = false;
        }
        arr[index].active = true;
        this.itid = arr[index].itid;
        this.couponList = [];
        this.getUserCoupon();      // 获取优惠券列表
        this.nav_list = [].concat(arr);
      },
      // 用户签到
      userSignIn() {
        axios.post(api.user_sign_in + '?token=' + localStorage.getItem('token')).then(res => {
          if(res.data.status == 200){
            Toast(res.data.message);
            this.signIn = true;

            this.getDiscount();         // 获取优惠券中心顶部数据
          }
        });
      },
      // 获取优惠券中心顶部数据
      getDiscount() {
        axios.get(api.get_discount + "?token=" + localStorage.getItem("token")).then(res => {
          if(res.data.status == 200){
            this.integral = res.data.data;
            this.signIn = res.data.data.signin_today;
            let length = res.data.data.uscontinuous.toString().length;
            if(length == 1) {
              this.one = "0";
              this.two = "0";
              this.three = res.data.data.uscontinuous;
            }else if(length == 2) {
              this.one = "0";
              this.two = res.data.data.uscontinuous.toString().substr(0, 1);
              this.three = res.data.data.uscontinuous.toString().substr(1, 1);
            }else if(length == 3) {
              this.one = res.data.data.uscontinuous.toString().substr(0, 1);
              this.two = res.data.data.uscontinuous.toString().substr(1, 1);
              this.three = res.data.data.uscontinuous.toString().substr(2, 1);
            }else if(length == 4) {
              this.one = "9";
              this.two = "9";
              this.three = "9";
            }
          }
        });
      },
      // 获取标签列表
      getItems() {
        let params = { ittype: 20 };
        axios.get(api.items_list, { params: params }).then(res => {
          if(res.data.status == 200){
            this.nav_list = res.data.data;
            for(let i = 0; i < this.nav_list.length; i ++) {
              this.nav_list[i].name = this.nav_list[i].itname;
              this.nav_list[i].active = false;
              this.nav_list[0].active = true;
            }
            this.itid = this.nav_list[0].itid;
            this.getUserCoupon();         // 获取优惠券列表
          }
        });
      },
      // 获取优惠券列表
      getUserCoupon() {
        let params = {
          token: localStorage.getItem('token'),
          itid: this.itid,
          page_num : this.page_num,
          page_size : this.page_size
        };
        axios.get(api.coupon_list, { params: params }).then(res => {
          if(res.data.status == 200) {
            this.isScroll = true;
            if(res.data.data.length > 0) {
              if(this.page_num > 1) {     // 把新数据给list续上
                this.couponList = this.couponList.concat(res.data.data);
              }else{
                this.couponList = res.data.data;
              }
              this.page_num = this.page_num + 1;
              this.total_count = res.data.total_count;
            }
            for(let i = 0; i < this.couponList.length; i ++) {
              if(this.couponList[i].title_subtitle.left_text.length > 8) {
                this.couponList[i].title_subtitle.left_text = this.couponList[i].title_subtitle.left_text.substring(0, 8) + "..";
              }
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
      // 点击领取优惠券
      getCoupon(index) {
        axios.post(api.coupon_fetch + '?token=' + localStorage.getItem('token'), { coid: this.couponList[index].coid }).then(res => {
          if(res.data.status == 200){
            Toast("领取成功");
            this.couponList[index].ready_collected = true;
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
      }
    },
    mounted() {
      common.changeTitle('优惠中心');
      this.getDiscount();         // 获取优惠券中心顶部数据
      this.getItems();            // 获取标签列表
    }
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>
  @import "../../../common/css/index";

  .m-couponCenter{
    .m-couponCenter-top{
      width: 100%;
      height: 300px;
      background: url("/static/images/newpersonal/icon-wallet-bc.png");
      background-size: 100% 100%;
      text-align: left;
      position: relative;
      color: #fff;
      .m-couponCenter-top-p{
        padding: 30px 0 24px 63px;
      }
      .m-couponCenter-rule{
        position: absolute;
        right: 0;
        top: 90px;
        width: 30px;
        padding: 20px 0;
        border-top-left-radius: 10px;
        border-bottom-left-radius: 10px;
        background-color: #fff;
        box-shadow:0 3px 6px rgba(0,0,0,0.16);
        font-size: 18px;
        text-align: center;
        color: #000;
      }
      .m-rule-popup {
        width: 700px;
        height: 500px;
        margin: -300px 0 0 25px;
        border-radius: 30px;
        .m-rule-btn{
          display: flex;
          justify-content: flex-end;
          font-size: 28px;
          padding: 20px 30px;
        }
        .m-rule-text {
          font-size: 24px;
          text-indent: 2em;
          padding: 20px 50px;
          line-height: 40px;
        }
      }
      .m-couponCenter-day{
        margin-left: 125px;
        .m-couponCenter-day-bg{
          display: inline-block;
          width: 87px;
          height: 133px;
          line-height: 138px;
          font-size: 90px;
          font-weight: 400;
          background-color: #fff;
          border-radius: 10px;
          text-shadow:0 3px 6px rgba(0,0,0,0.16);
          box-shadow:0 3px 6px rgba(0,0,0,0.16);
          vertical-align: text-bottom;
          margin: 0 4px;
          position: relative;
          .m-line{
            position: absolute;
            top: 48%;
            left: 0;
            width: 87px;
            height: 1px;
            border-top: 1px solid #e9e9e9;
            margin: 0;
            z-index: 0;
          }
          .m-num{
            position: absolute;
            top: 5px;
            left: 21px;
            z-index: 100;
          }
        }
      }
      .m-couponCenter-week{
        text-align: right;
        margin-top: 20px;
        padding-right: 40px;
        .m-circle{
          display: inline-block;
          width: 20px;
          height: 20px;
          background-color: #fff;
          border-radius: 50%;
          font-size: 18px;
          color: #ccc;
          box-shadow:0 3px 6px rgba(0,0,0,0.16);
          text-align: center;
          &.active{
            width: 30px;
            height: 30px;
            line-height: 30px;
            background-color: @mainColor;
            color: #333;
          }
        }
        .m-circle-line{
          display: inline-block;
          width: 50px;
          height: 4px;
          background-color: #fff;
          margin-bottom: 6px;
          margin-left: -8px;
          margin-right: -8px;
          box-shadow:0 3px 6px rgba(0,0,0,0.16);
        }
        .m-couponCenter-week-btn{
          display: inline-block;
          width: 150px;
          height: 40px;
          line-height: 43px;
          background-color: #fff;
          text-align: center;
          font-size: 21px;
          border-radius: 30px;
          box-shadow: 0 3px 6px rgba(0,0,0,0.16);
          margin-left: 50px;
          color: #000;
          &.active {
            opacity: 0.5;
          }
        }
      }
    }
    .m-couponCenter-content{
      .m-nav{
        width: 100%;
        overflow-x: auto;
        overflow-y: hidden;
        margin: 20px 0 20px 0;

      }
      .m-couponCenter-content-ul{
        /*padding: 20px 72px;*/
      }
    }
  }

</style>
