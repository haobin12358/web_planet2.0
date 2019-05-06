<template>
  <div class="m-myWallet">
    <div class="m-myWallet-head">
      <p class="m-wallet-name">账户余额</p>
      <div class="m-flex-center">
        ¥<span class="m-star-num">{{user.usbalance | money}}</span>
      </div>
      <div class="m-money-btn">
        <span @click.stop="changeRoute('/storekeeper/withDraw')">提现</span>
      </div>
      <div class="m-head-part">
        <span :class="item.name == head_name ?'active':''" v-for="(item,index) in head_list" @click="changeContent(item.name)">{{item.name}}</span>
      </div>
    </div>
    <div class="m-myWallet-activity" v-if="head_name == '活动订单'">
      <nav-list :navlist="nav_list" @navClick="navClick"></nav-list>
      <mt-loadmore :top-method="loadTop" ref="loadmore">

        <p v-if="order_list.length == 0" class="m-no-data">暂无订单哦,<span class="m-red">去下单</span>吧~</p>
        <div class="m-orderList-content" v-else>
          <template v-for="(items,index) in order_list">
            <div class="m-one-part"  @click.stop="changeRoute('/orderDetail',items)">
              <div class="m-order-store-tile" >
<!--                @click.stop="changeRoute('/brandDetail',items)"-->
                <div >
<!--                  <span class="m-icon-store"></span>-->
                  <span class="m-store-name">{{items.pbname}}</span>
<!--                  <span class="m-icon-more"></span>-->
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
                        <span class="m-price" v-if="item.tlsprice && items.omfrom != 80">￥{{item.tlsprice | money}}</span>
                        <span class="m-price" v-else-if="items.omfrom == 80">{{item.skuprice}}币</span>
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
                    <li v-if="(items.omstatus==10 || items.omstatus==25 || items.omstatus==26) && !items.part_refund && items.omfrom !=80" @click.stop="changeRoute('/selectBack',items)">退款</li>
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
      </mt-loadmore>
<!--      <div class="m-activity-order-list">-->
<!--        <div class="m-one-order">-->
<!--          <img src="" class="m-img" alt="">-->
<!--          <div class="m-one-order-text">-->
<!--            <div class="m-one-order-title">-->
<!--              <h3 class="m-product-name">TAWA防水帐篷户外野营必备防水帐篷帐户外野营必备TAWA防水…</h3>-->
<!--              <span class="m-price">¥160.00</span>-->
<!--            </div>-->
<!--            <p class="m-product-sku">绿色；单人款</p>-->
<!--            <div class="m-order-num">-->
<!--              <span class="m-text">返现¥</span>-->
<!--              <span>160.00</span>-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->
    </div>
    <div class="m-myWallet-history" v-else>
      <div class="m-date-select">
        <div class="m-date-time" @click="openPicker">
          <span>{{now}}</span>
          <img src="/static/images/newpersonal/icon-date-more.png" class="m-date-more" alt="">
        </div>
        <span>总计{{cntotal}}</span>
      </div>
      <div class="m-date-popup-box">
        <mt-popup class="m-date-popup" v-model="popupVisible" position="bottom">
          <div class="m-popup-btn">
            <div @click="popupVisible = false">取消</div>
            <div @click="timeDone">确认</div>
          </div>
          <mt-picker :slots="slots" @change="onValuesChange"></mt-picker>
        </mt-popup>
      </div>
      <!--        获取记录-->
      <ul class="m-detail-list" v-if="history_list.length >0 ">
        <li class="m-flex-start" v-for="(item,index) in history_list">
          <div class="m-detail-list-text" @click="changeRouteHis('/personal/history',item)">
            <p class="m-flex-between">
              <span class="m-status" :class="item.cnstatus_en == 'agree'? 'm-had':(item.cnstatus_en == 'refuse'? 'm-refuse':'')">{{item.cnstatus_zh}}</span>
              <span class="m-btn" v-if="item.cnstatus_en == 'refuse'" @click.stop="changeRoute('/storekeeper/withDraw')">再次发起审批</span>
            </p>
            <p class="m-flex-between">
              <span class="m-detail-list-title">{{item.createtime}}</span>
              <span class="m-num">¥{{item.cncashnum}}</span>
            </p>
<!--            <p class="m-time">2018-0-20  14:12:31</p>-->
          </div>
        </li>
      </ul>
      <p v-else class="m-no-data">暂无提现记录</p>
      <bottom-line v-if="bottom_show"></bottom-line>

    </div>
  </div>
</template>

<script>
  import navList from '../../../components/common/navlist';
  import bottomLine from '../../../components/common/bottomLine';
  import {Toast,MessageBox} from 'mint-ui';
  export default {
    name: "starProduct",
    data(){
      return{
        user:null,
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
        ],
        popupVisible: false,
        slots: [
          {
            flex: 1,
            defaultIndex: 0,
            values: ['2018', '2019', '2020', '2021', '2022', '2023'],
            className: 'slot1',
            textAlign: 'right'
          }, {
            divider: true,
            content: ' - ',
            className: 'slot2'
          }, {
            flex: 1,
            defaultIndex: 0,
            values: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
            className: 'slot3',
            textAlign: 'left'
          }
        ],
        now:'',
        timeValue:[],
        history_list:[],
        order_list:[],
        cntotal:0,
        page_info:{
          page_num: 1,
          page_size: 20
        },
        isScroll: true,
        total_count: 0,
        bottom_show: false,
        text: '',
        toast: false,
        msg:'',
        show_modal:false
      }
    },
    components:{navList,bottomLine},
    mounted(){
      this.initYear();
      this.getUser();
      this.getOrderNum();             // 获取各状态的订单数量
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
      // 跳转页面
      changeRouteHis(v,item){
          if(item){
            this.$router.push({path:v,query:{item:JSON.stringify(item)}})
          }else{
            this.$router.push(v);
          }
      },
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
        this.$http.get(this.$api.order_list, { params: params }).then(res => {
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
        this.$http.get(this.$api.order_count + "?ordertype=act&token=" + localStorage.getItem('token')).then(res => {
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
              if(this.head_name == '活动订单') {
                for (let i = 0; i < this.order_list.length; i++) {
                  if (this.order_list[i].time_interVal) {
                    clearInterval(this.order_list[i].time_interVal);
                  }

                }
                for (let i = 0; i < this.nav_list.length; i++) {
                  if (this.nav_list[i].active) {
                    this.getOrderList();
                  }
                }
              }else{
                if(this.history_list.length == this.total_count){
                  this.bottom_show = true;
                }else{
                  this.getHistory();
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
          this.$http.post(this.$api.order_confirm + '?token='+ localStorage.getItem('token'), { omid: items.omid }).then(res => {
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
          this.$http.post(this.$api.cancle_order + '?token=' + localStorage.getItem('token'),
            { omid:item.omid }).then(res => {
            if(res.data.status == 200) {
              this.getOrderList();
            }
          })
        }).catch(() => {

        });
      },
      changeContent(v){
        this.head_name = v;
        this.page_info.page_num = 1;
        this.total_count = 0;
        if(v == '活动订单'){
          this.getOrder(this.nav_list[0].value);
        }else{
          this.getHistory();
        }
      },
      //初始化时间
      initYear(){
        let _date = new Date();
        let year = _date.getFullYear();
        let arr =[];
        for(let i=0;i<=(year-2018);i++){
          arr.push(String(Number(2018) + Number(i)))
        }
        this.slots[0].values = arr.concat([]);
        let month = _date.getMonth()+1 >9? _date.getMonth()+1 : '0'+(_date.getMonth()+1);
        for(let i in this.slots[0].values){
          if(this.slots[0].values[i] == year){
            this.slots[0].defaultIndex = Number(i)
          }
        }
        for(let i in this.slots[1].values){
          if(this.slots[1].values[i] == month){
            this.slots[1].defaultIndex = Number(i)
          }
        }
        this.now = `${year}-${month}`;
        this.timeValue[0] = year;
        this.timeValue[1] = month;
      },
      // 打开 - 关闭时间选择器
      openPicker() {
        if(this.popupVisible) {
          this.popupVisible = false;
        }else {
          this.popupVisible = true;
        }
      },
      // 监听时间选择器
      onValuesChange(picker, values) {
        this.timeValue = values;
      },
      // 时间选择器的确认按钮
      timeDone() {
        this.now = this.timeValue[0] + "-" + this.timeValue[1];
        // this.getIncomeList();         // 获取店主收益详情
        this.popupVisible = false;
      },
    //  获取历史记录
      getHistory(){
        this.$http.get(this.$api.get_cash_notes,{
          params:{
            token:localStorage.getItem('token'),
            page_num:this.page_info.page_num,
            page_size: this.page_info.page_size,
            year:this.timeValue[0],
            month:this.timeValue[1]
          }
        }).then(res => {
          if(res.data.status == 200){
            this.isScroll =true;
            this.cntotal = res.data.data.cntotal;
            if(res.data.data.cash_notes.length >0){
              if(this.page_info.page_num >1){
                this.history_list =  this.history_list.concat(res.data.data.cash_notes);
              }else{
                this.history_list = res.data.data.cash_notes;
              }
              this.page_info.page_num = this.page_info.page_num + 1;
              this.total_count = res.data.total_count;
            }else{
              this.history_list = [];
              this.page_info.page_num = 1;
              this.total_count = 0;
            }
          }
        })
      },

      // 获取个人信息
      getUser() {
        this.$http.get(this.$api.get_home + "?token=" + localStorage.getItem('token')).then(res => {
          if(res.data.status == 200){
            this.user = res.data.data;
          }
        })
      },
    }
  }
</script>
<style scoped lang="less">
  @import "../../../common/css/index";
  @import "../../../common/css/personal";
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
    .m-orderList-content{
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
