<template>
  <div class="m-one-product" @click="changeRoute(product)">
    <img :src="product.prmainpic" class="m-product-img" alt="">
    <h3 class="m-product-title">【{{product.brand.pbname}}】{{product.prtitle}}</h3>
    <div class="m-flex-between ">
      <span class="m-can-price">{{product.prprice}}</span>
      <s class="m-line-price">{{product.prlineprice || product.prprice}}</s>
    </div>
  </div>
</template>

<script>
    export default {
        name: "product",
      props:{
        product:{
          type:Object,
          default:null
        }
      },
      methods:{
        changeRoute(item){
          if(this.gift) {
            this.$router.push({ path: '/gift', query: { prid: item.prid, from: this.gift }});
          }else if(this.limited) {
            this.$router.push({ path: '/limitedProductDetail', query: { tlpid: item.tlpid }});
          }else{
            this.$router.push({ path: '/productDetail', query: { prid: item.prid }});

          }
        }
      }
    }
</script>

<style scoped lang="less">
  @import "../../common/css/index";
  .m-one-product{
    width: 340px;
    margin-bottom: 30px;
    color: #000;
    &:nth-child(odd){
      margin-right: 20px;
    }
    .m-product-img{
      display: block;
      width: 340px;
      height: 450px;
      background-color: #9fd0bf;
    }
    .m-product-title{
      color: #333;
      white-space: normal;
      margin: 20px 0 10px 0;
      width: 340px;
      font-size: 24px;
      text-align: left;
      overflow: hidden; // 超出的文本隐藏
      word-break: break-word;  // 英文换行
      text-overflow: ellipsis;    // 溢出用省略号显示
      display: -webkit-box; // 将对象作为弹性伸缩盒子模型显示。
      -webkit-box-orient: vertical; // 从上到下垂直排列子元素（设置伸缩盒子的子元素排列方式）
      -webkit-line-clamp: 2; // 这个属性不是css的规范属性，需要组合上面两个属性，表示显示的行数。
    }
    .m-can-price{
      font-size: 28px;
      font-weight: 600;
    }
    .m-star-num{
      color: #C1C1C1;
      font-size: 24px;
      &.active{
        color: @mainColor;
      }
    }
  }
</style>
