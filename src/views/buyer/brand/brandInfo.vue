<template>
    <div class="m-brandInfo">
      <div class="m-brand-info" style="background: #0084D6;">
        <img src="" class="m-logo"  alt="">
        <div class="m-info">
          <div class="m-flex-between">
            <span class="m-name">addada</span>
<!--            <span class="m-btn" >查看更多</span>-->
          </div>
          <div>Adidas is all in  全倾全力</div>
        </div>
      </div>
      <img src="" class="m-img" alt="">
    </div>
</template>

<script>
    export default {
        name: "brandInfo"
    }
</script>

<style scoped lang="less">
  @import "../../../common/css/index";
  .m-brandInfo{
    .m-brand-info{
      padding: 40px 30px;
      .flex-row(flex-start);
      /*background-color: #0084D6;*/
      background: url("/static/images/index/brand-top-bg.png") no-repeat;
      background-size: 100% 100%;
      .m-logo{
        display: block;
        width: 120px;
        height: 120px;
        box-shadow:0px 3px 30px rgba(0,0,0,0.1);
        margin:0 30px;
      }
      .m-info{
        width: 500px;
        height: 120px;
        color: #fff;
        .flex-col(space-between);
        text-align: left;
        align-items: flex-start;
        .m-name{
          width: 400px;
          font-size: 40px;
          font-weight: 600;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .m-btn{
          font-size: 20px;
          padding: 0 10px;
          display: inline-block;
          border: 1px solid #fff;
        }
      }
    }
    .m-img{
      display: block;
      width: 100%;
      min-height: 85vh;
      background-color: #9fd0bf;
    }
  }

</style>
