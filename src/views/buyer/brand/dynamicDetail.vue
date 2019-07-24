<template>
    <div class="m-dynamicDetail">
      <img src="" class="m-top-img" alt="">
      <div class="m-dynamicDetail-text">
        <p class="m-title">标题</p>
        <p class="m-grey">09:20</p>
        <div class="m-text">
            <p>12124124</p>
          <p>12124124</p>
          <p>12124124</p>
          <img src=""  alt="">
        </div>
      </div>
    </div>
</template>

<script>
  import common from '../../../common/js/common'
    export default {
        name: "dynamicDetail",
      data(){
          return{

          }
      },
      mounted() {
          common.changeTitle('动态详情')
      }
    }
</script>

<style scoped lang="less">
.m-dynamicDetail{
  color: #000;
  .m-top-img{
    display: block;
    width: 750px;
    height: 440px;
    margin-bottom: 20px;
    background-color: #9fd0bf;
  }
  .m-grey{
    color: #999999;
    font-size: 24px;
  }
  .m-title{
    font-weight: 600;
    font-size: 32px;
    margin-bottom: 20px;
  }
  .m-dynamicDetail-text{
    text-align: left;
   p,h1,h2,h3{
     padding: 0 50px;
   }
    img{
      display: block;
      width: 100%;
      background-color: #9fd0bf;
    }
    .m-text{
      line-height: 36px;
      font-size: 28px;
    }
  }
}
</style>
