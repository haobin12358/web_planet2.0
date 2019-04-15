<template>
    <div class="m-backDetail">
      <div class="m-orderDetail-status">
        <div>
          <p class="m-alert m-ft-28" v-if="refund.orastatus == '-20'">售后申请{{refund.orastatus_zh}}</p>
          <p class="m-alert m-ft-28" v-if="refund.orastatus == '-10'">商家{{refund.orastatus_zh}}，请稍后处理</p>
          <p class="m-alert m-ft-28" v-if="refund.orastatus == '0'">商家{{refund.orastatus_zh}}，请等待商家处理</p>
          <p class="m-alert m-ft-28" v-if="refund.orastatus == '10'">商家{{refund.orastatus_zh}}
            <span v-if="order_refund.orstatus_zh && refund.orastate != 10">，{{order_refund.orstatus_zh}}</span>
          </p>
        </div>
        <span class="m-icon-order-status "></span>
      </div>
      <div class="m-back-info-box">
        <p class="m-back-info" v-if="refund.orastatus == '-20'">您已取消售后申请。</p>
        <p class="m-back-info" v-if="refund.orastatus == '-10'">您的售后申请被拒绝，请稍后处理。</p>
        <p class="m-back-info" v-if="refund.orastatus == '0'">您的退款申请在审核中，请耐心等待商家处理。</p>
        <p class="m-back-info" v-if="refund.orastatus == '10'">商家已经同意您的退款申请
          <span v-if="order_refund.orstatus_zh && refund.orastate != 10">，{{order_refund.orstatus_zh}}。</span>
        </p>
        <div class="m-product-text" v-if="refund.orastatus == '10' && refund.orastate != 10">
          <p>收货人：{{order_refund.orrecvname}}</p>
          <p>收货电话：{{order_refund.orrecvphone}}</p>
          <p>收货地址：{{order_refund.orrecvaddress}}</p>
          <p>快递公司：<span @click="chooseCompany">{{companyName}}</span></p>
          <p v-if="order_refund.orlogisticsn">快递单号：{{order_refund.orlogisticsn}}</p>
          <p v-else>快递单号：
            <input type="text" v-model="orlogisticsn" class="m-input m-ft-22">
          </p>
          <p v-if="order_refund.orlogisticlostresult">物流近况：<span>{{order_refund.orlogisticlostresult.status}}</span></p>
          <!--快递公司picker-->
          <mt-popup class="m-company-popup" v-model="companyPopup" position="bottom">
            <div class="m-popup-btn">
              <div @click="companyPopup = false">取消</div>
              <div @click="companyDone">确认</div>
            </div>
            <mt-picker :slots="slots" value-key="lcname" :visibleItemCount="7" @change="companyChange"></mt-picker>
          </mt-popup>
        </div>
        <p class="m-back-info-btn">
          <span @click="cancelRefund" v-if="refund.orastatus == '0'">撤销申请</span>
          <span @click="refundSend" v-if="order_refund.orstatus == '0'">发 货</span>
        </p>
      </div>
      <div class="m-back-product">
        <h3>退款信息</h3>
        <div class="m-back-product-info" v-for="item in order_info.order_part" v-if="(!order_info.order_refund_apply &&
                 item.order_refund_apply) || (order_info.order_refund_apply && !item.order_refund_apply)">
          <div>
            <img :src="item.prmainpic">
          </div>
          <div>
            <p>{{item.prtitle}}</p>
            <p class="m-product-select">规格：<span v-for="sku in item.skuattritedetail">{{sku}} </span></p>
          </div>
        </div>
        <div class="m-product-text">
          <p v-if="refund.oracheckreason">审核回复：{{refund.oracheckreason}}</p>
          <p>退款原因：{{refund.orareason}}</p>
          <p>退款金额：￥{{refund.oramount | money}}</p>
          <p v-if="refund.oraaddtion">申请留言：{{refund.oraaddtion}}</p>
          <p>申请时间：{{refund.createtime}}</p>
          <p>退款编号：{{refund.orasn}}</p>
        </div>
      </div>
      <bottom></bottom>
    </div>
</template>

<script>
  import common from '../../../common/js/common';
  import bottom from '../components/bottomService';
  import axios from 'axios';
  import api from '../../../api/api';
  import { Toast, MessageBox } from 'mint-ui';

  export default {
    data(){
      return{
        order_info: '',
        refund: { orareason: '', oramount: '' },
        order_refund: {},
        companyName: '请点击选择快递公司',
        orlogisticsn: '',           // 买家发货的物流单号
        company: {},
        companyPopup: false,
        slots: [{ values: [] }],
      }
    },
    components: { bottom },
    mounted() {
      common.changeTitle('退款详情');
      this.getOrderInfo();            // 获取订单详情
    },
    methods: {
      // 获取订单详情
      getOrderInfo() {
        axios.get(api.order_get,{
          params:{
            token:localStorage.getItem('token'),
            omid:this.$route.query.omid
          }
        }).then(res => {
          if(res.data.status == 200) {
            this.order_info = res.data.data;
            // 售后信息
            if(res.data.data.order_refund_apply) {
              this.refund = res.data.data.order_refund_apply;
            }
            // 退换货的信息
            if(res.data.data.order_refund) {
              this.order_refund = res.data.data.order_refund;
              if(this.order_refund.orlogisticcompany_zh) {
                this.companyName = this.order_refund.orlogisticcompany_zh;
              }
            }
            this.getProductRefund();
          }
        })
      },
      // 当一个订单中有多个商品时，退掉其中一个，则以该商品的售后信息显示
      getProductRefund() {
        if(this.$route.query.allOrder) {

        }else {
          if(this.order_info.order_part) {
            for(let i = 0; i < this.order_info.order_part.length; i ++) {
              if(this.order_info.order_part[i].order_refund_apply) {
                this.refund = this.order_info.order_part[i].order_refund_apply;
              }
            }
          }
        }
      },
      // 撤销售后申请
      cancelRefund() {
        MessageBox.confirm('是否确认撤销该售后申请?').then(() => {
          axios.post(api.refund_cancel + '?token='+ localStorage.getItem('token'), { oraid: this.refund.oraid }).then(res => {
            if(res.data.status == 200) {
              Toast(res.data.message);
              // this.getOrderInfo();            // 获取订单详情
              // this.$router.push('/personal/afterSales');
              this.$router.go(-2);
            }
          });
        }).catch(() => {

        });
      },
      // 买家发货(申请退货退款审核通过后,买家发货)
      refundSend() {
        if(!this.company) {
          Toast('请先选择快递公司');
          return false;
        }
        if(!this.orlogisticsn) {
          Toast('请先填写快递单号');
          return false;
        }
        let params = {
          oraid: this.order_refund.oraid,
          orlogisticcompany: this.company.lccode,
          orlogisticsn: this.orlogisticsn
        };
        axios.post(api.refund_send + '?token='+ localStorage.getItem('token'), params).then(res => {
          if(res.data.status == 200) {
            Toast(res.data.message);
            this.getOrderInfo();            // 获取订单详情
          }
        });
      },
      // 获取快递公司
      chooseCompany() {
        axios.get(api.list_company).then(res => {
          if(res.data.status == 200) {
            this.slots[0].values = [];
            for(let i = 0; i < res.data.data.common.length; i ++) {
              this.slots[0].values.push(res.data.data.common[i]);
            }
            for(let i = 0; i < res.data.data.all.length; i ++) {
              this.slots[0].values.push(res.data.data.all[i]);
            }
            this.companyPopup = true;
          }
        })
      },
      // 快递公司picker的确认按钮
      companyDone() {
        this.companyPopup = false;
        this.companyName = this.company.lcname;
      },
      // picker选择的快递公司改变
      companyChange(picker, values) {
        this.company = values[0];
      },
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  @import "../../../common/css/index";
.m-backDetail{
  min-height: 100vh;
  background-color: #eee;
  .m-orderDetail-status{
    .flex-row(flex-end);
    width: 100%;
    height: 220px;
    background-color: @mainColor;
    line-height: 36px;
    .m-icon-order-status{
      display: block;
      width: 288px;
      height: 147px;
      background: url("/static/images/icon-back-status.png") no-repeat;
      background-size: 100% 100%;
      margin-right: 40px;
    }
    .m-alert{
      color: #ffffff;
    }
  }
  .m-back-info-box{
    padding: 0 50px 0;
    background-color: #fff;
    margin-bottom: 20px;
    text-align: left;
    .m-back-info{
      padding: 28px 0;
      border-bottom: 1px solid #ccc;
      text-align: left;
    }
    .m-product-text{
      padding-left: 0;
      padding-top: 28px;
      color: #666;
    }
    .m-company-popup {
      width: 750px;
      .m-popup-btn {
        display: flex;
        justify-content: space-between;
        font-size: 28px;
        padding: 20px 40px 0 40px;
      }
    }
    .m-back-info-btn{
      padding: 34px 0 55px 30px;
      text-align: right;
      span{
        display: inline-block;
        padding: 5px 41px;
        line-height: 41px;
        text-align: center;
        border-radius: 30px;
        border: 2px solid #ccc;
        color: #999;
      }
    }
  }
  .m-back-product{
    background-color: #fff;
    box-shadow:0 5px 5px rgba(0,0,0,0.16);
    text-align: left;
    padding: 20px 0;
    color: #666;
    h3{
      padding: 0 0 20px 50px;
    }
    .m-back-product-info{
      .flex-row(flex-start);
      padding: 0 50px 30px 50px;
      /*background-color: #eee;*/
      img{
        display: block;
        width: 119px;
        height: 119px;
        background-color: #9fd0bf;
        margin-right: 20px;
      }
      .m-product-select{
        font-size: 21px;
        margin-top: 59px;
      }
    }
  }
  .m-product-text{
    padding-left: 50px;
    font-size: 21px;
    line-height: 40px;
    text-align: left;
  }
  .m-input{
    display: inline-block;
    width: 440px;
    height: 50px;
    border: 1px solid #ccc;
    border-radius: 30px;
    margin: 10px 0;
    padding: 0 20px;
  }
}
</style>
