<template>
  <div class="w-openmb">
    <!-- <div class="w-openmb-bg"></div> -->
    <div class="w-openmb-headbtn">
      <span class="w-openmb-headbtn-left">商品</span>
      <span class="w-openmb-headbtn-right">规则</span>
    </div>
    <div class="w-openmb-product">
      <div class="w-openmb-product-img">
        <img>
        <span class="w-openmb-product-orprice">原价¥333</span>
      </div>
      <div class="w-openmb-price">
        <span class="w-openmb-price-lowest">最低价¥100</span>
        <span class="w-openmb-price-current">当前价¥100</span>
        <span class="w-openmb-price-bought">可购价¥100</span>
      </div>
      <div class="w-openmb-choice">
        <span class="w-openmb-choice-a"></span>
        <span class="w-openmb-choice-b"></span>
        <span class="w-openmb-choice-c"></span>
      </div>
      <div class="w-openmb-tips">
        <span>点击任意一个帮好友拆盒</span>
      </div>
    </div>
    <div class="w-openmb-popup" v-if="false">
      <div class="w-openmb-popup-box">
        <span class="w-openmb-popup-text">您为您的好友减少了<span class="w-openmb-popup-num">5元</span>购买金额！</span>
        <span class="w-openmb-popup-btn">告诉好友</span>
      </div>
    </div>
    <!-- <mt-popup v-model="popupVisible"></mt-popup> -->
  </div>
</template>

<script>
  import {
    Popup
  } from 'mint-ui';
  export default {
    data() {
      return {
        popupVisible: true,

      }
    },


  }

</script>

<style lang="less" scoped>
  @import "../../../common/css/index";

  .w-openmb {
    width: 100%;
    height: 100%;

    //   position: fixed;
    //   width: 100%;
    //   height: 100%;
    //   left: 0;
    //   top: 0;
    background: url('./static/images/activity/mb-bg.png') no-repeat;
    background-size: 100% 100%;
    //   z-index: -1;


    .w-openmb-headbtn {
      width: 100%;
      padding-top: 30px;
      background-color: rgba(0, 0, 0, 0);
      .flex-row(space-between);

      .w-openmb-headbtn-left {
        display: inline-block;
        color: #fff;
        font-size: 28px;
        width: 56px;
        height: 40px;
        padding: 9px 25px;
        border: 5px solid #fff;
        border-radius: 0 30px 30px 0;
        border-left: none;

      }

      .w-openmb-headbtn-right {
        display: inline-block;
        color: #fff;
        font-size: 28px;
        width: 56px;
        height: 40px;
        padding: 9px 25px;
        border: 5px solid #fff;
        border-radius: 30px 0 0 30px;
        border-right: none;
      }
    }

    .w-openmb-product {
      width: 550px;
      height: 844px;
      margin: 130px 100px 600px;
      background-color: #fff;
      position: relative;

      .w-openmb-product-img {
        position: relative;
        width: 550px;
        height: 550px;
        background: red;

        .w-openmb-product-orprice {
          display: inline-block;
          position: absolute;
          bottom: 0;
          right: 0;
          width: 181px;
          height: 40px;
          background: #fff;
          border-radius: 40px 0 0 0;
        }
      }

      .w-openmb-price {
        height: 100px;
        .flex-row(space-between);
        border-bottom: 1px solid #F2F2F2;

        span {
          display: inline-block;
          width: 162px;
          height: 40px;
          font-size: 24px;
          line-height: 40px
        }

        .w-openmb-price-lowest {}

        .w-openmb-price-current {
          background: linear-gradient(90deg, @subColor 0%, @mainColor 100%);
          border-radius: 20px;

        }

        .w-openmb-price-bought {}
      }

      .w-openmb-choice {
        padding: 18px 50px 0;
        .flex-row(space-between);
        // span {
        //   display: inline-block;
        //   width: 100px;
        //   height: 100px;
        //   background: green;
        //   position: relative;
        //   font-color: #fff;
        // }

        // span:before {
        //   display: inline-block;
        //   content: "";
        //   position: absolute;
        //   top: 0;
        //   left: 0;
        //   border-bottom: 29px solid green;
        //   border-left: 29px solid #fff;
        //   border-right: 29px solid #fff;
        //   width: 42px;
        //   height: 0;
        // }

        // span:after {
        //   display: inline-block;
        //   content: "";
        //   position: absolute;
        //   bottom: 0;
        //   left: 0;
        //   border-top: 29px solid green;
        //   border-left: 29px solid #eee;
        //   border-right: 29px solid #eee;
        //   width: 42px;
        //   height: 0;
        // }
        .w-openmb-choice-a {
          display: inline-block;
          width: 130px;
          height: 130px;
          background: url('./static/images/activity/mb-a-on.png') no-repeat;
          background-size: 100% 100%;

          &.off {
            background: url('./static/images/activity/mb-a-off.png') no-repeat;
          }
        }

        .w-openmb-choice-b {
          display: inline-block;
          width: 130px;
          height: 130px;
          background: url('./static/images/activity/mb-b-off.png') no-repeat;
          background-size: 100% 100%;

          &.off {
            background: url('./static/images/activity/mb-b-off.png') no-repeat;
          }
        }

        .w-openmb-choice-c {
          display: inline-block;
          width: 130px;
          height: 130px;
          background: url('./static/images/activity/mb-c-on.png') no-repeat;
          background-size: 100% 100%;

          &.off {
            background: url('./static/images/activity/mb-c-off.png') no-repeat;
          }
        }
      }

      .w-openmb-tips {
        width: 550px;
        position: absolute;
        bottom: 0;
        font-size: 24px;
        font-weight: 300;
        color: @mainColor;
      }
    }

    .w-openmb-popup {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      background-color: rgba(0, 0, 0, 0.16);
      .flex-col(center, center);
      .w-openmb-popup-box {
        width: 450px;
        height: 165px;
        padding: 91px 85px 44px;
        background-color: #fff;
        .flex-col(space-between);
        .w-openmb-popup-text {
          display: inline-block;
          width: 450px;
          font-size: 28px;

          .w-openmb-popup-num {
            color: @mainColor;
          }
        }

        .w-openmb-popup-btn {
          display: inline-block;
          width: 230px;
          height: 60px;
          line-height: 60px;
          font-size: 28px;
          color: @mainColor;
          border: 1px solid @mainColor;
        }
      }
    }
  }

</style>
