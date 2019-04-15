<template>
    <div class="m-forget">
      <div class="m-forget-box">
        <div class="m-input-box">
          <span class="m-input-label">手机号码</span>
          <input type="text" class="m-input" placeholder="">
          <span class="m-code">发送验证码</span>
        </div>
        <div class="m-input-box">
          <span class="m-input-label">验证码</span>
          <input type="text" class="m-input" placeholder="请输入验证码">
        </div>
        <div class="m-input-box">
          <span class="m-input-label">新密码</span>
          <input type="text" class="m-input" placeholder="请输入新密码">
        </div>
        <div class="m-input-box">
          <span class="m-input-label">确认密码</span>
          <input type="text" class="m-input" placeholder="请重新输入确认密码">
        </div>
      </div>
      <div class="m-forget-btn">
        <span>确  认</span>
      </div>
    </div>
</template>

<script>
    export default {
        name: "forget"
    }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  @import "../../common/css/index";

.m-forget{
  min-height: 100vh;
  height: 100%;
  width: 100%;
  background-color: #eeeeee;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  .m-forget-box{
    width: 626px;
    padding: 48px 24px 88px 50px;
    margin-top: 33px;
    border-radius: 10px;
    box-shadow: 0 5px 6px 0 rgba(0, 0, 0, 0.16);
    background-color: #ffffff;
    .m-input-box{
      display: flex;
      flex-flow: row;
      align-items: center;
      justify-content: flex-start;
      height: 94px;
      line-height: 94px;
      border-bottom: 1px solid #ccc;
      .m-input-label{
        width: 175px;
        font-size: 30px;
        text-align: left;
      }
      .m-input{
        /*width: 220px;*/
        border: none;
        height: 80px;
        line-height: 80px;
        text-align: left;
        color: #999;
      }
      .m-code{
        width: 140px;
        height: 40px;
        line-height: 40px;
        background-color: @mainColor;
        color: #fff;
        font-family: ComicSansMS;
        font-size: 21px;
        border-radius: 10px;
        box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
        padding: 5px 15px;
      }
    }
  }
  .m-forget-btn{
    width: 700px;
    height: 105px;
    line-height: 105px;
    border-radius: 10px;
    box-shadow: 0 5px 6px 0 rgba(0, 0, 0, 0.16);
    background-color: @mainColor;
    font-size: 38px;
    margin-top: 500px;
    font-weight: bold;
  }
}
</style>
