<template>
  <div class="m-submitOrder">
    <div class="m-one-part m-address-part" @click="changeRoute('/personal/addressManagement', 'choose')">
      <div class="m-left" v-if="!address_info.uaphone">
        <div class="m-address-name">
          <div>
            <span class="m-border"></span>
            <span>{{address_info.uaname}}</span>
          </div>
        </div>
      </div>
      <div class="m-left" v-if="address_info.uaphone">
        <div class="m-address-name">
          <div>
            <span class="m-border"></span>
            <span>收货人：{{address_info.uaname}}</span>
          </div>
          <span>{{address_info.uaphone}}</span>
        </div>
        <p class="m-address-p">
          收货地址：{{address_info.addressinfo}}
        </p>
      </div>
      <span class="m-icon-more"></span>
    </div>
    <div class="m-one-part" v-for="(items, index) in product_info">
      <h3 v-if="items.pb">{{items.pb.pbname}}</h3>
      <div class="m-product" v-for="(item, i) in items.cart">
        <div>
          <img :src="item.sku.skupic" class="m-product-img" alt="">
        </div>
        <div>
          <div class="m-title-box">
            <h3>{{item.product.prtitle}}</h3>
            <div>
              <p >{{item.sku.skuprice}}星币</p>
              <p>x{{item.canums}}</p>
            </div>
          </div>

          <p class="m-sku-select">
            <template v-for="(key,k) in item.sku.skuattritedetail" >
              <span >{{key}}</span>
              <span v-if="k < item.sku.skuattritedetail.length-1">；</span>
            </template>
          </p>
        </div>
      </div>
      <ul class="m-order-ul">
        <li class="m-sku-num">
          <span>商品金额</span>
          <div class="m-price">
            {{items.total}}星币
          </div>
        </li>
<!--        <li class="m-flex-between">-->
<!--          <span>配送方式</span>-->
<!--          <div @click="changeModel('show_picker',true)">-->
<!--            <span v-if="items.prfreight > 0">快递：￥{{items.prfreight | money}}元</span>-->
<!--            <span v-else>快递：包邮</span>-->
<!--            &lt;!&ndash;<span class="m-icon-more"></span>&ndash;&gt;-->
<!--          </div>-->
<!--        </li>-->
        <li class="m-message" >
          <span>买家留言：</span>
          <textarea  v-model="items.ommessage" id=""></textarea>
          <!--<textarea name="" id=""  placeholder="选填"></textarea>-->
        </li>
      </ul>
    </div>

    <div class="m-one-part">
      <ul class="m-order-ul">
        <li class="m-sku-num">
          <span>总计金额</span>
          <div class="m-price">
            {{total_money }}星币
          </div>
        </li>
        <li class="m-flex-between" >
          <span>付款方式</span>
          <div>
            <span>星币</span>
          </div>
        </li>
      </ul>
    </div>
    <div class="m-order-btn">
      <span  @click="show_modal = true">提交订单</span>
    </div>
    <div class="m-modal-pwd" v-if="show_modal ">
      <div class="m-modal-state" @click.self="closeModel">
        <div class="m-one">
          <img src="/static/images/product/icon-close.png" class="m-close" @click="closeModel" alt="">
          <h3>请输入星币支付密码</h3>
        </div>
        <div class="m-one">
          <img src="/static/images/newpersonal/icon-star-can.png" class="m-icon" alt="">
          <span class="m-star-num">160</span>
        </div>
        <div class="m-one m-flex-between">
          <span>星币余额</span>
          <span >160币</span>
        </div>
        <div >
          <input ref="pwd" type="tel" maxlength="6" v-model="msg" class="pwd" unselectable="on" />
          <ul class="m-input-box" @click="focus">
            <li :class="msg.length == 0?'psd-blink':''" class="m-setPwd-input"><i v-if="msg.length > 0"></i></li>
            <li :class="msg.length == 1?'psd-blink':''" class="m-setPwd-input"><i v-if="msg.length > 1"></i></li>
            <li :class="msg.length == 2?'psd-blink':''" class="m-setPwd-input"><i v-if="msg.length > 2"></i></li>
            <li :class="msg.length == 3?'psd-blink':''" class="m-setPwd-input"><i v-if="msg.length > 3"></i></li>
            <li :class="msg.length == 4?'psd-blink':''" class="m-setPwd-input"><i v-if="msg.length > 4"></i></li>
            <li :class="msg.length == 5?'psd-blink':''" class="m-setPwd-input"><i v-if="msg.length > 5"></i></li>
          </ul>
          <p class="m-forget">忘记密码？</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import common from '../../../common/js/common';
  import axios from 'axios';
  import api from '../../../api/api';
  import { Toast } from 'mint-ui';

  export default {
    data() {
      return {
        product_info:null,
        show_picker :false,
        show_coupon:false,
        slots: [
          {
            flex: 1,
            values: ['2015-01', '2015-02', '2015-03', '2015-04', '2015-05', '2015-06'],
            className: 'slot1',
            textAlign: 'center'
          }
        ],
        picker_params: 'company',
        address_info: { uaname: '没有地址信息，请点此添加' },
        index: "",                // 暂存点击的是哪个商家的优惠券
        total_money: 0,
        uaid: "",                 // 收货地址id
        msg:'',
        show_modal:false
      }
    },
    components: {  },
    beforeDestroy() {
      // 如果不是去选择地址，则把product的localstorage去除
      if(!sessionStorage.getItem('choose')) {
        localStorage.removeItem('product');
      }
    },
    created() {
      // 成功调起支付，该页面已使用过，从订单列表页返回时不打开
      if(sessionStorage.getItem('use') == 'used') {
        this.$router.go(-1);
        sessionStorage.removeItem('use');
      }
    },
    mounted() {
      common.changeTitle('提交订单');
      if(this.$route.query.product) {
        this.product_info = JSON.parse(this.$route.query.product);
      }else {           // 从购物车来
        this.product_info = JSON.parse(localStorage.getItem('product'));
      }

      let total = 0;
      for(let i = 0; i < this.product_info.length; i ++) {
        this.product_info[i].total = 0;
        // this.product_info[i].preview = 0;
        this.product_info[i].discount = 0;
        this.product_info[i].prfreight = 0;
        this.product_info[i].couponList = [];
        this.product_info[i].coupon_info = { caid: [] };
        for(let j = 0; j < this.product_info[i].cart.length; j ++) {
          if(this.product_info[i].cart[j].contentid && this.product_info[i].cart[j].contentid != ''){
            this.act = true;
          }
          this.product_info[i].cafrom = this.product_info[i].cart[j].cafrom;
          this.product_info[i].contentid = this.product_info[i].cart[j].contentid;
          console.log(this.product_info[i].cart[j].product)
          this.product_info[i].ipfreight += this.product_info[i].cart[j].product.ipfreight;

          this.product_info[i].total = this.product_info[i].total + Number(this.product_info[i].cart[j].sku.skuprice) * this.product_info[i].cart[j].canums;

        }
        if(this.product_info[i].ipfreight) {
          this.total_money = this.total_money + this.product_info[i].total + this.product_info[i].ipfreight
        }else {
          this.total_money = this.total_money + this.product_info[i].total
        }
        sessionStorage.setItem('total_money', this.total_money);
      }


      this.from = this.$route.query.from;
      this.uaid = localStorage.getItem("uaid");
      this.getOneAddress();

    },
    watch: {
      msg(curVal) {
        if(/[^\d]/g.test(curVal)) {
          this.msg = this.msg.replace(/[^\d]/g, '');
        }
        if(this.msg.length == 6){
          this.submitOrder();
        }
      },
    },
    methods: {

      // picker选择的付款方式
      payChange(picker, values) {
        // this.pay = values[0];
      },
      // 跳转其他页面的方法
      changeRoute(v, where) {

          this.$router.push(v);

      },
      // 获取默认地址
      getOneAddress() {
        let params = { token: localStorage.getItem('token') };
        if(this.uaid) {
          params.uaid = this.uaid;
        }
        axios.get(api.get_one_address, { params: params }).then(res => {
          if(res.data.status == 200) {
            this.address_info = res.data.data;
            this.uaid = res.data.data.uaid;
            localStorage.removeItem('uaid');      // 使用过uaid后将其删除
          }
        });
      },
      /*改变模态框*/
      changeModel(v, bool, index) {
        this[v] = bool;
        // if(index) {
        //   this.index = index - 1;
        //   this.couponList = this.product_info[this.index].couponList;
        //   // 优惠券显示内容精简
        //   for(let i in this.couponList) {
        //     if(this.couponList[i].cosubtration.toString().length > 4) {
        //       this.couponList[i].cosubtration = 999
        //     }
        //     this.couponList[i].codiscount = this.couponList[i].codiscount.toString().slice(0, 3)
        //   }
        // }
      },

      // 购物车或直接购买时创建订单并调起支付
      submitOrder() {

        if(!this.uaid) {
          Toast("请先选择收货地址");
          return false;
        }
        let params = {
          omclient: 0,
          uaid: this.uaid,
          info: []
        };
        params.omfrom = this.$route.query.from;
        for(let i = 0; i < this.product_info.length; i ++) {
          params.info[i] = {
            pbid: this.product_info[i].pb.pbid,
            ommessage: this.product_info[i].ommessage || "",
            skus: [],
          };
          params.info[i].coupons = [];
          if(this.product_info[i].coupon_info.coid) {
            params.info[i].coupons.push(this.product_info[i].coupon_info.coid);
          }

          for(let j = 0; j < this.product_info[i].cart.length; j ++) {
            if(this.product_info[i].cart[j].contentid && this.product_info[i].cart[j].contentid != ''){
              this.act = true;
            }
            let sku = {
              skuid: this.product_info[i].cart[j].sku.skuid,
              nums: this.product_info[i].cart[j].canums,
              cafrom:this.product_info[i].cart[j].cafrom,
              contentid:this.product_info[i].cart[j].contentid
            };
            params.info[i].skus.push(sku);
          }
        }
        if(this.act){
          localStorage.setItem('activityOrderNo', 4);
        }
        axios.post(api.integral_order + "?token=" + localStorage.getItem('token'), params).then(res => {
          if(res.data.status == 200) {
            if(this.payType.opaytype ==20) {
              // Toast(res.data.message);
              // this.giftPopup = true;

              if(this.act){
                this.$router.push("/activityOrder");
              }else{
                this.$router.push("/orderList?which=2");
              }

              // 成功调起支付，该页面已使用过，从订单列表页返回时不打开
              sessionStorage.setItem('use', 'used');
            }else {
              this.wxPay(res.data.data.args);
              localStorage.removeItem('product');
            }
          }
        });
      },
      focus() {
        this.$refs.pwd.focus();
      },
      closeModel(){
        this.show_modal = false;
        this.msg = '';
      },
      // 调起微信支付
      wxPay(data) {
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
              // 成功调起支付，该页面已使用过，从订单列表页返回时不打开
              sessionStorage.setItem('use', 'used');
              if(res.err_msg == "get_brand_wcpay_request:ok" ){             // 支付成功
                // 是从商家大礼包来结算的则弹出popup
                if(that.fromGift) {
                  this.$router.push("/orderList?which=2");
                }else if(that.from == 'new' || that.from == 'try' || that.isGuess || that.act) {
                  that.$router.push('/activityOrder');
                }else {     // 去待发货页
                  that.$router.push("/orderList?which=2");
                }
              }else if(res.err_msg == "get_brand_wcpay_request:cancel" ){   // 支付过程中用户取消
                Toast('支付已取消');
                if(that.from == 'new' || that.from == 'try' || that.isGuess ||that.act) {
                  that.$router.push('/activityOrder');
                }else {     // 去待付款页
                  that.$router.push("/orderList?which=1");
                }
              }else if(res.err_msg == "get_brand_wcpay_request:fail" ){     // 支付失败
                Toast('支付失败');
                if(that.from == 'new' || that.from == 'try' || that.isGuess || that.act) {
                  that.$router.push('/activityOrder');
                }else{     // 去待付款页
                  that.$router.push("/orderList?which=1");
                }
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
  @import "../../../common/css/index";
  .m-submitOrder{
    min-height: 100vh;
    color: #000;
    .m-icon-more{
      display: inline-block;
      width: 17px;
      height: 30px;
      background: url("/static/images/newpersonal/icon-more.png") no-repeat;
      background-size: 100% 100%;
      vertical-align: middle;
      margin-left: 10px;
    }
    .m-one-part {
      width: 100%;
      background-color: #fff;
      border-bottom: 20px solid #F4F4F4;
      text-align: left;
      .m-price{
        color: @mainColor;
      }
      &.m-address-part{
        display: flex;
        flex-flow: row;
        align-items: center;
        justify-content: space-between;
        padding: 30px 40px;
        box-sizing: border-box;
        .m-left{
          width: 100%;
        }
        .m-address-name{
          display: flex;
          flex-flow: row;
          align-items: center;
          justify-content: space-between;
          height: 50px;
          line-height: 50px;
          color: #666;
          .m-border{
            display: inline-block;
            width: 5px;
            height:50px;
            background:linear-gradient(180deg, @subColor 0%, @mainColor 100%);
            vertical-align: middle;
            margin-right: 15px;
          }
        }
        .m-address-p{
          text-align: left;
          color: #999;
          padding-left: 20px;
          line-height: 28px;
        }
      }
      h3{
        font-size: 24px;
        font-weight: 400;
        color: #333;
        margin-top: 10px;
        padding: 0 40px;
      }
      .m-product{
        display: flex;
        flex-flow: row;
        justify-content: flex-start;
        box-sizing: border-box;
        padding: 30px 40px;
        .m-title-box{
          display: flex;
          flex-flow: row;
          align-items: flex-start;
          justify-content: space-between;
          width: 530px;
        }
        h3{
          padding: 0;
          text-align: left;
          margin: 0;
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
        .m-product-img{
          display: block;
          width: 100px;
          height: 100px;
          background-color: #edb3b1;
          margin-right: 20px;
        }
        .m-sku-select{
          margin: 8px 0;
          color: #999;
        }
      }
      .m-order-ul{
        li{
          border-bottom: 1px solid #F2F2F2;
          padding: 28px 40px;
          box-sizing: border-box;
          &:last-child{
            border-bottom: none;
          }
          .m-code-input {
            text-align: right;
            border: 2px #EEEEEE solid !important;
            border-radius: 10px;
            padding: 0 30px;
            line-height: 50px;
            font-size: 24px;
          }
        }
      }
      .m-pay-popup {
        width: 750px;
        .m-popup-btn {
          display: flex;
          justify-content: space-between;
          font-size: 28px;
          padding: 20px 40px 0 40px;
        }
      }
      .m-message{
        display: flex;
        flex-flow: row;
        textarea{
          font-size: 24px;
          display: block;
          min-height: 50px;
          width: 400px;
          padding: 0 20px 10px 20px;
        }
      }
    }
    .m-order-btn{
      padding: 0;
      width:100%;
      margin-top: 100px;
      span{
        color: #ffffff;
        display: inline-block;
        width: 750px;
        height:106px;
        line-height: 106px;
        background: @mainColor;
        font-weight: bold;
        font-size: 38px;
      }
    }
    .m-modal-pwd{
      position: fixed;
      top:0;
      left: 0;
      width: 100%;
      height: 100vh;
      background-color: rgba(0,0,0,0.2);
      .m-modal-state{
        width: 600px;
        height: 500px;
        background-color: #fff;
        position: absolute;
        top: 50%;
        left: 50%;
        margin: -250px 0 0 -300px;
        .m-one{
          padding: 20px 40px;
          border-bottom: 1px solid #F2F2F2;
          h3{
            padding: 10px 0;
            font-size: 28px;
          }
          .m-close{
            position: absolute;
            top: 30px;
            right: 20px;
            width: 27px;
            height: 27px;
          }
          .m-icon{
            display: inline-block;
            width: 30px;
            height: 30px;
            margin-right: 10px;
          }
          .m-star-num{
            font-size: 52px;
            font-weight: 600;
            color: @mainColor;
          }
        }
        .m-forget{
          text-align: right;
          color: #000;
          padding-right: 40px;
        }
      }
      .m-input-box{
        .flex-row(center);
        /*margin: 90px;*/
        margin-bottom: 30px;
        .m-setPwd-input{
          display: block;
          width: 80px;
          height: 80px;
          line-height: 80px;
          text-align: center;
          border: 1px solid @mainColor;
          border-right: none;
          &:last-child{
            border-right: 1px solid @mainColor;
          }
          i {
            height: 10px;
            width: 10px;
            border-radius: 50%;
            background: #000;
            display: inline-block;
          }
        }
      }
      input[type=tel] {
        width: 0.1px;
        height: 0.1px;
        color: transparent;
        position: relative;
        top: 23px;
        background: #000000;
        left: 46px;
        border: none;
        font-size: 18px;
        opacity: 0;
        z-index: -1;
      }
      //光标
      .psd-blink {
        display: inline-block;
        /*background: url("./img/blink.gif") no-repeat center;*/
      }

    }
  }
</style>
