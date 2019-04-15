<template>
    <div class="m-selectBack">

        <div class="m-product-info">
          <template v-for="(items,index) in product_info">
            <div class="m-one-product">
              <img :src="items.prmainpic" alt="">
              <div>
                <p>{{items.prtitle}}</p>
                <p class="m-ft-22">规格：
                  <template v-for="(key,k) in items.skuattritedetail" >
                    <span >{{key}}</span>
                    <span v-if="k < items.skuattritedetail.length-1">；</span>
                  </template>
                </p>
              </div>
            </div>
          </template>
      </div>
      <ul class="m-selectBack-ul">
        <li @click="changeRoute('/editBack',10)">
          <div class="m-flex-between">
            <span class="m-border"></span>
            <div>
              <p>仅退款</p>
              <p class="m-ft-18">未收到货（包含未签收），或卖家协商同意前提下</p>
            </div>
          </div>
          <span class="m-icon-more"></span>
        </li>
        <li  @click="changeRoute('/editBack',0)">
          <div class="m-flex-between">
            <span class="m-border"></span>
            <div>
              <p>退货退款</p>
              <p class="m-ft-18">已收到货，需要退换已收到货物</p>
            </div>
          </div>
          <span class="m-icon-more"></span>
        </li>
      </ul>
    </div>
</template>

<script>
    export default {
      data(){
        return{
          product_info:''
        }
      },
      mounted() {
        if(this.$route.query.allOrder){
          this.product_info = JSON.parse(this.$route.query.product).order_part;
        }else{
          this.product_info = JSON.parse(this.$route.query.product);
        }
      },
      methods:{
        changeRoute(v,item){
          this.$router.push({path:v,query:{product:this.$route.query.product,
              oraproductstatus:item,allOrder:this.$route.query.allOrder || null}});
        }
      }
    }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  @import "../../../common/css/index";
.m-selectBack{
  min-height: 100vh;
  background-color: #eee;
  .m-product-info{
    /*padding: 34px 25px;*/
    box-shadow:0 5px 5px rgba(0,0,0,0.16);
    margin-bottom: 20px;
    .m-one-product{
      display: flex;
      flex-flow: row;
      width: 100%;
      box-sizing: border-box;
      background-color: #fff;
      padding: 34px 25px 20px;
      text-align: left;
    }
    img{
      display: block;
      width: 140px;
      height: 140px;
      background-color: #9fd0bf;
      margin-right: 40px;
    }
    .m-ft-22{
      margin-top: 10px;
    }
  }
  .m-selectBack-ul{
    padding: 15px 40px 15px 45px;
    background-color: #fff;
    box-shadow:0 5px 5px rgba(0,0,0,0.16);
    text-align: left;
    li{
      .flex-row(space-between);
      padding: 24px 0;
      border-bottom: 1px solid @borderColor;
      &:last-child{
        border-bottom: none;
      }
      .m-border{
        display: block;
        width: 5px;
        height: 50px;
        background:linear-gradient(180deg, @subColor 0%, @mainColor 100%);
        margin-right: 15px;
      }
      .m-ft-18{
        font-size: 18px;
        color: #999;
      }
      .m-icon-more{
        display: inline-block;
        width: 22px;
        height: 22px;
        background: url("/static/images/icon-more.png") no-repeat;
        background-size: 100% 100%;
      }
    }
  }
}
</style>
