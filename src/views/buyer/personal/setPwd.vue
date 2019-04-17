<template>
    <div class="m-setPwd">
      <h3 class="m-setPwd-h3">设置星币支付密码</h3>
      <p>请再次填写以确认</p>
      <div class="m-input-box">
        <input type="password" class="m-setPwd-input">
        <input type="password" class="m-setPwd-input">
        <input type="password" class="m-setPwd-input">
        <input type="password" class="m-setPwd-input">
        <input type="password" class="m-setPwd-input">
        <input type="password" class="m-setPwd-input">
      </div>
      <div class="m-setPwd-btn">
        完成
      </div>
    </div>
</template>

<script>
    export default {
        name: "setPwd"
    }
</script>

<style scoped lang="less">
  @import "../../../common/css/index";
.m-setPwd{
  min-height: 100vh;
  background-color: #fff;
  padding-top: 100px;
  box-sizing: border-box;
  color: #000;
  .m-setPwd-h3{
    font-size: 36px;
    margin-bottom: 28px;
  }
  .m-input-box{
    .flex-row(center);
    margin: 90px;
    .m-setPwd-input{
      display: block;
      width: 80px;
      height: 80px;
      text-align: center;
      border: 1px solid @mainColor;
      border-right: none;
      &:last-child{
        border-right: 1px solid @mainColor;
      }
    }
  }
  .m-setPwd-btn{
    width: 100%;
    height: 98px;
    line-height: 98px;
    color: #fff;
    font-size: 30px;
    background:linear-gradient(304deg,rgba(39,174,96,0.5) 0%,rgba(106,206,148,0.5) 100%);
    .active{
      background:linear-gradient(304deg,@mainColor 0%,@subColor 100%);
    }

  }
}
</style>
