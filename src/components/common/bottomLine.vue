<template>
  <div>
<!--   class="m-line"  -->
<!--    <div class="m-line-name m-bottom">-->
<!--      <span>The End</span>-->
<!--      &lt;!&ndash;<span>OUTFIT</span>&ndash;&gt;-->
<!--    </div>-->
  </div>
</template>

<script>
    export default {
        name: "bottom-line"
    }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  .m-line{
    height: 0;
    border: 1px dashed #999999;
    position: relative;
    margin: 60px 0;
    .m-line-name{
      position: absolute;
      top: -25px;
      margin: 0 auto;
      font-size: 30px;
      font-weight: bold;
      text-align: center;
      width: 100%;
      &.m-bottom{
        span{
          color: #CCCCCC;
          font-size:24px;
          font-weight:bold;
          font-style:oblique
        }
      }
      span{
        display: inline-block;
        padding: 0 15px;
        background-color: #fff;
      }
    }
  }
</style>
