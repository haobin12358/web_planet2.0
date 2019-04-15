<template>
  <div class="m-order-management">
    <!--nav滑动选项-->
    <div class="m-nav">
      <navList :navlist="navList" :isScroll="false" @navClick="navClick"></navList>
    </div>
    <div class="m-order-box">
      <!--订单item-->
      <div class="m-order-item">
        <!--订单号、订单状态-->
        <div class="m-item-row">
          <div class="m-item-row-left m-color-666">订单号：123456789000</div>
          <div class="m-item-row-right m-color-999">待发货</div>
        </div>
        <div class="m-product-box">
          <!--商品item - img、名称、付款金额、预估收入、规格、数量、总计数量、总计金额-->
          <div class="m-product-item">
            <div class="m-product-left">
              <img class="m-product-img" src="http://dummyimage.com/175x175" alt="">
            </div>
            <div class="m-product-right">
              <div class="m-product-name">商品名称</div>
              <div class="m-item-row m-color-999 m-margin">
                <div class="m-item-row-left">规格：黑色-42码</div>
                <div class="m-item-row-right">数量：x1</div>
              </div>
              <div class="m-item-row m-color-666 m-width-80">
                <div class="m-item-row-left m-ft-24">付款金额</div>
                <div class="m-item-row-right m-ft-24">成交预估收入</div>
              </div>
              <div class="m-item-row m-ft-b m-color-red m-width-70">
                <div class="m-item-row-left m-ft-28">￥29.36</div>
                <div class="m-item-row-right m-ft-28">￥2.36</div>
              </div>
            </div>
          </div>
        </div>
        <!--总计部分-->
        <div class="m-item-row m-color-999 m-margin">
          <div class="m-item-row-left">共 5 件商品 合计：<span class="m-color-red">￥153.26</span></div>
          <div class="m-item-row-right">总预估收入：<span class="m-color-red">￥22.36</span></div>
        </div>
        <div class="m-order-time-btn">
          <div class="m-order-time m-color-999">2018-08-08 16:49:07 创建</div>
          <div class="m-order-btn m-color-white m-btn-grey">退货中</div>
        </div>
      </div>
      <!--订单item-->
      <div class="m-order-item">
        <!--订单号、订单状态-->
        <div class="m-item-row">
          <div class="m-item-row-left m-color-666">订单号：123456789000</div>
          <div class="m-item-row-right m-color-999">待发货</div>
        </div>
        <div class="m-product-box">
          <!--商品item - img、名称、付款金额、预估收入、规格、数量、总计数量、总计金额-->
          <div class="m-product-item">
            <div class="m-product-left">
              <img class="m-product-img" src="http://dummyimage.com/175x175" alt="">
            </div>
            <div class="m-product-right">
              <div class="m-product-name">商品名称</div>
              <div class="m-item-row m-color-999 m-margin">
                <div class="m-item-row-left">规格：黑色-42码</div>
                <div class="m-item-row-right">数量：x1</div>
              </div>
              <div class="m-item-row m-color-666 m-width-80">
                <div class="m-item-row-left m-ft-24">付款金额</div>
                <div class="m-item-row-right m-ft-24">成交预估收入</div>
              </div>
              <div class="m-item-row m-ft-b m-color-red m-width-70">
                <div class="m-item-row-left m-ft-28">￥29.36</div>
                <div class="m-item-row-right m-ft-28">￥2.36</div>
              </div>
            </div>
          </div>
        </div>
        <!--总计部分-->
        <div class="m-item-row m-color-999 m-margin">
          <div class="m-item-row-left">共 5 件商品 合计：<span class="m-color-red">￥153.26</span></div>
          <div class="m-item-row-right">总预估收入：<span class="m-color-red">￥22.36</span></div>
        </div>
        <div class="m-order-time-btn">
          <div class="m-order-time m-color-999">2018-08-08 16:49:07 创建</div>
          <div class="m-order-btn m-color-white m-btn-red">申请退款</div>
        </div>
      </div>
      <!--订单item-->
      <div class="m-order-item">
        <!--订单号、订单状态-->
        <div class="m-item-row">
          <div class="m-item-row-left m-color-666">订单号：123456789000</div>
          <div class="m-item-row-right m-color-999">待发货</div>
        </div>
        <div class="m-product-box">
          <!--商品item - img、名称、付款金额、预估收入、规格、数量、总计数量、总计金额-->
          <div class="m-product-item">
            <div class="m-product-left">
              <img class="m-product-img" src="http://dummyimage.com/175x175" alt="">
            </div>
            <div class="m-product-right">
              <div class="m-product-name">商品名称</div>
              <div class="m-item-row m-color-999 m-margin">
                <div class="m-item-row-left">规格：黑色-42码</div>
                <div class="m-item-row-right">数量：x1</div>
              </div>
              <div class="m-item-row m-color-666 m-width-80">
                <div class="m-item-row-left m-ft-24">付款金额</div>
                <div class="m-item-row-right m-ft-24">成交预估收入</div>
              </div>
              <div class="m-item-row m-ft-b m-color-red m-width-70">
                <div class="m-item-row-left m-ft-28">￥29.36</div>
                <div class="m-item-row-right m-ft-28">￥2.36</div>
              </div>
            </div>
          </div>
          <!--商品item - img、名称、付款金额、预估收入、规格、数量、总计数量、总计金额-->
          <div class="m-product-item">
            <div class="m-product-left">
              <img class="m-product-img" src="http://dummyimage.com/175x175" alt="">
            </div>
            <div class="m-product-right">
              <div class="m-product-name">商品名称</div>
              <div class="m-item-row m-color-999 m-margin">
                <div class="m-item-row-left">规格：黑色-42码</div>
                <div class="m-item-row-right">数量：x1</div>
              </div>
              <div class="m-item-row m-color-666 m-width-80">
                <div class="m-item-row-left m-ft-24">付款金额</div>
                <div class="m-item-row-right m-ft-24">成交预估收入</div>
              </div>
              <div class="m-item-row m-ft-b m-color-red m-width-70">
                <div class="m-item-row-left m-ft-28">￥29.36</div>
                <div class="m-item-row-right m-ft-28">￥2.36</div>
              </div>
            </div>
          </div>
        </div>
        <!--总计部分-->
        <div class="m-item-row m-color-999 m-margin">
          <div class="m-item-row-left">共 5 件商品 合计：<span class="m-color-red">￥153.26</span></div>
          <div class="m-item-row-right">总预估收入：<span class="m-color-red">￥22.36</span></div>
        </div>
        <div class="m-order-time-btn">
          <div class="m-order-time m-color-999">2018-08-08 16:49:07 创建</div>
          <div class="m-order-btn m-color-white m-btn-yellow" @click="changeRoute('/storekeeper/delivery')">发 货</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import common from '../../../common/js/common';
  import navList from '../../../components/common/navlist';

  export default {
    name: "orderManagement",
    data() {
      return {
        navList: [
          { name: "所有订单(17)", active: true }, { name: "待发货(1)", active: false }, { name: "已发货(1)", active: false }, { name: "退货(1)", active: false }
        ]
      }
    },
    components: { navList },
    methods: {
      // navList的点击事件
      navClick(index){
        let arr = [].concat(this.navList);
        for(let i = 0; i < arr.length; i ++){
          arr[i].active = false;
        }
        arr[index].active = true;
        this.navList = [].concat(arr);
      },
      // 跳转其他页面的方法
      changeRoute(v) {
        this.$router.push(v)
      },
    },
    mounted() {
      common.changeTitle('订单管理');
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  @import "../../../common/css/index";

  .m-order-management {
    min-height: 100vh;
    background-color: #EEEEEE;
    .m-nav{
      width: 706px;
      padding: 10px 0 30px 22px;
    }
    .m-order-box {
      padding: 0 48px 10px 48px;
      .m-order-item {
        padding: 20px;
        background-color: #ffffff;
        box-shadow: 0 5px 5px rgba(0,0,0,0.16);
        border-radius: 10px;
        margin-bottom: 20px;
        text-align: left;
        .m-item-row {
          display: flex;
          justify-content: space-between;
          font-size: 21px;
          .m-item-row-left {

          }
          .m-item-row-right {

          }
        }
        .m-product-box {
          margin: 20px 0 35px 0;
          .m-product-item {
            width: 100%;
            display: flex;
            margin-top: 10px;
            .m-product-left {
              margin-right: 30px;
              .m-product-img {
                width: 175px;
                height: 175px;
                border: 1px solid #707070;
              }
            }
            .m-product-right {
              flex: 1;
              .m-product-name {
                font-size: 28px;
                font-weight: bold;
              }
            }
          }
        }
        .m-order-time-btn {
          display: flex;
          justify-content: space-between;
          .m-order-time {
            font-size: 21px;
            margin-top: -10px;
          }
          .m-order-btn {
            width: 96px;
            height: 32px;
            padding: 4px 21px;
            font-size: 24px;
            border-radius: 10px;
            text-align: center;
          }
          .m-btn-yellow {
            background-color: @mainColor;
          }
          .m-btn-red {
            background-color: #C70000;
          }
          .m-btn-grey {
            background-color: #CCCCCC;
          }
        }
        .m-margin {
          margin: 15px 0;
        }
        .m-width-80 {
          width: 80%;
        }
        .m-width-70 {
          width: 73%;
        }
        /*以下为字体颜色样式*/
        .m-color-666 {
          color: #666666;
        }
        .m-color-999 {
          color: #999999;
        }
        .m-color-red {
          color: #C70000;
        }
        .m-color-white {
          color: #ffffff;
        }
      }
    }
  }
</style>
