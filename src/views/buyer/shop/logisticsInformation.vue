<template>
    <div class="m-logisticsInformation" v-if="order_info">
      <!-- <div class="m-one-part">
        <template v-for="(items,index) in order_info.order_part">
          <p>商品：{{items.prtitle}}</p>
          <div class="m-logisticsInformation-product-info">
            <img :src="items.prmainpic" alt="">
            <div>
              <p>订单号：{{order_info.omno}}</p>
              <div class="m-product-sku-price">
                <p>
                  <span>规格：</span>
                  <span>
                    <template v-for="(key,k) in items.skuattritedetail" >
                        <span >{{key}}</span>
                        <span v-if="k < items.skuattritedetail.length-1">；</span>
                      </template>
                  </span>
                </p>
                <p>
                  <span>付款金额:</span>
                  <span class="m-price">￥{{items.opsubtotal | money}}</span>
                </p>
              </div>
            </div>
          </div>
        </template>

      </div> -->
      <div class="m-one-part" >
        <p class="m-flex-between" v-if="logistic_info">
          <span>物流：{{logistic_info.expName}}</span>
          <span class="m-ft-20">物流单号：{{logistic_info.number}}</span>
        </p>
        <p class="m-flex-between m-mt-15">
          <span>收货人：{{order_info.omrecvname}}</span>
          <span>联系电话：{{order_info.omrecvphone}}</span>
        </p>
        <p class="m-mt-15">
          收货地址：{{order_info.omrecvaddress}}
        </p>
      </div>
      <!--<div class="m-map"></div>-->
      <div class="m-logisticsInformation-text"  v-if="logistic_info">
        <p>物流信息：</p>
        <ul class="m-logisticsInformation-ul">
          <li v-for="(items,index) in logistic_info.list">
            <div class="m-time">
              <p>{{items.time}}</p>
              <!--<p class="m-ft-22">09:19</p>-->
            </div>
            <div class="m-logisticsInformation-info">
              <span class="m-circle " :class="(index == 0 || index == (logistic_info.list.length -1))?'active':''"></span>
              <!-- 修改了虚线增加逻辑 -->
              <span  :class="index == 0?'m-bottom':(index == (logistic_info.list.length -1) ? '':'m-bottom')"></span>
              <!--<p>已揽件</p>-->
              <p class="m-ft-22">{{items.status}}</p>
            </div>
          </li>
        </ul>
      </div>
    </div>

</template>

<script type="text/ecmascript-6">
  import common from '../../../common/js/common';
  import axios from 'axios';
  import api from '../../../api/api';
  import {Toast} from 'mint-ui';
    export default {
      data() {
        return {
          order_info:'',
          logistic_info :null
        }
      },
      components: {},
      mounted(){
        common.changeTitle('物流信息');
        this.getOrderInfo();
      },
      methods: {
        //获取订单详情
        getOrderInfo(){
          axios.get(api.order_get,{
            params:{
              token:localStorage.getItem('token'),
              omid:this.$route.query.omid
            }
          }).then(res => {
            if(res.data.status == 200){
              this.order_info = res.data.data;
              if(res.data.data.omstatus >= 20){
                this.getLogistic();
              }
            }
          })
        },
        //  获取物流信息
        getLogistic(){
          axios.get(api.get_logistic,{
            params:{
              omid:this.$route.query.omid
            }
          }).then(res => {
            if(res.data.status == 200){
              // console.log(res.data.data);
              this.logistic_info = res.data.data.oldata;
            }
          })
        }
      },
      created() {

      }
    }
</script>
<style lang="less" rel="stylesheet/less" scoped>
  @import "../../../common/css/index";
.m-logisticsInformation{
  // padding: 30px 45px;
  background-color: #fff;
  min-height: 1274px;
  text-align: left;
  color: #000000;
  .m-one-part{
    padding: 30px 49px;
    background-color: #fff;
    // border-radius: 10px;
    // box-shadow:0 5px 5px rgba(0,0,0,0.16);
    border-bottom: 10px solid #F4F4F4;
    margin-bottom: 20px;
    p{
      line-height: 32px;
    }
    .m-mt-15{
      margin-top: 15px;
    }
    .m-logisticsInformation-product-info{
      .flex-row(flex-start);
      padding: 18px 0;
      img{
        display: block;
        width: 100px;
        height: 100px;
        margin-right: 40px;
      }
      .m-product-sku-price{
        width: 470px;
        margin-top: 44px;
        .flex-row(space-between);
      }
    }
  }
  .m-map{
    width: 100%;
    height: 614px;
    box-shadow:0 5px 5px rgba(0,0,0,0.16);
    border-radius: 10px;
  }
  .m-logisticsInformation-text{
    padding: 18px 48px;
    .m-logisticsInformation-ul{
      margin-top: 20px;
      li{
        .flex-row(flex-start);
        align-items: flex-start;
        /*padding: 25px 0;*/
        .m-time{
          width: 150px;
          text-align: right;
        }
        .m-logisticsInformation-info{
          position: relative;
          padding: 0 35px 0;
          height: 130px;
          border-left: 1px solid rgba(0,0,0,0);
          margin-left: 40px;
          width: 450px;
          .m-top{
            position: absolute;
            top: 0;
            left: -5px;
            width: 1px;
            height: 10px;
            background-color: @mainColor;
          }
          .m-bottom{
            position: absolute;
            top: 10px;
            left: -1.5px;
            width: 2px;
            height: 130px;
            // background-color: @mainColor;
            border-left: 2px dashed @mainColor;
          }
          .m-circle{
            position: absolute;
            left: -7.5px;
            // top: 10px;
            width: 15px;
            height: 15px;
            background-color: @mainColor;
            border-radius: 50%;
            &.active{
              width: 30px;
              height: 30px;
              left: -15px;
            }
          }
        }
      }
    }
  }
}
</style>
