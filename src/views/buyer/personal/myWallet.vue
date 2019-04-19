<template>
  <div class="m-myWallet">
    <div class="m-myWallet-head">
      <p class="m-wallet-name">账户余额</p>
      <div class="m-flex-center">
        ¥<span class="m-star-num">{{user.usbalance | money}}</span>
      </div>
      <div class="m-money-btn">
        <span @click="makeMoney">提现</span>
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
          <div class="m-detail-list-text">
            <p class="m-flex-between">
              <span class="m-detail-list-title">{{item.createtime}}</span>
              <span>¥{{item.cncashnum}}</span>
            </p>
<!--            <p class="m-time">2018-0-20  14:12:31</p>-->
          </div>
        </li>
      </ul>
      <p v-else class="m-no-data">暂无提现记录</p>
      <bottom-line v-if="bottom_show"></bottom-line>
      <mt-popup class="m-gift-popup" v-model="giftPopup" pop-transition="popup-fade">
        <!--            <img class="m-gift-popup-img" src="/static/images/icon-out-know.png" alt="">-->
        <div class=" m-gift-popup-title m-ft-30 m-ft-b">请先进行身份认证</div>
        <div class="m-gift-popup-text m-ft-24">认证成功，提交申请并完成审批即可成为提现。</div>
        <div class="m-gift-popup-btn m-ft-30 m-ft-b" @click="changeRoute('/storekeeper/IDCardApprove')">填写申请</div>
      </mt-popup>
      <!--提现-->
      <div class="m-out-popup-box">
        <mt-popup class="m-out-popup" v-model="outPopup">
          <div class="m-out-box" v-if="!outSubmit">
            <div class="m-popup-close m-ft-28" @click="outPopup = false">X</div>
            <div class="m-out-title m-ft-30">提现金额</div>
            <div class="m-out-num-box">
              <div class="m-out-RMB">￥</div>
              <input class="m-out-num-input" type="text" v-model="moneyNum" @focus="moneyFocus">
              <img class="m-out-num-clean" src="/static/images/icon-close.png" @click="moneyNum = '0'">
            </div>
            <div class="m-out-row">
              <div class="m-row-left">姓名</div>
              <div class="m-row-right">
                <input type="text" v-model="realName" class="m-row-input m-width-180">
              </div>
            </div>
            <div class="m-out-row">
              <div class="m-row-left">银行卡号</div>
              <div class="m-row-right">
                <input type="text" v-model="bankNo" class="m-row-input m-width-300">
              </div>
            </div>
            <div class="m-out-row">
              <div class="m-row-left">银行名称</div>
              <div class="m-row-right" @click="getBankName">{{bank}}</div>
            </div>
            <div class="m-out-row">
              <div class="m-row-left">开户行</div>
              <div class="m-row-right">
                <input type="text" v-model="bankName" class="m-row-input m-width-300">
              </div>
            </div>
            <div class="m-out-btn" @click="outBtn('submit')">提 交</div>
          </div>
          <div class="m-out-box" v-if="outSubmit">
            <img class="m-out-know-img" src="/static/images/icon-out-know.png" alt="">
            <div class="m-out-know-title">提交成功</div>
            <div class="m-out-know-text">已成功提交提现申请，我们将在3个工作日内完成审核，请及时关注您的账户余额。</div>
            <div class="m-out-btn" @click="outBtn('know')">我知道了</div>
          </div>
        </mt-popup>
        <!--银行picker-->
        <mt-popup class="m-bank-popup" v-model="bankPopup" position="bottom">
          <div class="m-popup-btn">
            <div @click="bankPopup = false">取消</div>
            <div @click="bankDone">确认</div>
          </div>
          <div class="m-out-row m-out-bank">
            <div class="m-row-left">银行名称</div>
            <div class="m-row-right">
              <input type="text" v-model="bankResult" class="m-row-input m-width-300">
            </div>
          </div>
          <mt-picker :slots="slot" @change="bankChange"></mt-picker>
        </mt-popup>
        <!--toast-->
        <mt-popup class="m-toast-popup" popup-transition="popup-fade" v-model="toast">
          {{text}}
        </mt-popup>


      </div>
    </div>
  </div>
</template>

<script>
  import navList from '../../../components/common/navlist';
  import bottomLine from '../../../components/common/bottomLine';
  import {Toast} from 'mint-ui';
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
        cntotal:0,
        page_info:{
          page_num: 1,
          page_size: 20
        },
        isScroll: true,
        total_count: 0,
        bottom_show: false,
        outPopup: false,
        outSubmit: false,
        bankPopup: false,
        moneyNum: "0",
        moneyNumTemp: "0",
        slot: [{ values: ['请点击选择银行'] }],
        realName: "",
        bankName: "",
        bankResult: "",
        bank: "",
        bankNo: "",
        store: '成为店主',
        text: '',
        toast: false,
        giftPopup:false,
        usidentification:''
      }
    },
    components:{navList,bottomLine},
    mounted(){
      this.initYear();
      this.getUser();
    },
    methods:{
      // 跳转页面
      changeRoute(v){

          this.$router.push(v);

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
      //活动切换
      navClick(index){
        for(let i in this.nav_list){
          this.nav_list[i].active = false;
        }
        this.nav_list[index].active = true;
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
              this.history_list = null;
              this.page_info.page_num = 1;
              this.total_count = 0;
            }
          }
        })
      },
      //获取活动订单
      getOrder(){

      },
      //滚动加载更多
      touchMove(e){
        let scrollTop = common.getScrollTop();
        let scrollHeight = common.getScrollHeight();
        let ClientHeight = common.getClientHeight();
        if (scrollTop + ClientHeight  >= scrollHeight -10) {
          if(this.isScroll){
            this.isScroll = false;

             if(this.head_name == '活动订单'){
               if(this.order_list.length == this.total_count){
                 this.bottom_show = true;
               }else{
                 for(let i in this.nav_list){
                   if(this.nav_list[i].index){
                     this.getOrder(this.nav_list[i].value);
                   }
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
      },
      // 获取个人信息
      getUser() {
        this.$http.get(this.$api.get_home + "?token=" + localStorage.getItem('token')).then(res => {
          if(res.data.status == 200){
            this.user = res.data.data;
          }
        })
      },
      makeMoney() {
        if (this.user.usidentification == "") {
          this.giftPopup = true;
        } else {
          this.outPopup = true
        }
      },
      getBankName() {
        if(this.bankNo.length < 10) {
          Toast({ message: '请先输入正确的银行卡号', position: 'bottom' });
          return false;
        }
        this.bankPopup = true;
        axios.get(api.get_bankname + "?cncardno=" + this.bankNo).then(res => {
          if(res.data.status == 200) {
            this.slots[0].values = ['可输入银行名称', res.data.data.cnbankname];
            /*if(!res.data.data.validated) {
              Toast('该银行卡已失效');
            }else {
              this.slots[0].values = ['请点击选择银行', res.data.data.cnbankname];
            }*/
            this.validated = res.data.data.validated;
          }else {
            this.slots[0].values = ['可输入银行名称'];
          }
        })
      },
      // 提现金额输入框获取焦点
      moneyFocus() {
        if(this.moneyNum == '0') {
          this.moneyNum = '';
        }
      },
      // 提现的提交按钮
      outBtn(where) {
        if(where == "submit") {
          if(this.moneyNum < 0.01) {
            // Toast({ message: '提现金额应大于0', position: 'bottom' });
            this.text = '提现金额应大于0';
            this.toast = true;
            // 倒计时
            const TIME_COUNT = 1;
            let count = TIME_COUNT;
            let time = setInterval(() => {
              if (count > 0 && count <= TIME_COUNT) {
                count --;
              } else {
                this.toast = false;
                clearInterval(time);
              }
            }, 1000);
            return false;
          }
          if(this.moneyNum > this.user.usbalance) {
            // Toast({ message: '提现金额应不大于可用余额', position: 'bottom' });
            this.text = '提现金额应不大于可用余额';
            this.toast = true;
            // 倒计时
            const TIME_COUNT = 1;
            let count = TIME_COUNT;
            let time = setInterval(() => {
              if (count > 0 && count <= TIME_COUNT) {
                count --;
              } else {
                this.toast = false;
                clearInterval(time);
              }
            }, 1000);
            return false;
          }
          if(!this.realName) {
            // Toast({ message: '请先输入姓名', position: 'bottom' });
            this.text = '请先输入姓名';
            this.toast = true;
            // 倒计时
            const TIME_COUNT = 1;
            let count = TIME_COUNT;
            let time = setInterval(() => {
              if (count > 0 && count <= TIME_COUNT) {
                count --;
              } else {
                this.toast = false;
                clearInterval(time);
              }
            }, 1000);
            return false;
          }
          if(this.bankNo.length < 10) {
            // Toast({ message: '请先输入正确的银行卡号', position: 'bottom' });
            this.text = '请先输入正确的银行卡号';
            this.toast = true;
            // 倒计时
            const TIME_COUNT = 1;
            let count = TIME_COUNT;
            let time = setInterval(() => {
              if (count > 0 && count <= TIME_COUNT) {
                count --;
              } else {
                this.toast = false;
                clearInterval(time);
              }
            }, 1000);
            return false;
          }
          if((this.bank == '请点击选择银行' || this.bank == '可输入银行名称' || !this.bank) && !this.bankResult) {
            // Toast({ message: '请先选择银行', position: 'bottom' });
            this.text = '请先选择银行';
            this.toast = true;
            // 倒计时
            const TIME_COUNT = 1;
            let count = TIME_COUNT;
            let time = setInterval(() => {
              if (count > 0 && count <= TIME_COUNT) {
                count --;
              } else {
                this.toast = false;
                clearInterval(time);
              }
            }, 1000);
            return false;
          }
          if(!this.bankName) {
            // Toast({ message: '请先输入开户行', position: 'bottom' });
            this.text = '请先输入开户行';
            this.toast = true;
            // 倒计时
            const TIME_COUNT = 1;
            let count = TIME_COUNT;
            let time = setInterval(() => {
              if (count > 0 && count <= TIME_COUNT) {
                count --;
              } else {
                this.toast = false;
                clearInterval(time);
              }
            }, 1000);
            return false;
          }
          /*if(!this.validated) {
            Toast({ message: '该银行卡已失效', position: 'bottom' });
            return false;
          }*/
          let params = {
            cncashnum: this.moneyNum,
            cncardno: this.bankNo,
            cncardname: this.realName,
            cnbankname: this.bank,
            cnbankdetail: this.bankName
          };
          this.$http.post(this.$api.apply_cash + '?token='+ localStorage.getItem('token'), params).then(res => {
            if(res.data.status == 200) {
              this.msg = res.data.message;
              this.outSubmit = true;

              this.realName = '';
              this.bankNo = '';
              this.bank = '';
              this.bankName = '';
              this.slots[0].values = ['请点击选择银行'];
            }else {
              this.text = res.data.message;
              this.toast = true;
              // 倒计时
              const TIME_COUNT = 1;
              let count = TIME_COUNT;
              let time = setInterval(() => {
                if (count > 0 && count <= TIME_COUNT) {
                  count --;
                } else {
                  this.toast = false;
                  clearInterval(time);
                }
              }, 1000);
            }
          });
        }else if(where == "know") {
          this.getUser();           // 获取用户信息
          this.outPopup = false;
          // 倒计时
          const TIME_COUNT = 1;
          let count = TIME_COUNT;
          let time = setInterval(() => {
            if (count > 0 && count <= TIME_COUNT) {
              count --;
            } else {
              this.outSubmit = false;
              clearInterval(time);
            }
          }, 1000);
        }
      },
      // 提现的选择银行确定按钮
      bankDone() {
        if(this.bankResult) {
          this.bank = this.bankResult;
        }
        this.bankPopup = false;
      },
      // picker选择的银行改变
      bankChange(picker, values) {
        this.bank = values[0];
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
      .m-gift-popup-title{
        text-align: center;
        margin: 100px 0 36px 0;
      }
      .m-gift-popup-text {
        margin: 45px 0 120px 0;
        text-align: center;
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
  }

</style>
