<template>
  <div class="m-bottomService-foot">
    <div class="m-foot-btn">
      <span class="m-icon-service"></span>
      <div class="m-inline">
        <p>客服QQ</p>
        <p>3441362480</p>
      </div>
    </div>
    <div class="m-foot-btn">
      <span class="m-icon-tell"></span>
      <div class="m-inline">
        <p>客服邮箱</p>
        <p>kuahu123@163.com</p>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "bottom-service"
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  @import "../../../common/css/index";

 .m-bottomService-foot{
  width: 700px;
   color: #ffffff;
  border-radius: 10px;
  background-color: @mainColor;
  height: 86px;
  /*line-height: 86px;*/
  margin: 150px 25px 50px 25px;
  padding: 10px 0;
   .flex-row(space-around);
  .m-foot-btn{
    /*display: inline-block;*/
    .flex-row(center);
    width: 49%;
    border-left: 1px solid #fff;
    &:first-child{
      border-left: none;
    }
    .m-inline{
      display: inline-block;
    }
    .m-icon-service{
      display: inline-block;
      width: 59px;
      height: 60px;
      background: url("/static/images/icon-qq.png") no-repeat;
      background-size: 100% 100%;
      vertical-align: middle;
      margin-right: 43px;
    }
    .m-icon-tell{
      display: inline-block;
      width: 61px;
      height: 60px;
      background: url("/static/images/icon-email.png") no-repeat;
      background-size: 100% 100%;
      vertical-align: middle;
      margin-right: 36px;
    }
  }
}
</style>
