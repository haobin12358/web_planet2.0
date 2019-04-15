<template>
  <div class="m-activity">
    <div class="m-activity-info">
      <img src="" class="m-activity-img" alt="">
      <span class="m-icon-bg"></span>
    </div>
    <div class="m-activity-text">
      <p>“带上ME一起出行吧”时光不再，年少时曾有过许多的梦想，趁时光未泯之时，一起带上GOPRO的配件，去追寻自己的梦想吧。“带上ME一起出行吧”时光不再，年少时曾有过许多的梦想，趁时光...</p>
      <p class="m-up-fold">
        <span>点击展开 <span class="m-icon-unfold"></span></span>
        <span>点击收起 <span class="m-icon-packup"></span></span>
      </p>
    </div>

    <product></product>
  </div>
</template>

<script>
  import product from '../components/product';
  export default {
    data(){
      return{
      }
    },
    components:{
      product
    },
    methods: {

    },
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  @import "../../../common/css/index";
  .m-activity{
    .m-activity-info{
      height:440px;
      width: 100%;
      position: relative;
      margin-bottom: 68px;
      .m-activity-img{
        display: block;
        width: 100%;
        height: 440px;
        background-color: #9fd0bf;
      }
      .m-icon-bg{
        position: absolute;
        bottom: -3px;
        left: 0;
        width: 100%;
        height: 67px;
        background: url("/static/images/icon-bg.png") no-repeat;
        background-size: 100% 100%;
      }
    }
    .m-activity-text{
      padding: 0 36px;
      text-align: left;
      .m-up-fold{
        text-align: right;
        padding: 19px 160px 34px;
        font-size: 22px;
        color: #999;
        .m-icon-unfold{
          display: inline-block;
          width: 22px;
          height: 10px;
          background: url("/static/images/icon-brand-unfold.png") no-repeat;
          background-size: 100% 100%;
          margin-left: 10px;
          vertical-align: middle;
        }
        .m-icon-packup{
          display: inline-block;
          width: 22px;
          height: 10px;
          background: url("/static/images/icon-packup.png") no-repeat;
          background-size: 100% 100%;
          margin-left: 10px;
          vertical-align: middle;
        }
      }
    }
  }
</style>
