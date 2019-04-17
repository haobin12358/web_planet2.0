<template>
  <div class="m-myWallet">
    <div class="m-myWallet-head">
      <p class="m-wallet-name">账户余额</p>
      <div class="m-flex-center">
        ¥<span class="m-star-num">1200.00</span>
      </div>
      <div class="m-money-btn">
        <span >提现</span>
      </div>
      <div class="m-head-part">
        <span :class="item.name == head_name ?'active':''" v-for="(item,index) in head_list" @click="changeContent(item.name)">{{item.name}}</span>
      </div>
    </div>
    <div class="m-myWallet-activity" v-if="head_name == '活动订单'">
      活动订单
    </div>
    <div class="m-myWallet-history" v-else>
      提现历史
    </div>
  </div>
</template>

<script>
  export default {
    name: "starProduct",
    data(){
      return{
        labelShow:false,
        head_name:'活动订单',
        head_list:[
          {
            name:'活动订单',
            value:'1'
          },
          {
            name:'提现历史',
            value:'2'
          }
        ]
      }
    },
    methods:{
      changeContent(v){
        this.head_name = v;
      }
    }
  }
</script>
<style scoped lang="less">
  @import "../../../common/css/index";
  .m-myWallet{
    min-height: 100vh;
    background-color: #fff;
    .m-myWallet-head{
      background: url("/static/images/newpersonal/icon-wallet-bc.png") no-repeat;
      background-size: 100% 100%;
      width: 100%;
      height: 350px;
      /*display: flex;*/
      /*flex-flow: column;*/
      /*align-items: center;*/
      /*justify-content: space-around;*/
      color: #fff;
      padding: 40px 30px 20px;
      box-sizing: border-box;
      font-size: 24px;
      .m-wallet-name{
        font-size: 24px;
        margin-bottom: 10px;
      }
      .m-star-num{
        font-size: 40px;
        margin:0 10px;
        font-weight: 500;
      }
      .m-money-btn{
        margin: 24px 0 60px;
        span{
          display: inline-block;
          width: 200px;
          height: 50px;
          line-height: 50px;
          border: 1px solid #fff;
          font-size: 28px;
        }
      }
      .m-head-part{
        width: 100%;
        span{
          display: inline-block;
          width: 48%;
          text-align: center;
          font-size: 28px;
          font-weight: 300;
          &:first-child{
            border-right: 1px solid #fff;
          }
          &.active{
            font-weight: 500;
          }
        }
      }
    }
    .m-icon{
      display: inline-block;
      width: 30px;
      height: 30px;
      margin-right: 10px;
    }

  }

</style>
