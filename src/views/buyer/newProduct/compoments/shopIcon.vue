<template>
    <div class="m-shopIcon" @click="changeRoute">
      <img src="/static/images/product/icon-shop.png" class="m-icon-shop" alt="">
      <span class="m-shop-num" v-if="$store.state.shop_num>0">{{$store.state.shop_num}}</span>
    </div>
</template>

<script>
    export default {
        name: "shopIcon",
      data(){
          return{

          }
      },
      mounted() {
         if(this.$store.state.shop_num == -1){
           this.getNum();
         }
      },
      methods:{
          getNum(){
            if(localStorage.getItem('token')){
              this.$http.get(this.$api.cart_list,{
                params:{
                  token:localStorage.getItem('token')
                }
              }).then(res => {
                if(res.data.status == 200){
                  this.$store.state.shop_num = res.data.product_num;
                }
              })
            }
          },
        changeRoute(){
            this.$router.push('/shop')
        }
      }
    }
</script>

<style scoped lang="less">
  @import "../../../../common/css/_variate";
.m-shopIcon{
  position: fixed;
  bottom: 108px;
  right:10px;
  width: 108px;
  height: 108px;
  .m-icon-shop{
    display: block;
    width: 108px;
    height: 108px;
  }
  .m-shop-num{
    position: absolute;
    top:-15px;
    right:5px;
    width: 38px;
    height: 38px;
    line-height: 38px;
    border-radius: 50%;
    background-color: #fff;
    border: 3px solid @mainColor;
    color: @mainColor;
    font-size: 20px;
  }
}
</style>
