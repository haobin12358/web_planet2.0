<template>
    <div class="m-systemfix">
      <div class="m-content">
        <p>大行星系统停机维护中，</p>
          <p>请稍后尝试登录...</p>
        <img src="/static/images/systemfix.png" alt="">
        <p>为您带来不便，</p>
         <p>敬请谅解！</p>
      </div>
    </div>
</template>

<script>
    export default {
        name: "system"
    }
</script>

<style lang="less" scoped>
.m-systemfix{
  .m-content{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    width: 750px;
    img{
      display: block;
      width: 100%;
      height: 582px;
      margin: 36px 0;
    }
    p{
      span{
        font-family: HappyZcool-2016;
        font-size: 28px;
        color:#7F8499;
      }
    }
  }
}
</style>
