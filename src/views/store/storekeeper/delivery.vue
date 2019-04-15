<template>
  <div class="m-delivery">
    <div class="m-content-radius">
      <div class="m-content-row">
        <div class="m-row-left">收货人：居居女孩</div>
        <div class="m-row-right">联系电话：15700000000</div>
      </div>
      <div class="m-address-text">收货地址：杭州市-西湖区-浙江工业大学（屏峰校区）家和西苑14幢112</div>
    </div>
    <!--订单item-->
    <div class="m-content-radius">
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
            </div>
            <div class="m-item-row m-ft-b m-color-red m-width-70">
              <div class="m-item-row-left m-ft-28">￥29.36</div>
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
            </div>
            <div class="m-item-row m-ft-b m-color-red m-width-70">
              <div class="m-item-row-left m-ft-28">￥29.36</div>
            </div>
          </div>
        </div>
      </div>
      <!--总计部分-->
      <div class="m-item-row m-color-999 m-margin">
        <div class="m-item-row-left">2018-08-08 16:49:07 创建</div>
        <div class="m-item-row-right">共 5 件商品 合计：<span class="m-color-red">￥153.26</span></div>
      </div>
    </div>
    <!--物流部分-->
    <div class="m-content-radius">
      <div class="m-send-row m-margin">
        <div class="m-send-row-left m-ft-24">物流公司：</div>
        <div class="m-send-row-right">
          <select class="m-send-box" :options="options" v-model="selected">
            <option v-for="item in options">{{item.text}}</option>
          </select>
        </div>
      </div>
      <div class="m-send-row m-margin">
        <div class="m-send-row-left m-ft-24">物流单号：</div>
        <div class="m-send-row-right">
          <input type="text" class="m-row-input" placeholder="请输入物流单号">
        </div>
      </div>
    </div>
    <!--发货按钮-->
    <div class="m-delivery-btn" @click="sendDone">确认发货</div>
  </div>
</template>

<script>
  import common from '../../../common/js/common';

  export default {
    name: "delivery",
    data() {
      return {
        selected: "",             // 被选中的物流公司
        options: [
          { id: 1, text: 'Hello' },
          { id: 2, text: 'World' }
        ]
      }
    },
    components: {},
    methods: {
      // 确认发货按钮
      sendDone() {
        console.log(this.selected);
      }
    },
    mounted() {
      common.changeTitle('发货');
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  @import "../../../common/css/personal";

  .m-delivery {
    min-height: 100vh;
    background-color: #EEEEEE;
    padding: 40px 48px;
    .m-content-radius {
      font-size: 24px;
      padding: 20px;
      border-radius: 10px;
      background-color: #ffffff;
      text-align: left;
      margin-bottom: 20px;
      box-shadow: 0 5px 5px rgba(0,0,0,0.16);
      .m-content-row {
        display: flex;
        justify-content: space-between;
        .m-row-left {

        }
        .m-row-right {

        }
      }
      .m-send-row {
        display: flex;
        .m-send-row-left {
          line-height: 40px;
          margin-right: 20px;
        }
        .m-send-row-right {

        }
        .m-send-box {
          width: 370px;
          height: 43px;
          border-radius: 10px;
          padding: 0 0 0 15px;
        }
        .m-row-input {
          width: 350px;
          height: 40px;
          border: 1px #999999 solid;
          border-radius: 10px;
          font-size: 24px;
          padding: 0 0 0 20px;
        }
      }
      .m-address-text {
        margin: 30px 0 15px 0;
      }
    }
    .m-item-row {
      display: flex;
      justify-content: space-between;
      font-size: 21px;
      .m-item-row-left {

      }
      .m-item-row-right {

      }
    }
    .m-delivery-btn {
      width: 700px;
      height: 106px;
      margin: 100px 0 0 -25px;
      line-height: 106px;
      background-color: @mainColor;
      font-size: 38px;
      font-weight: bold;
      border-radius: 10px;
      box-shadow: 0 5px 6px rgba(0,0,0,0.16);
    }
    .m-product-box {
      margin: 20px 0;
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
</style>
