<template>
    <div class="m-discount-components">
      <span class="m-label">全平台</span>
      <div class="m-discount-num">100</div>
      <div class="m-discount-condition">满128元可用</div>
      <div class="m-discount-info">全平台均可使用
        全平台均可使...</div>
      <div class="m-discount-btn">立即领取</div>
      <div class="m-discount-line"></div>
    </div>
</template>

<script>
    export default {
        name: "discount"
    }
</script>

<style scoped lang="less">
  @import "../../common/css/index";
.m-discount-components{
  position: relative;
  width: 200px;
  height: 300px;
  background: url("/static/images/index/discount-bg.png") no-repeat;
  background-size: 100% 100%;
  /*margin-left: 20px;*/
  text-align: center;
  .m-label{
    position: absolute;
    top:0;
    left: 0;
    width: 80px;
    border-bottom-right-radius: 20px;
    font-size: 20px;
    color: #fff;
  }
  .m-discount-num{
    font-size: 52px;
    padding: 55px 0 0;
    color: @mainColor;
    font-weight: 600;
    .m-word{
      font-size: 32px;
    }
  }
  .m-discount-condition{
    color: @mainColor;
    font-size: 24px;
  }
  .m-discount-info{
    width: 130px;
    color: #c1c1c1;
    font-size: 20px;
    margin: 20px 0 0 32px;
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient:vertical;
  }
  .m-discount-btn{
    position: absolute;
    bottom:0;
    left:0;
    width: 100%;
    height: 52px;
    line-height: 52px;
    font-weight: 500;
    font-size: 28px;
    color: #fff;
  }
  .m-discount-line{
    width: 100%;
    position: absolute;
  }
  &.m-brand{
    background: url("/static/images/index/discount-bg-brand.png") no-repeat;
    background-size: 100% 100%;
    .m-discount-num{
      color: #000;
    }
    .m-discount-condition{
      color: #000;
    }
  }
  &.m-zhe{
    background: url("/static/images/index/discount-bg-zhe.png") no-repeat;
    background-size: 100% 100%;
    .m-discount-num{
      color: #E67E22;
    }
    .m-discount-condition{
      color: #E67E22;
    }
  }
}
</style>
