<template>
    <div class="m-new-personal">
      <div class="m-personal-item m-personal-head m-flex-start">
        <img :src="user.usheader" class="m-person-avator" alt="">
        <div class="m-person-head-text">
          <div class="m-flex-end">
            <img src="/static/images/newpersonal/icon-code-small.png" class="m-person-code" alt="" @click="changeRoute('/personal/code')">
          </div>
          <div v-if="user.usname == '登录 / 注册'">
            <span class="m-login-btn" @click="showLogin">{{user.usname}}</span>
          </div>
          <div v-else>
            <p class="m-flex-start">
              <span class="m-user-name">{{user.usname}}</span>
              <img src="/static/images/newpersonal/sex-woman.png" v-if="user.usgender == 1" class="m-person-sex" alt="">
              <img src="/static/images/newpersonal/sex-man.png" v-else class="m-person-sex" alt="">
            </p>
            <p>
              <span class="m-person-level">{{user.usidname}}</span>
            </p>
          </div>
          <div class="m-flex-end" @click="changeRoute('/personal/mainIndex')">
            <span>个人主页</span>
            <img src="/static/images/newpersonal/icon-more.png" class="m-more" alt="">
          </div>
        </div>
      </div>
      <div class="m-personal-item">
        <ul class="m-person-ul">
          <li class="m-flex-between" @click="changeRoute('/collect')">
            <div class="m-flex-start">
              <img src="/static/images/newpersonal/icon-select.png" class="m-icon" alt="">
              <span>收藏</span>
            </div>
          </li>
<!--          <li class="m-flex-between" @click="changeRoute('/personal/myMessage')">-->
<!--            <div class="m-flex-start">-->
<!--              <img src="/static/images/newpersonal/icon-message.png" class="m-icon" alt="">-->
<!--              <span>消息</span>-->
<!--            </div>-->
<!--            <span class="m-info">{{user.usunread}}</span>-->
<!--          </li>-->
          <li class="m-flex-between" @click="changeRoute('/orderList')">
            <div class="m-flex-start">
              <img src="/static/images/newpersonal/icon-order.png" class="m-icon" alt="">
              <span>订单</span>
            </div>
            <span class="m-red">{{user.ordercount}}</span>
          </li>
<!--          <li class="m-flex-between" @click="changeRoute('/orderList')">-->
<!--            <div class="m-flex-start">-->
<!--              <img src="/static/images/newpersonal/icon-track.png" class="m-icon" alt="">-->
<!--              <span>足迹</span>-->
<!--            </div>-->
<!--          </li>-->
        </ul>
      </div>
      <div class="m-personal-item">
        <ul class="m-person-ul">
          <li class="m-flex-between" @click="changeRoute('/personal/myWallet')">
            <div class="m-flex-start">
              <img src="/static/images/newpersonal/icon-wallet.png" class="m-icon" alt="">
              <span>我的钱包</span>
            </div>
            <span class="m-info">¥{{user.usbalance}}</span>
          </li>
          <li class="m-flex-between" @click="changeRoute('/personal/starProduct')">
            <div class="m-flex-start">
              <img src="/static/images/newpersonal/icon-star.png" class="m-icon" alt="">
              <span>星币商城</span>
            </div>
            <span class="m-info" v-if="user.signin"><img src="/static/images/newpersonal/icon-star-can.png" class="m-icon-star" alt="">{{user.usintegral}}</span>
            <span class="m-btn" v-else @click.stop="userSignIn">签  到</span>
          </li>
          <li class="m-flex-between" @click="changeRoute('/personal/coupon')">
            <div class="m-flex-start">
              <img src="/static/images/newpersonal/icon-coupon.png" class="m-icon" alt="">
              <span>优惠中心</span>
            </div>
          </li>
<!--          <li class="m-flex-between" @click="changeRoute('/activityOrder')">-->
<!--            <div class="m-flex-start">-->
<!--              <img src="/static/images/newpersonal/icon-gift.png" class="m-icon" alt="">-->
<!--              <span>我的活动</span>-->
<!--            </div>-->
<!--          </li>-->
          <li class="m-flex-between" @click="goStore">
            <div class="m-flex-start">
              <img src="/static/images/newpersonal/icon-store.png" class="m-icon" alt="">
              <span>我是店主</span>
            </div>
          </li>
        </ul>
      </div>
      <div class="m-personal-item">
        <ul class="m-person-ul">
          <li class="m-flex-between" @click="changeRoute('personal/serviceCenter')">
            <div class="m-flex-start">
              <img src="/static/images/newpersonal/icon-service.png" class="m-icon" alt="">
              <span>客服中心</span>
            </div>
          </li>
          <li class="m-flex-between" @click="changeRoute('personal/safeCenter')">
            <div class="m-flex-start">
              <img src="/static/images/newpersonal/icon-safe.png" class="m-icon" alt="">
              <span>安全中心</span>
            </div>
          </li>
          <li class="m-flex-between" @click="changeRoute('/personal/setUp')">
            <div class="m-flex-start">
              <img src="/static/images/newpersonal/icon-set.png" class="m-icon" alt="">
              <span>设置中心</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
</template>

<script>
  import common from '../../../common/js/common';
  import api from '../../../api/api'
  import { Toast } from 'mint-ui';
  import axios from 'axios';
    export default {
        name: "newIndex",
      data(){
          return{
            user: { usheader: '', usname: '登录 / 注册'},               // 个人信息
            signIn:false
          }
      },
      mounted() {
        common.changeTitle('我的');
        // while (localStorage.getItem('token')){
        //   this.getUser();             // 获取个人信息
        // }倒计时
        const TIME_COUNT = 1;
        let count = TIME_COUNT;
        let time = setInterval(() => {
          if(localStorage.getItem('token')){
            this.getUser();
            clearInterval(time);
          }
          if(count > 0 && count <= TIME_COUNT) {
            count --;
          }else {
            this.getUser();
            clearInterval(time);
          }
        }, 300);
      },
      activated() {
        // while (localStorage.getItem('token')){
        //   this.getUser();             // 获取个人信息
        // // }
        // const TIME_COUNT = 1;
        // let count = TIME_COUNT;
        // let time = setInterval(() => {
        //   if(localStorage.getItem('token')){
        //     this.getUser();
        //     clearInterval(time);
        //   }
        //   if(count > 0 && count <= TIME_COUNT) {
        //     count --;
        //   }else {
        //     this.getUser();
        //     clearInterval(time);
        //   }
        // }, 300);
        // if(localStorage.getItem('back')) {
        //   localStorage.removeItem('back');
        //   this.$router.push('/personal/afterSales')
        // }
        if(sessionStorage.getItem('shop')) {
          this.$router.push('/shop');
          sessionStorage.removeItem('shop')
        }
      },
      methods:{
        // 跳转页面
        changeRoute(v, which){
          if(v == '/login'){
            this.$store.state.show_login = true;
            return false;
          }
          if(which) {
            this.$router.push({ path: v,query: { which: which}});
          }else {
            this.$router.push(v);
          }
        },
        //显示登录
        showLogin(){
          this.$store.state.show_login = true;
          return false;
        },
        //去往我的店主
        goStore() {
          axios.get(api.get_home + "?token=" + localStorage.getItem('token')).then(res => {
            if(res.data.status == 200) {
              if(res.data.data.uslevel == "1") {            // 1 - 买家 - 去商家大礼包list页面
                this.$router.push("/giftBox");
              }else if(res.data.data.uslevel == "2") {      // 2 - 卖家 - 去卖家版首页
                // this.$router.push("material/circle");
                // this.$router.push("/giftBox");
                this.$router.push({path:"/storekeeper"});
              }else if(res.data.data.uslevel == "3" || res.data.data.uslevel == "4" ) {      // 3 - 申请成为卖家中
                // this.$router.push("storekeeper/applyOwner");
                this.$router.push({path:"/storekeeper"});
              }
              // else if(res.data.data.uslevel == "4") {      // 4 - 已购买大礼包，但是未认证 - 去认证
              //   Toast('请完成店主身份认证');
              //   this.$router.push("storekeeper/IDCardApprove");
              // }
            }
          });
        },
        // 获取个人信息
        getUser() {
          axios.get(api.get_home + "?token=" + localStorage.getItem('token')).then(res => {
            if(res.data.status == 200){
              this.user = res.data.data;
              // this.moneyNum = this.user.usbalance;
              // this.moneyNum = this.user.uscash;
              // this.moneyNumTemp = JSON.parse(JSON.stringify(this.moneyNum));
              // this.getOrderCount();       // 获取订单数量
              // this.usidentification = res.data.data.usidentification;
              // if(res.data.data.uslevel == 2) {
              //   this.store = '转换店主'
              // }else {
              //   this.store = '成为店主'
              // }
            }else{
              this.user = { usheader: '', usname: '登录 / 注册'}
            }
          })
        },
        // 用户签到
        userSignIn() {
          axios.post(api.user_sign_in + '?token=' + localStorage.getItem('token')).then(res => {
            if(res.data.status == 200){
              Toast(res.data.message);
              this.user.signin = true;
              this. getUser();         //
            }
          });
        },
      }
    }
</script>

<style scoped lang="less">
  @import "../../../common/css/index";
  .m-new-personal{
    padding-bottom: 110px;
    .m-personal-item{
      background-color: #fff;
      /*padding: 0 50px 0 65px;*/
      border-bottom: 10px solid  #F4F4F4;
    }
    .m-personal-head{
      padding: 45px 50px 45px 65px;
      .m-person-avator{
        display: block;
        width: 150px;
        height: 150px;
        border-radius: 50%;
        margin-right: 30px;
        background-color: #22A7D2;
      }
      .m-person-head-text{
        width: 446px;
        text-align: left;
        .m-person-code{
          display: inline-block;
          width: 30px;
          height: 30px;

        }
        .m-login-btn{
          display: inline-block;
          color: #fff;
          background-color: @mainColor;
          border-radius: 25px;
          padding: 4px 20px;
        }
        .m-person-sex{
          display: inline-block;
          width: 30px;
          height: 30px;
          margin-left: 10px;
        }
        .m-user-name{
          font-size: 36px;
          color: #333;
        }
        .m-person-level{
          color: @mainColor;
          font-size: 16px;
          display: inline-block;
          /*width: 80px;*/
          padding: 3px 16px;
          /*height: 22px;*/
          border: 1px solid @mainColor;
          margin-top: 10px;
        }
        .m-more{
          display: inline-block;
          width: 17px;
          height: 30px;
          margin-left: 8px;
        }
      }
    }
    .m-person-ul{
      li{
        padding: 28px 50px 28px 65px;
        border-bottom: 1px solid #F2F2F2;
        color: #000;
        font-size: 28px;
        .m-icon{
          display: inline-block;
          width: 30px;
          height: 30px;
          margin-right: 20px;
        }
        .m-info{
          color: #C1C1C1;
          .flex-row(flex-end);
          .m-icon-star{
            display: inline-block;
            width: 30px;
            height: 30px;
            margin-right: 4px;
          }
        }
        .m-red{
          color: #C70000;
          font-size: 21px;
        }
        .m-btn{
          display: inline-block;
          width: 120px;
          height: 40px;
          line-height: 40px;
          color: #fff;
          background:linear-gradient(90deg,@subColor 0%,@mainColor 100%);
        }
      }
    }
  }
</style>
