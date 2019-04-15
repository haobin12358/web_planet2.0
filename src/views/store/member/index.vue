<template>
  <div class="m-member">
    <!--搜索-->
    <div class="m-selected-search">
      <div class="m-search-input-box" @click="changeRoute('/search')">
        <span class="m-icon-search"></span>
        <span>搜索品牌/商品</span>
      </div>
    </div>
    <div class="m-img-box">
      <img class="m-member-img" src="http://hsingfo-curtain.com/images/Banner/635450965258533382.jpg" alt="">
      <div class="m-img-text-box">
        <div class="m-img-text"><span class="m-img-text-bold">25</span> Spt</div>
        <div class="m-img-text">九月 / 星期二</div>
      </div>
    </div>
    <!--内容-->
    <div class="m-product-content">
      <div class="m-product-part" @click="changeRoute('/member/productDetail')">
        <div class="m-part-left">
          <img class="m-product-img" src="http://dummyimage.com/200x200" alt="">
        </div>
        <div class="m-part-right">
          <div class="m-right-row">
            <div class="m-product-name">哑铃</div>
          </div>
          <div class="m-product-description">商品描述活动描述商品描述活动描述商品描述活动描述商品描述活动描述商品</div>
          <div class="m-price-share">
            <div class="m-product-price">押金：<span class="m-price-time">3个月500元</span></div>
            <img class="m-share-img" src="/static/images/icon-gray-share.png" alt="" @click="productShare">
            <div class="m-share-text" @click="productShare">分享</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data() {
      return {
        name: ''
      }
    },
    components: {},
    methods: {
      // 跳转其他页面的方法
      changeRoute(v) {
        this.$router.push(v)
      },
      // 商品分享按钮
      productShare() {
        console.log("share");
      }
    },
    created() {

    }
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>
  @import "../../../common/css/index";

  .m-member {
    min-height: 100%;
    .m-search-input-box {
      width: 680px !important;
    }
    .m-swipe{
      padding: 0 33px;
      /*margin: auto;*/
    }
    .m-img-box {
      .m-member-img {
        width: 750px;
        height: 180px;
      }
      .m-img-text-box {
        position: absolute;
        left: 50px;
        top: 120px;
        text-align: left;
        .m-img-text {
          color: #333333;
          font-size: 40px;
        }
        .m-img-text-bold {
          font-size: 60px;
          font-weight: bold;
        }
      }
    }
    .m-product-content {
      padding: 70px 50px 0 50px;
    }
  }
</style>
