<template>
    <div class="m-discount-components" :class="item.title_subtitle.coupon_type == 1? 'm-brand':(item.title_subtitle.coupon_type == 2?'m-zhe':'')">
      <span class="m-label" v-if="item.title_subtitle.coupon_type == 0"> 全平台</span>
      <span class="m-label" v-else-if="item.title_subtitle.coupon_type == 1"> 品牌</span>
      <span class="m-label" v-if="item.title_subtitle.coupon_type == 2"> 折扣券</span>
      <div class="m-discount-num">{{item.cosubtration || item.codiscount}}</div>
      <div class="m-discount-condition">{{item.title_subtitle.subtitle}}</div>
      <div class="m-discount-info">{{item.title_subtitle.title}}</div>
      <div class="m-discount-btn" @click.stop="haveDiscount" v-if="!item.ready_collected">立即领取</div>
      <div class="m-discount-btn"  v-else>已领取</div>
<!--      <div class="m-discount-line"></div>-->
    </div>
</template>

<script>
    export default {
        name: "discount",
      props:{
          item:{
            type:Object,
            default:{}
          },
        index:{
          type:Number,
          default:null
        }
      },
      methods:{
        haveDiscount(){
          this.$emit('haveDiscount',this.item.coid,this.index);
        }
      }
    }
</script>

<style scoped lang="less">
  @import "../../common/css/index";
.m-discount-components{
  position: relative;
  width: 200px;
  height: 300px;
  background: url("/static/images/index/discount-bg.png") no-repeat;
  background-size: 100% 100%;
  /*margin-left: 20px;*/
  text-align: center;
  .m-label{
    position: absolute;
    top:0;
    left: 0;
    width: 80px;
    border-bottom-right-radius: 20px;
    font-size: 20px;
    color: #fff;
  }
  .m-discount-num{
    font-size: 52px;
    padding: 55px 0 0;
    color: @mainColor;
    font-weight: 600;
    .m-word{
      font-size: 32px;
    }
  }
  .m-discount-condition{
    color: @mainColor;
    font-size: 24px;
  }
  .m-discount-info{
    width: 130px;
    color: #c1c1c1;
    font-size: 20px;
    margin: 20px 0 0 32px;
    text-align: left;
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient:vertical;
  }
  .m-discount-btn{
    position: absolute;
    bottom:0;
    left:0;
    width: 100%;
    height: 52px;
    line-height: 52px;
    font-weight: 500;
    font-size: 28px;
    color: #fff;
  }
  .m-discount-line{
    width: 100%;
    position: absolute;
  }
  &.m-brand{
    background: url("/static/images/index/discount-bg-brand.png") no-repeat;
    background-size: 100% 100%;
    .m-discount-num{
      color: #000;
    }
    .m-discount-condition{
      color: #000;
    }
  }
  &.m-zhe{
    background: url("/static/images/index/discount-bg-zhe.png") no-repeat;
    background-size: 100% 100%;
    .m-discount-num{
      color: #E67E22;
    }
    .m-discount-condition{
      color: #E67E22;
    }
  }
}
</style>
