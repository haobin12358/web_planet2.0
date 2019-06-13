<template>
  <!--<div class="m-orderList">-->
  <div class="m-orderList" @touchmove="touchMove">
    <!-- <span class="m-icon-back" @click="changeBack"></span> -->
    <div class="m-nav">
      <nav-list :navlist="nav_list" @navClick="navClick"></nav-list>
    </div>

    <mt-loadmore :top-method="loadTop" ref="loadmore">
      <div class="m-no-coupon" v-if="order_list.length == 0">
        <!-- <span class="m-no-img m-order-no-img"></span> -->
        <p>暂无订单,<span class="m-red">去选购</span></p>
      </div>
      <div class="m-orderList-content" v-else>
        <template v-for="(items,index) in order_list">
          <div class="w-one">
            <!-- <div class="m-one-part" @click.stop="changeRoute('/orderDetail',items)"> -->
            <div class="m-one-part" @click.stop="judgeOrder(items)">
              <div class="m-order-store-tile">
                <div @click.stop="changeRoute('/brandDetail',items)">
                  <span class="m-icon-store"></span>
                  <span class="m-store-name">{{items.pbname}}</span>
                  <span class="m-icon-more"></span>
                </div>
                <span class="m-red">{{items.omstatus_zh}}</span>
                <!-- <span v-if="items.order_refund_apply==null" class="m-red">{{items.omstatus_zh}}</span>
                <span v-else class="m-red">{{items.order_refund_apply.orastatus_zh}}</span> -->
              </div>
              <div class="m-order-product-ul">
                <template v-for="(item, i) in items.order_part">
                  <div class="m-product-info">
                    <div>
                      <img class="m-product-img" :src="item.prmainpic" alt="">
                    </div>
                    <div>
                      <p class="m-flex-between">
                        <span class="m-product-name">{{item.prtitle}}</span>
                        <span class="m-price" v-if="item.tlsprice && items.omfrom != 80">￥{{item.tlsprice | money}}</span>
                        <span class="m-price" v-else-if="items.omfrom == 80">{{item.skuprice}}币</span>
                        <span class="m-price" v-else>￥{{item.skuprice | money}}</span>
                      </p>
                      <p class="m-flex-between">
                        <span class="m-product-label">
                          <template v-for="(key,k) in item.skuattritedetail">
                            <span>{{key}}</span>
                            <span v-if="k < item.skuattritedetail.length-1">；</span>
                          </template>
                        </span>
                        <span>x{{item.opnum}}</span>
                      </p>
                    </div>
                  </div>
                </template>
                <p class="m-end-time" v-if="items.deposit_expires">押金返还时间：{{items.deposit_expires}}</p>
                <div class="m-total-money" v-else>共{{items.order_part.length}}件商品 合计：<span v-if="items.omfrom_zh == '星币商城'">{{items.omtruemount}}星币</span><span class="w-price" v-else>￥{{items.omtruemount | money}}</span></div>
                <ul class="m-order-btn-ul" v-if="!items.ominrefund">
                  <div class="duration-box">
                    <div v-if="items.duration">支付倒计时<span class="duration-text">{{items.min}}:{{items.sec}}</span></div>
                  </div>
                  <div>
                    {{(items.omstatus==10 || items.omstatus==25 || items.omstatus==26) && !items.part_refund && items.omfrom !=80}}
                    <li v-if="(items.omstatus==10 || items.omstatus==25 || items.omstatus==26) && !items.part_refund && items.omfrom !=80"
                      @click.stop="changeRoute('/selectBack',items)">退款</li>
                    <li v-if="items.omstatus==20 || items.omstatus==25"
                      @click.stop="changeRoute('/logisticsInformation',items)">查看物流</li>
                    <li v-if="items.omstatus==-40" @click.stop="deleteOrder(items)">删除订单</li>
                    <li v-if="items.omstatus==0" @click.stop="cancelOrder(items)">取消订单</li>
                    <li class="active" v-if="items.omstatus==20" @click.stop="orderConfirm(items)">确认收货</li>
                    <li class="active" v-if="items.omstatus==0" @click.stop="payBtn(items)">立即付款</li>
                    <li class="active" v-if="items.omstatus==25 && indexTemp != 3" @click.stop="changeRoute('/addComment', items)">评价</li>
                  </div>
                </ul>
              </div>
            </div>
          </div>
        </template>
      </div>
      <bottom-line v-if="bottom_show"></bottom-line>
    </mt-loadmore>
    <div class="m-modal-pwd" v-if="show_modal ">
      <div class="m-modal-state" @click.self="show_modal = false">
        <div class="m-one">
          <img src="/static/images/product/icon-close.png" class="m-close" @click="show_modal = false" alt="">
          <h3>请输入星币支付密码</h3>
        </div>
        <div class="m-one">
          <img src="/static/images/newpersonal/icon-star-can.png" class="m-icon" alt="">
          <span class="m-star-num">{{omtruemount}}</span>
        </div>
        <div class="m-one m-flex-between">
          <span>星币余额</span>
          <span >{{usintegral}}币</span>
        </div>
        <div >
          <input ref="pwd" type="tel" maxlength="6" v-model="msg" class="pwd" unselectable="on" autofocus />
          <ul class="m-input-box" @click="focus">
            <li :class="msg.length == 0?'psd-blink':''" class="m-setPwd-input"><i v-if="msg.length > 0"></i><s></s></li>
            <li :class="msg.length == 1?'psd-blink':''" class="m-setPwd-input"><i v-if="msg.length > 1"></i><s></s></li>
            <li :class="msg.length == 2?'psd-blink':''" class="m-setPwd-input"><i v-if="msg.length > 2"></i><s></s></li>
            <li :class="msg.length == 3?'psd-blink':''" class="m-setPwd-input"><i v-if="msg.length > 3"></i><s></s></li>
            <li :class="msg.length == 4?'psd-blink':''" class="m-setPwd-input"><i v-if="msg.length > 4"></i><s></s></li>
            <li :class="msg.length == 5?'psd-blink':''" class="m-setPwd-input"><i v-if="msg.length > 5"></i><s></s></li>
          </ul>
          <p class="m-forget" @click="changeRoute('/personal/editInput', 'forget')">忘记密码？</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import common from '../../../common/js/common';
  import navList from '../../../components/common/navlist';
  import axios from 'axios';
  import api from '../../../api/api';
  import {
    Toast,
    MessageBox
  } from 'mint-ui';
  import bottomLine from '../../../components/common/bottomLine';

    export default {
      data(){
        return{
          nav_list: [],
          page_info: { page_num: 1, page_size: 10 },
          isScroll: true,
          total_count: 0,
          bottom_show: false,
          order_list: [],
          show_modal:false,
          msg:'',
          omtruemount:0,
          omid:'',
          usintegral:0
        }
      },
      inject: ['reload'],
      components: { navList, bottomLine },
      mounted(){
        common.changeTitle('订单列表');
        this.getOrderNum();               // 获取各状态的订单数量
      },
      activated() {
        this.getOrderNum();               // 获取各状态的订单数量
      },
      // 引入keepAlive后代替beforeDestroy
      deactivated() {
        if(this.$route.path == '/orderDetail' || this.$route.path == '/logisticsInformation' || this.$route.path == '/addComment') {
          localStorage.setItem('orderListDetail', 1);
        }else {
          localStorage.setItem('orderListDetail', 0);
          localStorage.removeItem('orderList');
        }
      },
      watch: {
        msg(curVal) {
          if(/[^\d]/g.test(curVal)) {
            this.msg = this.msg.replace(/[^\d]/g, '');
          }
          if(this.msg.length == 6){
            // this.submitOrder();
            this.payOrder();
          }
        },
      },
      methods:{
        changeBack(){
          this.$router.go(-1);
        },
        changeRoute(v,item) {
          switch (v){
            case '/brandDetail':
              this.$router.push({ path: v, query: { pbid: item.pbid, pbname: item.pbname }});
              break;
            case '/orderDetail':
              this.$router.push({path:v,query:{omid:item.omid}});
              break;
            case '/logisticsInformation':
              this.$router.push({path:v,query:{omid:item.omid}});
              break;
            case '/selectBack':
              this.$router.push({path:v,query:{product:JSON.stringify(item),allOrder:1}});
              break;
            case '/addComment':
              localStorage.setItem('productComment', JSON.stringify(item));
              this.$router.push(v);
              // this.$router.push({path:v,query:{product:JSON.stringify(item)}});
              break;
            case '/backDetail':
              this.$router.push({path:v,query:{omid:item.omid}});
              break;

            case '/personal/editInput':
              this.$router.push({path:v,query:{from:'password',way:item}});
              break;
            default:
              this.$router.push(v)
          }
        },
        // 判断订单状态进行跳转
        judgeOrder(items){
          if(!items.ominrefund){
            this.changeRoute('/orderDetail',items);
          }else{
            this.changeRoute('/backDetail',items);
          }
        },
        // 导航点击
        navClick(index) {
          localStorage.setItem('orderList', index);
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
          for(let i = 0; i < this.order_list.length; i ++) {
            if(this.order_list[i].time_interVal){
              clearInterval(this.order_list[i].time_interVal);
            }

          }
          this.getOrderList(arr[index].status);
        },
        // 获取各状态的订单数量
        getOrderNum() {
          axios.get(api.order_count + "?token=" + localStorage.getItem('token')).then(res => {
            if(res.data.status == 200) {
              for(let i = 0; i < res.data.data.length; i ++) {
                res.data.data[i].active = false;
              }
              this.nav_list = [].concat(res.data.data);

              // 显示哪个类型的订单
              for(let i = 0; i < this.nav_list.length; i ++) {
                this.nav_list[i].active = false;
              }
              let which = '';
              if(localStorage.getItem('orderListDetail') != 0) {
                if(localStorage.getItem('orderList')) {
                  which = localStorage.getItem('orderList');
                }else {
                  which = this.$route.query.which;
                }
              }else {
                which = this.$route.query.which;
              }
              if(which) {
                this.navClick(which);
              }else {
                this.nav_list[0].active = true;
                this.getOrderList();
              }
            }
          })
        },
        // 获取订单列表
        getOrderList(omstatus) {
          let params = {
            token: localStorage.getItem('token'),
            page_num: this.page_info.page_num,
            page_size: this.page_info.page_size,
            omstatus: omstatus
          };
          axios.get(api.order_list, { params: params }).then(res => {
            if(res.data.status == 200){
              this.isScroll = true;
              if(res.data.data.length > 0){
                if(this.page_info.page_num > 1){
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
              for(let i = 0; i < this.order_list.length; i ++) {
                if(this.order_list[i].duration) {
                  if(this.order_list[i].time_interVal){
                    clearInterval(this.order_list[i].time_interVal);
                  }
                  this.timeOut();       // 倒计时
                }
                for(let j = 0; j < this.order_list[i].order_part.length; j ++) {
                  if(this.order_list[i].order_part[j].opisinora) {
                    this.order_list[i].part_refund = true;
                  }
                }
              }
            }
          })
        },
        // 倒计时
        timeOut() {
          let arr = [].concat(this.order_list);
          let arr_int = [];
          for(let i in arr) {
            if(arr[i].duration) {
              if(arr[i].duration.substr(0, 1) > -1) {
                arr[i].min = 0;
                arr[i].sec = 0;
                arr[i].min = arr[i].duration.substr(2, 2);
                arr[i].sec = arr[i].duration.substr(5, 2);
                let TIME_OUT = Number(arr[i].min) * 60 + Number(arr[i].sec);
                arr[i].count = TIME_OUT;
                if(arr[i].time_interVal){
                  clearInterval(arr[i].time_interVal);
                }
                arr[i].time_interVal  = setInterval(() => {
                  if( arr[i].count > 0 &&  arr[i].count <= TIME_OUT) {
                    arr[i].count --;
                    arr[i].sec --;
                    if(arr[i].sec < 10 && arr[i].sec > -1) {
                      arr[i].sec = '0' + arr[i].sec;
                    }
                    if(arr[i].sec == -1) {
                      arr[i].sec = 59;
                      if(arr[i].min > 0) {
                        arr[i].min -= 1;
                      }
                      if(arr[i].min < 10) {
                        if(arr[i].min !== '00') {
                          arr[i].min = '0' + arr[i].min;
                        }else {
                          arr[i].duration = null;
                        }
                      }
                    }
                    this.order_list = [].concat(arr);
                  }else {
                    this.page_info.page_num = 1;
                    this.order_list[i].duration = null;
                    this.getOrderNum();               // 获取各状态的订单数量
                    clearInterval(arr[i].time_interVal);
                  }
                }, 1000);
                console.log(arr_int)
              }else {
                this.order_list[i].duration = null
              }
            }
          }
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
                for(let i=0;i<this.nav_list.length;i++){
                  if(this.nav_list[i].active){

                    this.getOrderList(this.nav_list[i].status);
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
              this.getOrderList(this.nav_list[i].status);          // 获取订单列表
            }
          }
          this.$refs.loadmore.onTopLoaded();
        },
        // 取消订单
        cancelOrder(item) {
          MessageBox.confirm('是否取消该订单？').then(() => {
            axios.post(api.cancle_order + '?token='+ localStorage.getItem('token'), { omid: item.omid }).then(res => {
              if(res.data.status == 200){
                this.reload();
              }
            });
          }).catch(() => {

          });
        },
        // 删除订单
        deleteOrder(item) {
          MessageBox.confirm('是否删除该订单？').then(() => {
            axios.post(api.order_delete + '?token='+ localStorage.getItem('token'), { omid: item.omid }).then(res => {
              if(res.data.status == 200){
                this.reload();
              }
            });
          }).catch(() => {

          });
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
        // 请求微信支付参数
        payBtn(items) {
          let params = { omid: items.omid, omclient: '0', opaytype: '0' };
          if(items.omfrom_zh == '星币商城'){
            this.omtruemount = items.omtruemount;
            this.omid = items.omid;
            this.usintegral = items.usintegral;
            this.show_modal = true;
          }else{
            axios.post(api.order_pay + '?token='+ localStorage.getItem('token'), params).then(res => {
              if(res.data.status == 200) {

                  this.wxPay(res.data.data.args, items.omid);

              }
            });
          }

        },
        payOrder(){
          this.$http.post(this.$api.order_pay + '?token=' +localStorage.getItem('token'),{
            omid:this.omid,
            omclient:0,
            opaytype:30,
            uspaycode:this.msg,
            omtruemount: this.omtruemount
          }).then(res => {
            Toast(res.data.message);
            this.msg = '';
            if(res.data.status == 200){
              // this.$router.push("/orderList");
              this.$router.push({ path: '/orderDetail', query: { omid: this.omid }});
              this.show_modal = false;
            }else if(res.data.message == '请输入正确的支付密码'){
              this.show_modal = true;
            }
          })
        },
        focus() {
          this.$refs.pwd.focus();
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
                  that.$router.push({ path: '/orderDetail', query: { omid: omid }});
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
        }
      }
    }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  @import "../../../common/css/orderList";

</style>
