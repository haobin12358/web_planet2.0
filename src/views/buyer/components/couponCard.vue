<template>
  <div>
    <div v-if="couponList.length > 0">
      <div class="m-coupon-card" :class="item.ready_collected ? 'm-have' : '' || item.navName == '已过期' ? 'm-had' : '' || item.navName == '已使用' ? 'm-have' : ''"
           v-for="(item, index) in couponList" @click="couponClick(item)">
        <img class="m-cancel-icon" v-if="!item.choose && circle" src="/static/images/icon-radio.png" @click="productCouponCancel('circle', index)">
        <img class="m-cancel-icon" v-if="item.choose && circle" src="/static/images/icon-radio-active.png" @click="productCouponCancel('circle', index)">
        <div>
          <div class="m-top">
            <img class="m-store-img" :class="item.navName == '已过期' ? 'm-had' : '' || item.navName == '已使用' ? 'm-have' : '' || item.ready_collected ? 'm-have' : ''"
                 :src="item.title_subtitle.left_logo" alt="">
            <div>
              <div v-if="item.codiscount == '10'">
                <span class="m-text-small">￥</span>
                <span class="m-text-big">{{item.cosubtration}}</span>
                <span class="m-text-small" v-if="item.cosubtration == 999">+</span>
                <span class="m-text-small">OFF</span>
              </div>
              <div  v-else>
                <span class="m-text-big">-{{item.codiscount}}</span>
                <span class="m-text-small">%OFF</span>
              </div>
              <p>{{item.title_subtitle.left_text}}</p>
            </div>
          </div>
          <div class="m-bottom">
            <div>
              <p class="m-flex-start">
                <img src="/static/images/coupon/coupon-card.png" class="m-icon" alt="">
                <span>{{item.covalidstarttime | time}}—{{item.covalidendtime | time}}</span>
              </p>
              <p class="m-flex-start">
                <img src="/static/images/coupon/coupon-time.png" class="m-icon" alt="">
                <span  v-if="item.codiscount == '10'" ><span v-if="item.codownline != 0"> 满{{item.codownline}}</span><span v-else>无限制</span>减{{item.cosubtration}}</span>
                <span  v-else >{{item.codiscount}}折</span>
              </p>
            </div>
            <span class="m-coupon-btn" v-if="item.ready_collected">去使用</span>
            <span class="m-coupon-btn" v-else-if="item.cocancollect && !item.ready_collected && !item.navName && !order && !circle" @click="getCoupon(index)">立即领取</span>
            <span class="m-coupon-btn" v-else-if="!item.cocancollect">不可领取</span>
<!--            <span class="m-coupon-btn" v-if="item.cocancollect && !item.ready_collected && !item.navName && !order && !circle">立即领取</span>-->
          </div>
        </div>
<!--        <div class="m-card-left">-->
<!--          <img class="m-store-img" :class="item.navName == '已过期' ? 'm-had' : '' || item.navName == '已使用' ? 'm-have' : '' || item.ready_collected ? 'm-have' : ''"-->
<!--               :src="item.title_subtitle.left_logo" alt="">-->
<!--          <div class="m-store-name">{{item.title_subtitle.left_text}}</div>-->
<!--        </div>-->
<!--        <div class="m-card-right">-->
<!--          <div class="m-card-time">{{item.covalidstarttime}}—{{item.covalidendtime}}</div>-->
<!--          <div class="m-card-detail">-->
<!--            <div class="m-detail-left" v-if="item.codiscount == '10'">-->
<!--              <span class="m-text-small">￥</span>-->
<!--              <span class="m-text-big">{{item.cosubtration}}</span>-->
<!--              <span class="m-text-small" v-if="item.cosubtration == 999">+</span>-->
<!--            </div>-->
<!--            <div class="m-detail-left m-space" v-else>-->
<!--              <span class="m-text-big">{{item.codiscount}}</span>-->
<!--              <span class="m-text-small">折</span>-->
<!--            </div>-->
<!--            <div class="m-detail-right">-->
<!--              <div>{{item.title_subtitle.title}}</div>-->
<!--              <div class="m-subtitle">{{item.title_subtitle.subtitle}}</div>-->
<!--              <div class="m-detail-btn" v-if="item.cocancollect && !item.ready_collected && !item.navName && !order && !circle" @click="getCoupon(index)">点击领取</div>-->
<!--              <div class="m-detail-btn" v-if="!item.cocancollect">不可领取</div>-->
<!--              <div class="m-detail-btn" v-if="item.ready_collected">已领取</div>-->
<!--              <div class="m-detail-btn" v-if="item.navName">{{item.navName}}</div>-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->
      </div>
    </div>
<!--    <div class="m-no-coupon" v-if="couponList.length == 0 && !circle">-->
<!--      <span class="m-no-img"></span>-->
      <p class="m-no-data" v-if="couponList.length == 0 && !circle">暂时还没有优惠券哦~</p>
<!--    </div>-->
  </div>
</template>

<script>
  export default {
    data() {
      return {

      }
    },
    props: {
      couponList: { type: Array, default: null },
      order: { type: Boolean, default: false },
      circle: { type: Boolean, default: false }
    },
    methods: {
      // 优惠券选择
      couponClick(item){
        this.$emit('couponClick',item);
      },
      // 点击领取优惠券
      getCoupon(index) {
        this.$emit('getCoupon', index);
      },
      // 选择优惠券
      productCouponCancel(which, index) {
        this.$emit('productCouponCancel', which, index);
      }
    },
    mounted() {
      // console.log(this.couponList);
    },
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  @import "../../../common/css/index";

  .m-coupon-card{
    position: relative;
    display: flex;
    justify-content: space-between;
    width: 750px;
    height: 310px;
    margin: 0 0 5px 0;
    box-sizing: border-box;
    padding: 25px 64px;
    background: url("/static/images/coupon/coupon-can.png") no-repeat;
    background-size: 100% 100%;
    .m-coupon-btn{
      display: inline-block;
      width: 150px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      border: 1px solid @mainColor;
      color: @mainColor;
    }
    &.m-had {
      background: url("/static/images/coupon/coupon-done.png") no-repeat;
      background-size: 100% 100%;
    }
    &.m-have {
      background: url("/static/images/coupon/coupon-cancel.png") no-repeat;
      background-size: 100% 100%;
      .m-coupon-btn{
        border: 1px solid #C1C1C1;
        color: #C1C1C1;
      }
    }
    .m-cancel-icon {
      width: 45px;
      height: 45px;
      position: absolute;
      top: -20px;
      right: -10px;
    }
    .m-top{
      height: 180px;
      width: 620px;
      color: #fff;
      font-size: 24px;
      text-align: right;
      .flex-row(space-between);
      .m-store-img {
        width: 100px;
        height: 100px;
        background: #ffffff;
        /*box-shadow: 2px 3px 6px rgba(0,0,0,0.16);*/
        border-radius: 50%;
        &.m-had {
          opacity: 0.3;
        }
        &.m-have {
          opacity: 0.5;
        }
      }
      .m-text-big{
        font-size: 76px;
        font-weight: 600;
      }
      .m-text-small{
        font-weight: 400;
        font-size: 40px;
      }
    }
    .m-bottom{
      .flex-row(space-between);
      color: #C1C1C1;
      font-size: 24px;
      text-align: left;
      .m-icon{
        display: inline-block;
        width: 30px;
        height: 30px;
        margin-right: 20px;
      }
    }
    .m-card-left {
      margin: 20px 0 0 45px;
      width: 150px;
      text-align: center;
      .m-store-img {
        width: 100px;
        height: 100px;
        background: #ffffff;
        box-shadow: 2px 3px 6px rgba(0,0,0,0.16);
        border-radius: 10px;
        &.m-had {
          opacity: 0.3;
        }
        &.m-have {
          opacity: 0.5;
        }
      }
      .m-store-name {
        color: #ffffff;
        font-size: 18px;
        text-align: center;
        width: 150px;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
      }
    }
    .m-card-right {
      width: 68%;
      color: #ffffff;
      font-size: 18px;
      margin: 15px 10px 0 0;
      .m-card-time {
        margin-bottom: 5px;
        text-align: right;

      }
      .m-card-detail {
        display: flex;
        justify-content: space-between;
        .m-detail-left {
          /*margin-top: -10px;*/
          width: 290px;
          text-align: center;
          .m-text-small{
            font-size: 46px;
          }
          .m-text-big {
            font-size: 90px;
            font-weight: bold;
          }
          &.m-space {
            margin-left: 50px;
          }
        }
        .m-detail-right {
          display: flex;
          text-align: center;
          align-items: center;
          flex-direction: column;
          .m-subtitle {
            width: 180px;
            white-space: nowrap;
            /*text-indent: 2em;*/
            overflow: hidden; // 超出的文本隐藏
            text-overflow: ellipsis;    // 溢出用省略号显示
          }
          .m-detail-btn {
            width: 96px;
            height: 25px;
            line-height: 29px;
            font-size: 22px;
            padding: 5px 16px;
            text-align: center;
            margin-top: 10px;
            border: 1px solid rgba(255,255,255,1);
            border-radius: 30px;
          }
        }
      }
    }
  }
</style>
