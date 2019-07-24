<template>
    <div class="m-dynamic">
      <div class="m-flex-between m-dynamic-top">
        <div class="m-one-dynamic">
          <p class="m-title">动态动态</p>
          <img src="" class="m-product" alt="">
        </div>
        <div class="m-one-dynamic">
          <p class="m-title">动态动态</p>
          <img src="" class="m-product" alt="">
        </div>
      </div>
      <div class="m-brand-dynamic">
        <p class="m-name">品牌动态</p>
        <div class="m-one" @click="changeRoute('/dynamicDetail')">
          <img src="" class="m-img" alt="">
          <div class="m-info">
           <p class="m-title">动态标题动态标题动态标题动…</p>
            <p class="m-grey">2018年12月30日</p>
          </div>
        </div>
        <div class="m-one">
          <img src="" class="m-img" alt="">
          <div class="m-info">
            <p class="m-title">动态标题动态标题动态标题动…</p>
            <p class="m-grey">2018年12月30日</p>
          </div>
        </div>
      </div>

    </div>
</template>

<script>
  import common from '../../../common/js/common'
    export default {
        name: "dynamic",
      data(){
          return{

          }
      },
      mounted() {
          common.changeTitle('品牌动态');
      },
      methods:{
        changeRoute(v){
          this.$router.push(v);
        }
      }
    }
</script>

<style scoped lang="less">
  @import "../../../common/css/index";
  .m-dynamic{
    .m-dynamic-top{
      padding: 30px;
      .m-one-dynamic{
        width: 340px;
        text-align: left;
        margin-bottom: 20px;
        .m-title{
          width: 340px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 32px;
          font-weight: 400;
        }
        .m-product{
          display: block;
          width: 340px;
          height: 440px;
        }
      }
      .m-icon-more{
        display: block;
        width: 12px;
        height: 21px;
        margin-left: 10px;
      }
    }
    .m-brand-dynamic{
      text-align: left;
      .m-name{
        padding: 20px 30px;
        border-bottom: 1px solid @borderColor;
        font-weight: 600;
        font-size: 32px;
      }
      .m-one{
        padding: 20px 30px;
        border-bottom: 1px solid @borderColor;
        .flex-row(flex-start);
        .m-img{
          display: block;
          width: 288px;
          height: 161px;
          margin-right: 24px;
        }
        .m-info{
          height: 161px;
          .flex-col(space-between);
          align-items: flex-start;
          .m-title{
            font-size: 28px;
            font-weight: 500;
            width: 392px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
    }
  }
</style>
