<template>
  <div class="m-one-group">
    <img src="" class="m-one-group-img" alt="">
    <div class="m-product-info">
      <p class="m-product-title">TAWA防水帐篷户外野营必备…</p>
      <p>押金 ¥ 100.0</p>
      <div class="m-flex-start">
        <span class="m-one-num active">8</span>
        <span class="m-one-num">?</span>
        <span class="m-one-num">?</span>
      </div>
    </div>
    <div class="m-user-box">
      <div class="m-avator-box">
<!--        m-four  四个-->
<!--        m-two 两个-->
          <span  class="m-avator active">
             <img src="" alt="">
          </span>
          <span  class="m-avator "><img src="" alt=""></span>
        <span  class="m-avator "><img src="" alt=""></span>
      </div>
      <p class="m-main-color">我发起的</p>
    </div>
  </div>
</template>

<script>
    export default {
        name: "group"
    }
</script>

<style scoped lang="less">
  @import "../../../common/css/index";
  .m-one-group{
    padding: 17px 24px;
    border-bottom: 1px solid #F2F2F2;
    display: flex;
    flex-flow: row;
    align-items: center;
    justify-content: flex-start;
    .m-main-color{
      color: @mainColor;
    }
    .m-group-btn{
      color: @mainColor;
      display: inline-block;
      width: 150px;
      height: 40px;
      border: 1px solid @mainColor;
      text-align: center;
    }
    .m-one-group-img{
      display: block;
      width: 120px;
      height: 120px;
      margin-right: 20px;
    }
    .m-product-info{
      height: 120px;
    .flex-col(space-between,flex-start);
    .m-product-title{
      font-size: 28px;
      font-weight: 400;
      width: 380px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .m-one-num{
      display: block;
      background: #F4F4F4;
      border: 1px solid #c1c1c1;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      text-align: center;
      line-height: 40px;
      color: #C1C1C1;
      font-weight: 600;
      font-size: 28px;
      margin-right: 10px;
    &.active{
       background: linear-gradient(180deg,@mainColor 0%,@subColor 100%);
       color: #fff;
       border: 1px solid transparent;
     }
    }
    }
    .m-user-box{
      margin-left: 20px;
    .flex-col(space-between,flex-end);
      height: 120px;
      text-align: right;
      width: 150px;
      .m-avator-box{
        position: relative;
        height: 60px;
      .m-avator{
        position: absolute;
        right: 0;
        top: 0;
        width: 60px;
        height: 60px;
        background-color: #F4F4F4;
        border: 1px solid #c1c1c1;
        border-radius: 50%;
        &:nth-child(2){
           right: 40px;
           z-index: 1;
         }
        &:first-child{
           right: 80px;
           z-index: 2;
         }
        &.active{
           border: 1px solid @mainColor;
         }
        &.m-two{
          &:first-child{
            right: 40px;
            z-index: 2;
          }
          &:nth-child(2){
            right: 0;
            z-index: 1;
          }
        }
        &.m-four{
          &:first-child{
            right: 120px;
            z-index: 3;
          }
          &:nth-child(2){
            right: 80px;
            z-index: 2;
          }
          &:nth-child(3){
            right: 40px;
            z-index: 1;
          }
        }
        img{
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: inline-block;
        }
      }
      }
    }
    &.m-cancel{
      color: #999 !important;
      .m-product-info{
        .m-one-num{
          background: #C1C1C1 !important;
          color: #fff !important;
          &.active{
            background: #C1C1C1 !important;
            color: #fff !important;
          }
        }
      }
      .m-group-btn{
        color: #999;
        display: inline-block;
        width: 150px;
        height: 40px;
        border: 1px solid #999;
        text-align: center;
      }
    }
  }
</style>
