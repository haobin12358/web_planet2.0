<template>
  <div class="m-member-detail">
    <div class="m-member-swipe">
      <mt-swipe :auto="2000" >
        <mt-swipe-item>
          <img src="" class="m-swipe-img" alt="">
        </mt-swipe-item>
        <mt-swipe-item>
          <img src="" class="m-swipe-img" alt="">
        </mt-swipe-item>
        <mt-swipe-item>
          <img src="" class="m-swipe-img" alt="">
        </mt-swipe-item>
      </mt-swipe>
    </div>
    <!--商品详情的文字信息-->
    <div class="m-detail-text">
      <div class="m-text-row">
        <div class="m-text-name">哑铃</div>
        <div class="m-text-price">押金：￥500.00</div>
      </div>
      <div class="m-text-row">
        <div class="m-text-description">商品描述活动描述商品描述活动描述商品描述活动描述商品描述活动描述商品</div>
        <div class="m-text-time">（<span class="m-time-bold">3个月</span>）</div>
      </div>
      <div class="m-text-row">
        <div class="m-text-courier">快递：6.00</div>
      </div>
    </div>
    <!--选择sku-->
    <div class="m-text-row m-sku-row">
      <div class="m-text-courier">规格</div>
      <div class="m-text-description">选择 颜色分类 重量</div>
      <img class="m-right-img" src="/static/images/icon-right.png" alt="">
    </div>
    <div class="m-detail-img-box">
      <img class="m-detail-img" src="http://dummyimage.com/750x750" alt="">
      <img class="m-detail-img" src="http://dummyimage.com/750x1000" alt="">
    </div>
  </div>
</template>

<script>
  import common from '../../../common/js/common';

  export default {
    name: "productDetail",
    data() {
      return {}
    },
    components: {},
    methods: {
      // 商品sku
      changeModal() {
        console.log("商品sku");
      },
    },
    mounted() {
      common.changeTitle('详情');
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  @import "../../../common/css/index";

  .m-member-detail {
    .m-member-swipe{
      position: relative;
      width: 750px;
      height: 700px;
    }
    .m-detail-text {
      padding: 25px 25px 15px 30px;
      box-shadow: 0 3px 6px rgba(0,0,0,0.16);
    }
    .m-text-row {
      display: flex;
      justify-content: space-between;
      .m-text-name {
        font-size: 30px;
        font-weight: bold;
      }
      .m-text-price {
        color: #C70000;
        font-size: 30px;
        font-weight: bold;
      }
      .m-text-description {
        font-size: 24px;
        text-align: left;
        width: 500px;
        padding: 0 0 15px 0;
      }
      .m-text-time {
        color: #C70000;
        font-size: 30px;
        .m-time-bold {
          font-weight: bold;
        }
      }
      .m-text-courier {
        color: #999999;
        font-size:24px;
      }
      .m-right-img {
        width: 15px;
        height: 24px;
        padding-top: 5px;
      }
    }
    .m-sku-row {
      padding: 30px 30px 10px 30px;
      box-shadow: 0 3px 6px rgba(0,0,0,0.16);
    }
    .m-detail-img-box {
      .m-detail-img {
        width: 750px;
        margin-bottom: -5px;
      }
    }
  }
</style>
