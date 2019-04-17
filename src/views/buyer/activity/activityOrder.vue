<template>
  <div class="m-orderList" @touchmove="touchMove">
    <div class="m-nav">
      <nav-list :navlist="nav_list" @navClick="navClick"></nav-list>
    </div>

    <mt-loadmore :top-method="loadTop" ref="loadmore">
      <div class="m-no-coupon" v-if="order_list.length == 0">
        <span class="m-no-img m-order-no-img"></span>
        <p>暂无订单哦,<span class="m-red">去下单</span>吧~</p>
      </div>
      <div class="m-orderList-content" v-else>
        <template v-for="(items,index) in order_list">
          <div class="m-one-part"  @click.stop="changeRoute('/orderDetail',items)">
            <div class="m-order-store-tile" >
              <div @click.stop="changeRoute('/brandDetail',items)">
                <span class="m-icon-store"></span>
                <span class="m-store-name">{{items.pbname}}</span>
                <span class="m-icon-more"></span>
              </div>
              <span class="m-red" v-if="items.omstatus != 25">{{items.omstatus_zh}}</span>
              <span class="m-red" v-else>已完成</span>
            </div>
            <div class="m-order-product-ul">
              <template v-for="(item,i) in items.order_part">
                <div class="m-product-info" >
                  <img :src="item.prmainpic" v-lazy="item.prmainpic" :key="item.prmainpic" class="m-product-img">
                  <div>
                    <p class="m-flex-between">
                      <span class="m-product-name">{{item.prtitle}}</span>
                      <span class="m-price" v-if="item.tlsprice">￥{{item.tlsprice | money}}</span>
                      <span class="m-price" v-else>￥{{item.skuprice | money}}</span>
                    </p>
                    <p class="m-flex-between">
                      <span class="m-product-label">
                        <template v-for="(key,k) in item.skuattritedetail" >
                        <span >{{key}}</span>
                        <span v-if="k < item.skuattritedetail.length-1">；</span>
                      </template>
                      </span>
                      <span >x{{item.opnum}}</span>
                    </p>
                  </div>
                </div>
                <p class="m-end-time" v-if="items.deposit_expires">押金返还时间：{{items.deposit_expires}}</p>
              </template>
              <ul class="m-order-btn-ul">
                <div class="duration-box">
                  <div v-if="items.duration">支付倒计时<span class="duration-text">{{items.min}}:{{items.sec}}</span></div>
                </div>
                <div>
                  <!--<li v-if="items.omstatus==10" @click.stop="changeRoute('/selectBack',items)">退款</li>-->
                  <li v-if="(items.omstatus==10 || items.omstatus==25 || items.omstatus==26) && !items.part_refund" @click.stop="changeRoute('/selectBack',items)">退款</li>
                  <li @click.stop="changeRoute('/logisticsInformation',items)" v-if="items.omstatus==20
                || items.omstatus == 30 || items.omstatus == 25">查看物流</li>
                  <!--<li v-if=" items.omstatus == -40">删除订单</li>-->
                  <li v-if="items.omstatus == 0" @click.stop="cancelOrder(items)">取消订单</li>
                  <li class="active" v-if="items.omstatus == 0" @click.stop="payBtn(items)">立即付款</li>
                  <li class="active" v-if="items.omstatus == 20" @click.stop="orderConfirm(items)">确认收货</li>
                  <li class="active" v-if="items.omstatus==25 && indexTemp != 3" @click.stop="changeRoute('/addComment', items)">评价</li>
                </div>
              </ul>
            </div>
          </div>
        </template>
      </div>
      <bottom-line v-if="bottom_show"></bottom-line>
    </mt-loadmore>
  </div>
</template>

<script>
  import common from '../../../common/js/common';
  import navList from '../../../components/common/navlist';
  import axios from 'axios';
  import api from '../../../api/api';
  import bottomLine from '../../../components/common/bottomLine';
  import { Toast, MessageBox } from 'mint-ui';

    export default {
      data() {
        return {
          nav_list: [],
          page_info: { page_num: 1, page_size: 10 },
          isScroll: true,
          total_count: 0,
          bottom_show: false,
          order_list: [],
          omfrom: 40,
          indexTemp: 0
        }
      },
      inject: ['reload'],
      components: { navList, bottomLine },
      mounted() {
        common.changeTitle('订单列表');
        this.getOrderNum();             // 获取各状态的订单数量
      },
      activated() {
        this.getOrderNum();             // 获取各状态的订单数量
      },
      methods: {
        changeRoute(v, item) {
          switch (v){
            case '/brandDetail':
              this.$router.push({ path: v, query: { pbid: item.pbid, pbname: item.pbname }});
              break;
            case '/orderDetail':
              this.$router.push({ path: v, query: { omid: item.omid , from: "activityProduct" }});
              break;
            case '/logisticsInformation':
              this.$router.push({ path: v, query: { omid: item.omid }});
              break;
            case '/selectBack':
              this.$router.push({ path: v, query: { product: JSON.stringify(item), allOrder: 1 }});
              break;
            case '/addComment':
              localStorage.setItem('productComment', JSON.stringify(item));
              this.$router.push({path:v,query:{product:JSON.stringify(item)}});
              break;
            default:
              this.$router.push(v)
          }
        },
        // 导航点击
        navClick(index) {
          this.indexTemp = index;
          localStorage.setItem('activityOrderNo', index);
          this.page_info.page_num = 1;
          this.total_count = 0;
          this.bottom_show = false;
          let arr = [].concat(this.nav_list);
          if(arr[index].active) {
            return false;
          }
          for(let i = 0; i < arr.length; i ++) {
            arr[i].active = false;
          }
          arr[index].active = true;
          this.nav_list = [].concat(arr);
          this.page_info.page_num = 1;
          this.omfrom = arr[index].omfrom;
          for(let i = 0; i < this.order_list.length; i ++) {
            if(this.order_list[i].time_interVal){
              clearInterval(this.order_list[i].time_interVal);
            }

          }
          this.getOrderList();
        },
        // 获取订单列表
        getOrderList() {
          let params = {
            token: localStorage.getItem('token'),
            page_num: this.page_info.page_num,
            page_size: this.page_info.page_size,
            omfrom: this.omfrom
          };
          axios.get(api.order_list, { params: params }).then(res => {
            if(res.data.status == 200) {
              this.isScroll = true;
              if(res.data.data.length > 0) {
                if(this.page_info.page_num > 1) {
                  this.order_list = this.order_list.concat(res.data.data);
                }else{
                  this.order_list = res.data.data;
                }
                this.page_info.page_num = this.page_info.page_num + 1;
                this.total_count = res.data.total_count;
              }else{
                this.order_list = [];
                this.page_info.page_num = 1;
                this.total_count = 0;
                return false;
              }
              for(let i in this.order_list) {
                if(this.order_list[i].duration) {
                  if(this.order_list[i].time_interVal){
                    clearInterval(this.order_list[i].time_interVal);
                  }
                  this.timeOut();       // 倒计时
                }
              }
            }
          })
        },
        // 倒计时
        timeOut() {
          for(let i in this.order_list) {
            if(this.order_list[i].duration) {
              if(this.order_list[i].duration.substr(0, 1) > -1) {
                this.order_list[i].min = 0;
                this.order_list[i].sec = 0;
                this.order_list[i].min = this.order_list[i].duration.substr(2, 2);
                this.order_list[i].sec = this.order_list[i].duration.substr(5, 2);
                let TIME_OUT = Number(this.order_list[i].min) * 60 + Number(this.order_list[i].sec);
                let count = TIME_OUT;
                if(this.order_list[i].time_interVal){
                  clearInterval(this.order_list[i].time_interVal);
                }
                this.order_list[i].time_interVal  = setInterval(() => {
                  if(count > 0 && count <= TIME_OUT) {
                    count --;
                    this.order_list[i].sec --;
                    if(this.order_list[i].sec < 10 && this.order_list[i].sec > -1) {
                      this.order_list[i].sec = '0' + this.order_list[i].sec;
                    }
                    if(this.order_list[i].sec == -1) {
                      this.order_list[i].sec = 59;
                      if(this.order_list[i].min > 0) {
                        this.order_list[i].min -= 1;
                      }
                      if(this.order_list[i].min < 10) {
                        if(this.order_list[i].min !== '00') {
                          this.order_list[i].min = '0' + this.order_list[i].min;
                        }else {
                          this.order_list[i].duration = null;
                        }
                      }
                    }
                    this.order_list = this.order_list.concat();
                  }else {
                    this.page_info.page_num = 1;
                    this.order_list[i].duration = null;
                    this.getOrderNum();             // 获取各状态的订单数量
                    clearInterval(this.order_list[i].time_interVal);
                  }
                }, 1000);
              }else {
                this.order_list[i].duration = null
              }
            }
          }
        },
        // 获取各状态的订单数量
        getOrderNum() {
          axios.get(api.order_count + "?ordertype=act&token=" + localStorage.getItem('token')).then(res => {
            if(res.data.status == 200) {
              for(let i = 0; i < res.data.data.length; i ++) {
                res.data.data[i].active = false;
              }
              // res.data.data[0].active = true;
              this.nav_list = [].concat(res.data.data);

              if(localStorage.getItem('activityOrderNo')) {
                this.navClick(localStorage.getItem('activityOrderNo'));         // 导航点击
              }else {
                this.navClick(0);                // 导航点击
              }
            }
          })
        },
        //滚动加载更多
        touchMove(e) {
          let scrollTop = common.getScrollTop();
          let scrollHeight = common.getScrollHeight();
          let ClientHeight = common.getClientHeight();
          if (scrollTop + ClientHeight  >= scrollHeight -10) {
            if(this.isScroll){
              this.isScroll = false;
              if(this.order_list.length == this.total_count){
                this.bottom_show = true;
              }else{
                for(let i = 0; i < this.order_list.length; i ++) {
                  if(this.order_list[i].time_interVal){
                    clearInterval(this.order_list[i].time_interVal);
                  }

                }
                for(let i = 0; i < this.nav_list.length; i ++) {
                  if(this.nav_list[i].active) {
                    this.getOrderList();
                  }
                }
              }
            }
          }
        },
        // 下拉刷新
        loadTop() {
          this.page_info.page_num = 1;
          for(let i = 0; i < this.order_list.length; i ++) {
            if(this.order_list[i].time_interVal){
              clearInterval(this.order_list[i].time_interVal);
            }

          }
          for(let i = 0; i < this.nav_list.length; i ++) {
            if(this.nav_list[i].active) {
              this.omfrom = this.nav_list[i].omfrom;
              this.getOrderNum();             // 获取各状态的订单数量
            }
          }
          this.$refs.loadmore.onTopLoaded();
        },
        // 请求微信支付参数
        payBtn(items) {
          let params = { omid: items.omid, omclient: '0', opaytype: '0' };
          axios.post(api.order_pay + '?token='+ localStorage.getItem('token'), params).then(res => {
            if(res.data.status == 200) {
              this.wxPay(res.data.data.args, items.omid);
            }
          });
        },
        // 调起微信支付
        wxPay(data, omid) {
          let that = this;
          function onBridgeReady() {      // 微信支付接口
            WeixinJSBridge.invoke(
              'getBrandWCPayRequest', {
                "appId": data.appId,                 // 公众号名称，由商户传入
                "timeStamp": data.timeStamp,         // 时间戳，自1970年以来的秒数
                "nonceStr": data.nonceStr,           // 随机串
                "package": data.package,             // 统一下单接口返回的prepay_id参数值
                "signType": data.signType,           // 微信签名方式
                "paySign": data.sign                 // 微信签名
              },
              function(res){
                // console.log(res);
                if(res.err_msg == "get_brand_wcpay_request:ok" ){             // 支付成功
                  that.$router.push({ path: '/orderDetail', query: { omid: omid, from: 'activityProduct' }});
                }else if(res.err_msg == "get_brand_wcpay_request:cancel" ){   // 支付过程中用户取消
                  Toast('支付已取消');
                }else if(res.err_msg == "get_brand_wcpay_request:fail" ){     // 支付失败
                  Toast('支付失败');
                }
              });
          }
          if (typeof WeixinJSBridge == "undefined"){
            if( document.addEventListener ){
              document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
            }else if (document.attachEvent){
              document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
              document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
            }
          }else{
            onBridgeReady();
          }
        },
        // 确认收货
        orderConfirm(items) {
          MessageBox.confirm('是否确认该订单的收货？').then(() => {
            axios.post(api.order_confirm + '?token='+ localStorage.getItem('token'), { omid: items.omid }).then(res => {
              if(res.data.status == 200){
                this.reload();
              }
            });
          }).catch(() => {

          });
        },
        // 取消订单
        cancelOrder(item) {
          MessageBox.confirm('是否取消该订单？').then(() => {
            this.page_info.page_num = 1;
            axios.post(api.cancle_order + '?token=' + localStorage.getItem('token'),
              { omid:item.omid }).then(res => {
              if(res.data.status == 200) {
                this.getOrderList();
              }
            })
          }).catch(() => {

          });
        }
      }
    }
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "../../../common/css/index";
  .m-orderList{
    min-height: 100vh;
    padding-bottom: 30px;
    .m-nav{
      background-color: #fff;
    }
    .m-nav-list{
      padding: 0 26px ;
    }
    .m-no-coupon{
      margin-top: 300px;
    }
    .m-orderList-content{
      padding: 26px;
      .m-icon-more{
        display: inline-block;
        width: 22px;
        height: 22px;
        background: url("/static/images/icon-more.png") no-repeat;
        background-size: 100% 100%;
      }
      .m-one-part{
        background-color: #fff;
        padding: 30px 37px;
        border-radius: 10px;
        box-shadow:0 5px 6px rgba(0,0,0,0.16);
        margin-bottom: 20px;
        .m-end-time {
          text-align: right;
        }
        .m-order-store-tile{
          .flex-row(space-between);
          .m-icon-store{
            display: inline-block;
            width: 31px;
            height: 29px;
            background: url("/static/images/icon-store.png") no-repeat;
            background-size: 100% 100%;
            vertical-align: text-bottom;
          }
          .m-store-name{
            display: inline-block;
            margin: 0 25px;
          }
        }
        .m-order-product-ul{
          margin-top: 16px;
          .m-product-info{
            display: flex;
            flex-flow: row;
            justify-content: flex-start;
            margin: 15px 0;
            .m-product-img{
              display: block;
              width: 153px;
              height: 153px;
              background-color: #9fd0bf;
              margin-right: 30px;
            }
            p{
              line-height: 36px;
            }
            .m-product-name{
              display: block;
              width: 350px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              text-align: left;
            }
            .m-product-label{
              color: #999999;
              font-size: 21px;
            }
          }
          .m-order-btn-ul{
            display: flex;
            justify-content: space-between;
            text-align: right;
            color: #999;
            margin-top: 20px;
            .duration-box {
              margin-top: 10px;
              .duration-text {
                font-size: 24px;
                font-weight: bold;
                color: @mainColor;
                margin-left: 10px;
              }
            }
            li{
              display: inline-block;
              width: 129px;
              height: 41px;
              line-height: 41px;
              text-align: center;
              border: 1px solid #999;
              border-radius: 30px;
              margin-left: 15px;
              &.active{
                color: #ffffff;
                background-color: @mainColor;
                border: 1px solid @mainColor;
              }
            }
          }
        }
      }
    }
  }
</style>
