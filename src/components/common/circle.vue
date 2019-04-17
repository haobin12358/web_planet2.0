<template>
  <div class="m-circle-item">
    <div class="m-circle-user-box">
      <div>
        <img src="" class="m-circle-user-avator" alt="">
        <span class="m-circle-user-name">juju</span>
        <span class="m-circle-user-level">星会员</span>
      </div>
      <span class="m-circle-collect">关注</span>
    </div>
    <div class="m-circle-img-box">
      <img src="" class="m-circle-img" alt="">
      <img src="" class="m-circle-img" alt="">
      <img src="" class="m-circle-img" alt="">
    </div>
    <div class="m-circle-text">
      <span class="m-circle-label">#去热带的岛屿游泳#</span>
      攻略测评打赏,榜单场景内容推荐网红打卡自由主题圈子活动游记攻略测评打赏榜单场景,内容推荐网红打卡自由主题圈子活动游记攻略测评打赏榜单场景内,容推荐自由zhuzhu
    </div>
    <div class="m-circle-loc m-flex-start">
      <img src="/static/images/circle/icon-loc.png" class="m-icon-loc" alt="">
      <span>杭州</span>
    </div>
    <div class="m-circle-icon-box m-flex-between">
      <img src="/static/images/circle/icon-share.png" class="m-icon" alt="">
      <div class="m-flex-end">
        <div class="m-circle-icon-one">
          <img src="/static/images/circle/icon-like.png" class="m-icon" alt="">
          <span>234</span>
        </div>
        <div class="m-circle-icon-one">
          <img src="/static/images/circle/icon-comment.png" class="m-icon" alt="">
          <span>234</span>
        </div>
        <div class="m-circle-icon-one">
          <img src="/static/images/circle/icon-collect.png" class="m-icon" alt="">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
        name: "circleComponent",
      data(){
          return{

          }
      }
    }
</script>

<style scoped lang="less">
  @import "../../common/css/index";
  .m-circle-item{
    border-bottom: 1px solid #F2F2F2;
    padding: 30px 0;
    .m-circle-user-box{
      .flex-row(space-between);
      padding-bottom: 20px;
      .m-circle-user-avator{
        display: inline-block;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background-color: #F2F2F2;
      }
      .m-circle-user-name{
        font-size: 28px;
        margin: 0 10px;
      }
      .m-circle-user-level{
        font-size: 16px;
        color: @mainColor;
        border: 1px solid @mainColor;
        padding: 0 10px;
      }
      .m-circle-collect{
        color: @mainColor;
        border: 1px solid @mainColor;
        padding: 0 20px;
        font-size: 24px;
      }
    }
    .m-circle-img-box{
      margin-bottom: 20px;
      display: flex;
      flex-flow: row;
      justify-content: flex-start;
      flex-wrap: wrap;
      .m-circle-img{
        display: block;
        width: 210px;
        height: 200px;
        margin: 0 10px 10px 0;
        background-color: #F2F2F2;
      }
    }
    .m-circle-text{
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      overflow: hidden;
      text-align: left;
      margin-bottom: 20px;
      .m-circle-label{
        color: #006FCE;
      }
    }
    .m-circle-loc{
      color: #C1C1C1;
      font-size: 24px;
      text-align: left;
      margin-bottom: 20px;
      .m-icon-loc{
        display: inline-block;
        width: 30px;
        height: 30px;
        margin-right: 10px;
      }
    }
    .m-circle-icon-box{
      .m-icon{
        display: inline-block;
        width: 40px;
        height: 40px;
      }
      .m-circle-icon-one{
        display: flex;
        flex-flow: row;
        align-items: flex-start;
        margin-left: 40px;
      }
    }
  }
</style>
