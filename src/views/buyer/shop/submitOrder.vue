<template>
    <div class="m-submitOrder">
      <div class="m-one-part m-pl-s m-pr-s m-address-part" @click="changeRoute('personal/addressManagement', 'choose')">
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
              <div >
                <p  v-if="act && item.sku.tlsprice">￥{{item.sku.tlsprice | money}}</p>
                <p v-else>￥{{item.sku.skuprice | money}}</p>
                <p class="m-num-product">x{{item.canums}}</p>
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
            <span>购买金额</span>
            <div >
              ￥{{items.total | money}}
            </div>
          </li>
          <li class="m-sku-num" v-if="from != 'try' && !isGuess && !fromGift">
            <span>预计收益</span>
            <div class=" m-price">
              ￥{{items.preview | money}}
            </div>
          </li>
          <li class="m-sku-num" v-if="isGuess">
            <span>减免金额</span>
            <div class="m-price">
              ￥{{items.discount | money}}
            </div>
          </li>
          <li class="m-flex-between">
            <span>配送方式</span>
            <div @click="changeModel('show_picker',true)">
              <span v-if="items.prfreight > 0">快递：￥{{items.prfreight | money}}元</span>
              <span v-else>快递：包邮</span>
              <!--<span class="m-icon-more"></span>-->
            </div>
          </li>

          <li class="m-flex-between" @click="changeModel('show_coupon',true, index + 1)" v-if="!isGuess">
            <span>优惠选择</span>
            <div v-if="items.couponList.length > 0">
              <span class="m-coupon-label" v-if="items.coupon_info.coname">{{items.coupon_info.coname}}</span>
              <span v-else>请选择优惠券</span>
              <span class="m-icon-more"></span>
            </div>
            <div v-else>
              <span>暂无优惠券</span>
            </div>
          </li>
          <li class="m-message" v-if="!isGuess">
            <span>买家留言：</span>
            <textarea  v-model="items.ommessage" id=""></textarea>
            <!--<textarea name="" id=""  placeholder="选填"></textarea>-->
          </li>
        </ul>
      </div>
      <div class="m-one-part">
        <ul class="m-order-ul">
          <li class="m-flex-between" v-if="!isGuess && !fromGift && star_info.can_reduce">
            <span>星币抵扣</span>
            <div class="m-flex-end">
              <span class="m-price">可用{{star_info.reduce_integral}}星币抵扣{{star_info.reduce_mount}}元</span>
              <img src="/static/images/order/icon-radio-active.png" class="m-radio" v-if="show_star" @click="changeStar" alt="">
              <img src="/static/images/order/icon-radio.png" class="m-radio" v-else @click="changeStar"  alt="">
            </div>
          </li>
          <li class="m-sku-num">
            <span>总计金额</span>
            <div class=" m-price" v-if="$route.query.spreadprice">
              ￥{{$route.query.spreadprice  | money}}
            </div>
            <div class=" m-price" v-else>
              ￥{{ total_money| money}}
            </div>
          </li>
          <li class="m-flex-between" v-if="!fromGift">
            <span>付款方式</span>
            <div>
              <span>微信</span>
            </div>
          </li>
          <li class="m-flex-between" v-else>
            <span>付款方式</span>
            <div>
              <span @click="payPopup = true">{{payType.name}}</span>
              <span class="m-icon-more"></span>
            </div>
          </li>
          <li class="m-flex-between" v-if="payType.opaytype == 20">
            <span>激活码</span>
            <input class="m-code-input" v-model="code" type="text" placeholder="请填写激活码">
          </li>
        </ul>
        <!--付款方式picker-->
        <mt-popup class="m-pay-popup" v-model="payPopup" position="bottom">
          <div class="m-popup-btn">
            <div @click="payPopup = false">取消</div>
            <div @click="payDone">确认</div>
          </div>
          <mt-picker :slots="paySlots" valueKey="name" @change="payChange"></mt-picker>
        </mt-popup>
      </div>
      <!--商家大礼包支付成功的popup-->
<!--      <mt-popup class="m-gift-popup" v-model="giftPopup" pop-transition="popup-fade">-->
<!--        <img class="m-gift-popup-img" src="/static/images/icon-out-know.png" alt="">-->
<!--        <div class="m-ft-30 m-ft-b">支付成功</div>-->
<!--&lt;!&ndash;        <div class="m-gift-popup-text m-ft-24">支付成功，提交申请并完成审批即可成为卖家。</div>&ndash;&gt;-->
<!--&lt;!&ndash;        <div class="m-gift-popup-btn m-ft-30 m-ft-b" @click="changeRoute('/storekeeper/IDCardApprove')">填写申请</div>&ndash;&gt;-->
<!--      </mt-popup>-->

      <div class="m-order-btn">
        <!--试用商品、新人商品-->
        <span v-if="from == 'new' || from == 'try'" @click="submitOrderActivity">提交订单</span>
        <span v-else-if="isGuess" @click="submitGuessOrder">提交订单</span>
        <!--开店大礼包、购物车或直接下单-->
        <span v-else @click="submitOrder">提交订单</span>
      </div>

      <mt-popup v-model="show_coupon" popup-transition="popup-fade" class="m-coupon-modal">
        <div class="m-coupon-head">
          <span>选择优惠券</span>
          <img src="/static/images/product/icon-close.png" @click="show_coupon = false" alt="">
        </div>
        <div class="m-coupon-modal-content">
          <coupon :couponList="couponList" :order="true" @couponClick="couponClick"></coupon>
        </div>
      </mt-popup>
<!--      <mt-popup v-model="show_star" popup-transition="popup-fade" class="m-coupon-modal">-->
<!--          <div class="m-coupon-head">-->
<!--            <span></span>-->
<!--            <img src="/static/images/product/icon-close.png" @click="show_star = false" alt="">-->
<!--          </div>-->
<!--          <div class="m-star-ul">-->
<!--            <div class="m-item m-flex-between m-sku-num">-->
<!--              <span>抵用星币</span>-->
<!--              <div class="m-num">-->
<!--                <span class="m-icon-cut" >-</span>-->
<!--                <input type="number"  class="m-num-input" >-->
<!--                <span class="m-icon-add cancel" >+</span>-->
<!--              </div>-->
<!--            </div>-->
<!--            <div class="m-item m-flex-between ">-->
<!--              <span>我的星币</span>-->
<!--              <span class="m-price">123星币</span>-->
<!--            </div>-->
<!--          </div>-->
<!--      </mt-popup>-->
    </div>
</template>

<script type="text/ecmascript-6">
  import common from '../../../common/js/common';
  import axios from 'axios';
  import api from '../../../api/api';
  import { Toast } from 'mint-ui';
  import coupon from '../components/couponCard';

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
          couponList: [],           // 优惠券list
          fromGift: false,          // 是否是商家大礼包的结算页面
          giftPopup: false,         // 商家大礼包支付后的popup
          from: "",                 // undefined是立即购买，0是从购物车结算，activityProduct是试用商品
          payPopup: false,                   // 支付方式picker
          paySlots: [{ values: [{ name: "微信", opaytype: 0 }, { name: "激活码", opaytype: 20 }]}],
          pay: "",                           // 暂存支付方式
          payType: { name: '微信' },          // 支付方式
          code: '',                           // 激活码
          isGuess: false,                     // 是否从每日竞猜来的
          act:false,
          show_star:false,
          star_info:null
        }
      },
      components: { coupon },
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
          this.product_info[i].preview = 0;
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
            this.product_info[i].prfreight += this.product_info[i].cart[j].product.prfreight;
            if(this.act){
              this.product_info[i].total = this.product_info[i].total + Number(this.product_info[i].cart[j].sku.tlsprice || this.product_info[i].cart[j].sku.skuprice) * this.product_info[i].cart[j].canums;
            }else{
              this.product_info[i].total = this.product_info[i].total + Number(this.product_info[i].cart[j].sku.skuprice) * this.product_info[i].cart[j].canums;
            }
          }
          if(this.product_info[i].prfreight) {
            this.total_money = this.total_money + this.product_info[i].total + this.product_info[i].prfreight
          }else {
            this.total_money = this.total_money + this.product_info[i].total
          }
          sessionStorage.setItem('total_money', this.total_money);
        }
        // 判断是否是从商家大礼包来结算的
        if(this.$route.query.gift) {
          this.fromGift = true;
        }

        this.from = this.$route.query.from;
        this.uaid = localStorage.getItem("uaid");
        this.getPreview();
        if(this.from != 'new' && this.from != 'try') {
          this.getCoupon();                 // 获取提交订单时候可以使用的优惠券
        }
        this.getOneAddress();
        if(this.$route.query.from == 'guess') {
          this.getDiscount();         // 订单页获取减免金额
          this.isGuess = true;
          console.log(this.product_info)
        }
        if(!this.$route.query.gift) {
          this.getStar();
        }

      },
      methods: {
        // 付款方式picker的确认按钮
        payDone() {
          this.payPopup = false;
          this.payType = this.pay;
          if(this.payType.opaytype == 20) {

          }
        },
        // picker选择的付款方式
        payChange(picker, values) {
          this.pay = values[0];
        },
        // 跳转其他页面的方法
        changeRoute(v, where) {
          if(where) {
            sessionStorage.setItem('choose', true);
            this.$router.push({ path: v, query: { from: where }});
          }else {
            this.$router.push(v);
          }
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
        // 获取提交订单时候可以使用的优惠券
        getCoupon() {
          if(this.product_info) {
            for(let i = 0; i < this.product_info.length; i ++) {
              this.product_info[i].params = {
                pbid: this.product_info[i].pb.pbid,
                skus: []
              };
              for(let j = 0; j < this.product_info[i].cart.length; j ++) {
                let sku = {
                  skuid: this.product_info[i].cart[j].sku.skuid,
                  nums: this.product_info[i].cart[j].canums
                };
                this.product_info[i].params.skus.push(sku);
              }
              axios.post(api.order_coupons + '?token=' + localStorage.getItem('token'), this.product_info[i].params).then(res => {
                if(res.data.status == 200) {
                  for(let n = 0; n < res.data.data.length; n ++) {
                    if(res.data.data[n].coupon.title_subtitle.left_text.length > 8) {
                      res.data.data[n].coupon.title_subtitle.left_text = res.data.data[n].coupon.title_subtitle.left_text.substr(0, 8) + "..";
                    }
                    res.data.data[n].coupon.reduce = res.data.data[n].reduce;
                    this.product_info[i].couponList.push(res.data.data[n].coupon);
                    this.product_info = this.product_info.concat();
                  }
                }
              });
            }
          }
        },
        // 订单页获取预计佣金
        getPreview() {
          if(this.product_info && this.from != 'try') {
            for(let i = 0; i < this.product_info.length; i ++) {
              this.product_info[i].params = {
                pbid: this.product_info[i].pb.pbid,
                skus: []
              };
              for(let j = 0; j < this.product_info[i].cart.length; j ++) {
                let sku = {
                  skuid: this.product_info[i].cart[j].sku.skuid,
                  nums: this.product_info[i].cart[j].canums
                };
                this.product_info[i].params.skus.push(sku);
              }
              axios.post(api.get_preview_commision + '?token=' + localStorage.getItem('token'), this.product_info[i].params).then(res => {
                if(res.data.status == 200) {
                  this.product_info[i].preview = res.data.data;
                  this.product_info = this.product_info.concat();
                }
              });
            }
          }
        },
        //获取可用xingb
        getStar(){
          let info = []
          for(let i in this.product_info){
            let skus = [];
            for(let j in this.product_info[i].cart){
              skus.push({skuid:this.product_info[i].cart[j].sku.skuid,nums:this.product_info[i].cart[j].canums,cafrom:10})
              info.push({pbid:this.product_info[i].pb.pbid,skus:skus})
            }
          }
          this.$http.post(this.$api.integral_pay_preview + '?token='+localStorage.getItem('token'),{
            info:info
          }).then(res => {
            if(res.data.status == 200){
              this.star_info = res.data.data;
            }
          })
        },
        //s点击是否使用star
        changeStar(){
          if(this.show_star){
            this.total_money =  this.total_money + this.star_info.reduce_mount
          }else{
            this.total_money =  this.total_money - this.star_info.reduce_mount
          }
          sessionStorage.setItem('total_money', this.total_money);
          this.show_star = !this.show_star
        },
        // 订单页获取减免金额
        getDiscount() {
          axios.get(api.guess_num_get_discount + '?token=' + localStorage.getItem('token') + '&gnaaid=' +
            this.product_info[0].cart[0].product.gnaaid + '&skuid=' +
            this.product_info[0].cart[0].sku.skuid).then(res => {
            if(res.data.status == 200) {
              this.product_info[0].discount = res.data.data.discount;
              if(this.product_info[0].discount) {
                this.total_money = this.total_money - this.product_info[0].discount
              }
              if(this.total_money < 0.01) {
                this.total_money = 0.01
              }
              sessionStorage.setItem('total_money', this.total_money);
            }
          });
        },
        // 选择优惠券
        couponClick(item) {
          this.product_info[this.index].coupon_info = item;
          this.show_coupon = false;
          // this.product_info[this.index].total = this.product_info[this.index].total - item.reduce;
          this.total_money = sessionStorage.getItem('total_money') - item.reduce;
          // 使用无门槛优惠券后付款金额不小于0.01
          if(this.product_info[this.index].total < 0.01) {
            this.product_info[this.index].total = 0.01;
          }
          if(this.total_money < 0.01) {
            this.total_money = 0.01;
          }
        },
        /*改变模态框*/
        changeModel(v, bool, index) {
          this[v] = bool;
          if(index) {
            this.index = index - 1;
            this.couponList = this.product_info[this.index].couponList;
            // 优惠券显示内容精简
            for(let i in this.couponList) {
              if(this.couponList[i].cosubtration.toString().length > 4) {
                this.couponList[i].cosubtration = 999
              }
              this.couponList[i].codiscount = this.couponList[i].codiscount.toString().slice(0, 3)
            }
          }
        },
        // 试用商品 - 新人首单时创建订单并调起支付
        submitOrderActivity() {
          if(!this.uaid) {
            Toast("请先选择收货地址");
            return false;
          }
          if(this.from == 'try') {
            let params = {
              tcid: this.product_info[0].cart[0].sku.tcid,
              pbid: this.product_info[0].pb.pbid,
              skuid: this.product_info[0].cart[0].sku.skuid,
              omclient: 0,
              uaid: this.uaid,
              opaytype: 0,
              ommessage: this.product_info[0].ommessage || ""
            };
            axios.post(api.create_order + "?token=" + localStorage.getItem('token'), params).then(res => {
              if(res.data.status == 200){
                localStorage.setItem('activityOrderNo', 3);
                this.wxPay(res.data.data.args);
              }
            });
          }else if(this.from == 'new') {
            let _usid = '';
            if(localStorage.getItem('secret_usid')){
              _usid =  localStorage.getItem('secret_usid').split('&from')[0];
              if(_usid.endsWith('#/')) {
                _usid = _usid.substr(0, _usid.length - 2);
              }else if(_usid.endsWith('#/selected')){
                _usid = _usid.substr(0, _usid.length - 10);
              }
            }
            let params = {
              skuid: this.product_info[0].cart[0].sku.skuid,
              omclient: 0,
              uaid: this.uaid,
              opaytype: 0,
              ommessage: this.product_info[0].ommessage || "",
              secret_usid:_usid
            };
            axios.post(api.add_order + "?token=" + localStorage.getItem('token'), params).then(res => {
              if(res.data.status == 200){
                localStorage.setItem('activityOrderNo', 0);
                this.wxPay(res.data.data.args);
              }
            });
          }
        },
        // 每日竞猜的提交订单
        submitGuessOrder() {
          console.log(this.product_info)
          if(!this.uaid) {
            Toast("请先选择收货地址");
            return false
          }
          this.submitOrder();
          // let gnid = '';
          // let date = new Date();
          // date.setTime(date.getTime());
          // date = date.getFullYear().toString() + (date.getMonth()+1).toString() + date.getDate().toString();
          // let param = { token: localStorage.getItem('token'), date: date };
          // axios.get(api.get_guess_num, { params: param }).then(res => {
          //   if(res.data.status == 200) {
          //     if(res.data.data.result == 'uncorrect') {
          //       Toast('今日猜错啦');
          //       this.from = 'try';
          //       this.submitOrder();
          //       return false
          //     }else if(res.data.data.result == 'correct') {
          //       Toast('今日猜对啦');
          //       gnid = res.data.data.gnid;
          //     }else if(res.data.data.result == 'not_open') {
          //       Toast('今日未开奖');
          //       this.from = 'try';
          //       this.submitOrder();
          //       return false
          //     }else{
          //       Toast('今日未参与');
          //       this.from = 'try';
          //       this.submitOrder();
          //       return false;
          //     }
          //     let params = {
          //       gnid: gnid,
          //       skuid: this.product_info[0].cart[0].sku.skuid,
          //       omclient: 0,
          //       uaid: this.uaid,
          //       opaytype: 0
          //     };
          //     axios.post(api.recv_award + '?token='+ localStorage.getItem('token'), params).then(res => {
          //       if(res.data.status == 200) {
          //         localStorage.setItem('activityOrderNo', 1);
          //         if(common.isWeixin()) {
          //           this.wxPay(res.data.data.args);
          //         }else {
          //           Toast('请在活动订单页查看详情');
          //         }
          //       }
          //     });
          //   }
          // });
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
          if(this.payType.opaytype) {
            params.opaytype = this.payType.opaytype;
            if(this.payType.opaytype ==20) {
              if(!this.code) {
                Toast('请填写激活码或更换付款方式');
                return false;
              }
              params.activation_code = this.code;
            }
          }else if(this.show_star){
            //组合支付   点击星币抵扣
            params.opaytype = 40;
          }else{
            params.opaytype = 0;
          }
          if(this.$route.query.from === undefined) {
            params.omfrom = 10;
          }else if(this.$route.query.from == 'guess') {
            params.omfrom = 10;
          }else {
            params.omfrom = this.$route.query.from;
          }
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
         if(this.$route.query.from == 'gpid' || this.$route.query.from == 'ggid'){
           let _params = {
             gpid: this.$route.query.gpid,
             pbid: this.product_info[0].pb.pbid,
             gsid: this.product_info[0].cart[0].sku.gsid,
             omclient: 0,
             uaid: this.uaid,
             ommessage: this.product_info[0].ommessage || "",
             nums: 1
           }
           axios.post(api.guessgroup_order + "?token=" + localStorage.getItem('token'), _params).then(res => {
             if(res.data.status == 200) {
               if(this.payType.opaytype ==20) {
                 // Toast(res.data.message);
                 // this.giftPopup = true;

                 // if(this.act){
                 //   this.$router.push("/personal/myWallet");
                 // }else{
                 this.$router.push("/orderList?which=2");
                 // }

                 // 成功调起支付，该页面已使用过，从订单列表页返回时不打开
                 sessionStorage.setItem('use', 'used');
               }else {
                 this.wxPay(res.data.data.args,res.data.data.omid);
                 localStorage.removeItem('product');
               }
             }
           });
         }else  if(this.$route.query.from == 'mbjid'){
           let _params = {
             mbjid: this.$route.query.mbjid,
             omclient: 0,
             uaid: this.uaid,
             ommessage: this.product_info[0].ommessage || "",
           }
           axios.post(api.magicbox_recv_award + "?token=" + localStorage.getItem('token'), _params).then(res => {
             if(res.data.status == 200) {
               if(this.payType.opaytype ==20) {
                 // Toast(res.data.message);
                 // this.giftPopup = true;

                 // if(this.act){
                 //   this.$router.push("/personal/myWallet");
                 // }else{
                 this.$router.push("/orderList?which=2");
                 // }

                 // 成功调起支付，该页面已使用过，从订单列表页返回时不打开
                 sessionStorage.setItem('use', 'used');
               }else {
                 this.wxPay(res.data.data.args,res.data.data.omid);
                 localStorage.removeItem('product');
               }
             }
           });
         }
           else{
           axios.post(api.order_create + "?token=" + localStorage.getItem('token'), params).then(res => {
             if(res.data.status == 200) {
               if(this.payType.opaytype ==20) {
                 // Toast(res.data.message);
                 // this.giftPopup = true;

                 // if(this.act){
                 //   this.$router.push("/personal/myWallet");
                 // }else{
                 this.$router.push("/orderList?which=2");
                 // }

                 // 成功调起支付，该页面已使用过，从订单列表页返回时不打开
                 sessionStorage.setItem('use', 'used');
               }else {
                 this.wxPay(res.data.data.args);
                 localStorage.removeItem('product');
               }
             }
           });
         }
        },
        // 调起微信支付
        wxPay(data,omid) {
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
                  }else if(that.from == 'gpid') {
                    // that.$router.push('/personal/myWallet');
                    let id = '';
                    for(let j = 0; j < that.product_info[0].cart.length; j ++) {
                      if(that.product_info[0].cart[j].contentid && that.product_info[0].cart[j].contentid != ''){
                        id = that.product_info[0].cart[j].contentid;
                      }
                    }
                    that.$router.push({path:'/groupProductDetail',query:{gpid:id,omid:omid}});
                  }else if(that.from == 'ggid') {
                    // that.$router.push('/personal/myWallet');
                    let id = '';
                    for(let j = 0; j < that.product_info[0].cart.length; j ++) {
                      if(that.product_info[0].cart[j].contentid && that.product_info[0].cart[j].contentid != ''){
                        id = that.product_info[0].cart[j].contentid;
                      }
                    }
                    that.$router.push({path:'/groupProductDetail',query:{ggid:id,omid:omid}});
                  }else if(that.from == 'mbjid') {
                    // that.$router.push('/personal/myWallet');
                    that.$router.push({path:'/magicList',query:{}});
                  }else {     // 去待发货页
                    that.$router.push("/orderList?which=2");
                  }
                }else if(that.from == 'new' || that.from == 'try' || that.isGuess || that.act) {
                    // that.$router.push('/personal/myWallet');
                    that.$router.push("/orderList?which=2");
                  }else if(res.err_msg == "get_brand_wcpay_request:cancel" ){   // 支付过程中用户取消
                  Toast('支付已取消');
                  if(that.from == 'new' || that.from == 'try' || that.isGuess ||that.act) {
                    // that.$router.push('/personal/myWallet');
                    that.$router.push("/orderList?which=1");
                  }else if(that.from == 'mbjid') {
                    // that.$router.push('/personal/myWallet');
                    that.$router.push({path:'/magicList',query:{}});
                  }else {     // 去待付款页
                    that.$router.push("/orderList?which=1");
                  }
                }else if(res.err_msg == "get_brand_wcpay_request:fail" ){     // 支付失败
                  Toast('支付失败');
                  if(that.from == 'new' || that.from == 'try' || that.isGuess || that.act) {
                    // that.$router.push('/personal/myWallet');
                    that.$router.push("/orderList?which=1");
                  }else if(that.from == 'mbjid') {
                    // that.$router.push('/personal/myWallet');
                    that.$router.push({path:'/magicList',query:{}});
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
  background-color: #fff;
  /*padding: 17px 25px 100px 25px;*/
  color: #000;
  .m-icon-more{
    display: inline-block;
    width: 22px;
    height: 22px;
    background: url("/static/images/icon-more.png") no-repeat;
    background-size: 100% 100%;
    vertical-align: middle;
  }
  .m-price{
    color: @mainColor;
  }
  .m-one-part {
    width: 100%;
    box-sizing: border-box;
    padding: 16px 0 22px;
    background-color: #fff;
    /*box-shadow:0 5px 6px rgba(0,0,0,0.16);*/
    /*border-radius: 10px;*/
    /*margin-bottom: 20px;*/
    border-bottom: 10px solid #f4f4f4;
    text-align: left;
    &.m-pl-s{
      width: 100%;
      box-sizing: border-box;
      padding: 16px 14px 22px 26px;
      &.m-pr-s{
        width: 100%;
        box-sizing: border-box;
        padding: 16px 14px 22px 26px;
      }
    }
    &.m-pr-s{
      /*width: 642px;*/
      width: 100%;
      box-sizing: border-box;
      padding: 16px 14px 22px 44px;
    }
    &.m-address-part{
      display: flex;
      flex-flow: row;
      align-items: center;
      justify-content: space-between;
      .m-left{
        width: 630px;
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
      margin-top: 20px;
      padding: 0 40px;
      .m-title-box{
        display: flex;
        flex-flow: row;
        align-items: flex-start;
        justify-content: space-between;
        width: 530px;
        p{
          text-align: right;
        }
        .m-num-product{
          color: #C1C1C1;
        }
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
      .m-price-num{
        margin: 0;
        display: flex;
        flex-flow: row;
        justify-content: space-between;
        width: 560px;
      }
    }
    .m-order-ul{
      li{
        border-bottom: 1px solid #ccc;
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
        .m-coupon-label{
          display: inline-block;
          background: url("/static/images/product/icon-coupon-bg.png") no-repeat;
          background-size: 100% 100%;
          margin-right: 10px;
          height: 36px;
          line-height: 36px;
          font-size: 20px;
          color: #EA3F29;
          padding: 0 16px 0 26px;
        }
        .m-radio{
          display: inline-block;
          width:30px;
          height: 30px;
          vertical-align: text-top;
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
  .m-gift-popup {
    width: 700px;
    height: 600px;
    margin: -300px 0 0 25px;
    border-radius: 30px;
    .m-gift-popup-img {
      width: 85px;
      height: 85px;
      margin: 100px 0 36px 0;
    }
    .m-gift-popup-text {
      margin: 45px 0 120px 0;
    }
    .m-gift-popup-btn {
      width: 120px;
      color: #ffffff;
      background-color: @mainColor;
      padding: 15px 70px;
      margin-left: 220px;
      border-radius: 10px;
      box-shadow: 2px 8px 8px rgba(0,0,0,0.16);
    }
  }
  .m-order-btn{
    padding: 0;
    width: 750px;
    margin-top: 100px;
    span{
      color: #ffffff;
      display: inline-block;
      width: 750px;
      height:106px;
      line-height: 106px;
      background: @mainColor;
      /*box-shadow: 0 5px 6px rgba(0,0,0,0.16);*/
      /*border-radius: 10px;*/
      font-weight: bold;
      font-size: 38px;
    }
  }
  .m-coupon-modal{
    display: flex;
    flex-flow: column;
    /*justify-content: center;*/
    align-items: center;
    height: 660px;
    overflow-y: auto;
    padding-bottom: 40px;
    .m-coupon-head{
      .flex-row(space-between);
      width: 100%;
      padding: 15px 25px;
      font-size: 28px;
      box-sizing: border-box;
      color: @mainColor;
      img{
        display: block;
        width: 27px;
        height: 27px;
      }
    }
    .m-star-ul{
      width: 100%;
      margin-top: 40px;
      .m-item{
        width: 100%;
        box-sizing: border-box;
        padding: 37px 40px;
        border-bottom: 1px solid #f4f4f4;
      }
    }
    .m-coupon-modal-content{
      width: 750px;
      padding: 40px 0;
    }
  }
}
</style>
