<template>
    <div class="m-brandList">
      <div class="m-one-brand" @click="changeRoute('/brandDetail')">
        <img src="" class="m-bg" alt="">
        <div class="m-brand-info">
          <img src="" class="m-brand-logo" alt="">
          <div class="m-brand-name">Adidas</div>
          <ul class="m-brand-product">
            <li class="m-box-shadow">
              <discount></discount>
            </li>
            <li>
              <img src="" class="m-product-img" alt="">
              <div class="m-product-name">Adidas商品商品商…</div>
              <div class="m-product-price">
                <span>¥</span>
                <span  class="m-price">270</span>
              </div>
            </li>
            <li>
              <img src="" class="m-product-img" alt="">
              <div class="m-product-name">Adidas商品商品商…</div>
              <div class="m-product-price">
                <span>¥</span>
                <span  class="m-price">270</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="m-one-brand">
        <img src="" class="m-bg" alt="">
        <div class="m-brand-info">
          <img src="" class="m-brand-logo" alt="">
          <div class="m-brand-name">Adidas</div>
          <ul class="m-brand-product">
            <li class="m-box-shadow">
              <discount></discount>
            </li>
            <li>
              <img src="" class="m-product-img" alt="">
              <div class="m-product-name">Adidas商品商品商…</div>
              <div class="m-product-price">
                <span>¥</span>
                <span  class="m-price">270</span>
              </div>
            </li>
            <li>
              <img src="" class="m-product-img" alt="">
              <div class="m-product-name">Adidas商品商品商…</div>
              <div class="m-product-price">
                <span>¥</span>
                <span  class="m-price">270</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
</template>

<script>
   import discount from '../../../components/common/discount';
    export default {
        name: "brandList",
      data(){
          return{

          }
      },
      components:{discount},
      methods:{
          changeRoute(v){
            this.$router.push({ path: v, query: { }})
          }
      }
    }
</script>

<style scoped lang="less">
  @import "../../../common/css/resize";
.m-brandList{
  .m-one-brand{
    min-height: 700px;
    position: relative;
    background-color: #fff;
    .m-bg{
      width: 100%;
      height: 350px;
      display: block;
      background-color: #9fd0bf;
    }
    .m-brand-info{
      position: absolute;
      top:200px;
      left: 25px;
      width: 700px;
      height: 480px;
      padding: 20px ;
      box-sizing: border-box;
      background-color: #fff;
      box-shadow:0px 3px 30px rgba(0,0,0,0.1);
      .m-brand-logo{
        position: absolute;
        top:-50px;
        left: 20px;
        width: 150px;
        height: 150px;
        box-shadow:0px 3px 30px rgba(0,0,0,0.1);
      }
      .m-brand-name{
        text-align: left;
        padding-left: 195px;
        font-size: 36px;
        font-weight: 500;
        margin-bottom: 80px;
      }
      .m-brand-product{
        display: flex;
        flex-flow: row;
        align-items: center;
        justify-content: space-around;
        li{
          width: 200px;
          height: 300px;
          &.m-box-shadow{
            box-shadow:0px 3px 30px rgba(0,0,0,0.1);
          }
          .m-product-img{
            display: block;
            width: 200px;
            height: 200px;
            background-color: #c1c1c1;
          }
          .m-product-name{
            width: 200px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space:nowrap;
            text-align: left;
            margin: 10px 0 20px;
          }
          .m-product-price{
            text-align: left;

            .m-price{
              font-size: 28px;
              font-weight: 600;
            }
          }
        }
      }
    }
  }
}
</style>
