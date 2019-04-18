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
      <nav-list :navlist="nav_list" @navClick="navClick"></nav-list>
      <div class="m-activity-order-list">
        <div class="m-one-order">
          <img src="" class="m-img" alt="">
          <div class="m-one-order-text">
            <div class="m-one-order-title">
              <h3 class="m-product-name">TAWA防水帐篷户外野营必备防水帐篷帐户外野营必备TAWA防水…</h3>
              <span class="m-price">¥160.00</span>
            </div>
            <p class="m-product-sku">绿色；单人款</p>
            <div class="m-order-num">
              <span class="m-text">返现¥</span>
              <span>160.00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="m-myWallet-history" v-else>
      提现历史
    </div>
  </div>
</template>

<script>
  import navList from '../../../components/common/navlist';
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
        ],
        nav_list:[
          {
            name:'新人首单',
            value:'',
            active:true
          },
          {
            name:'免费试用',
            value:'',
            active:false
          }
        ]
      }
    },
    components:{navList},
    methods:{
      changeContent(v){
        this.head_name = v;
      },
      navClick(index){

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
    .m-activity-order-list{
      .m-one-order{
        padding: 30px;
        border-bottom: 1px solid #F2F2F2;
        .flex-row(flex-start);
        .m-img{
          display: block;
          width: 180px;
          height: 180px;
          margin-right: 20px;
        }
        .m-one-order-text{
          text-align: left;
          .m-one-order-title{
            display: flex;
            flex-flow: row;
            align-items: flex-start;
            justify-content: space-between;
            width: 485px;
            .m-product-name{
              width: 352px;
              white-space: normal;
              font-size: 24px;
              overflow: hidden; // 超出的文本隐藏
              word-break: break-word;  // 英文换行
              text-overflow: ellipsis;    // 溢出用省略号显示
              display: -webkit-box; // 将对象作为弹性伸缩盒子模型显示。
              -webkit-box-orient: vertical; // 从上到下垂直排列子元素（设置伸缩盒子的子元素排列方式）
              -webkit-line-clamp: 2; // 这个属性不是css的规范属性，需要组合上面两个属性，表示显示的行数。
            }
            .m-price{
              color: #000;
            }
          }
          .m-product-sku{
            font-size: 24px;
            color: #C1C1C1;
            margin: 12px 0 36px;
          }
          .m-order-num{
            text-align: right;
            font-size: 24px;
            color: @mainColor;
            .m-text{
              font-size: 20px;
            }
          }
        }
      }
    }

  }

</style>
