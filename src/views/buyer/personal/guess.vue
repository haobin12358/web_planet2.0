<template>
  <div class="m-guess">
    <div class="m-date-box" @click="datePopup = !datePopup">
      <div class="m-date-text m-ft-30 m-ft-b">{{date}}</div>
      <img class="m-date-img" src="/static/images/icon-down-open.png" v-if="datePopup">
      <img class="m-date-img" src="/static/images/icon-down-close.png" v-if="!datePopup">
    </div>
    <div class="m-guess-row">
      <div class="m-text-left">本月总计</div>
      <div class="m-red">{{recordList.length}}次</div>
    </div>
    <div class="m-guess-row">
      <div class="m-text-left">本月猜对</div>
      <div class="m-red">{{number}}次</div>
    </div>
    <div class="m-no-guess" v-if="recordList.length == 0">
      <span class="m-no-img"></span>
      <div class="m-no-text m-ft-26 m-ft-b">暂无竞猜记录</div>
    </div>
    <!--@click="changeRoute('/activityOrder', item)"-->
    <div class="m-record-box" v-if="recordList.length > 0" v-for="item in recordList"
         :class="item.result == 'correct' ? 'active' : ''" @click="oneClick(item)">
      <div class="m-record-item">
        <img class="m-product-img" :src="item.product.prmainpic" alt="">
        <div class="m-text-box">
          <div class="m-text-row">{{item.product.prtitle}}</div>
          <div class="m-text-row" :class="item.result == 'correct' ? 'm-red' : ''">我的答案：{{item.gnnum}}</div>
          <div class="m-text-row" v-if="item.correct_num" :class="item.result == 'correct' ? 'm-red' : ''">正确答案：{{item.correct_num.cnnum}}</div>
        </div>
        <div class="m-date-text">
          <!--<p v-if="item.result == 'correct'" @click.stop="changeRoute('/dailyGuess')">点击去购买</p>-->
          <p>{{item.gndate}}</p>
        </div>
      </div>
    </div>
    <!--时间选择popup-->
    <mt-popup class="m-date-popup" v-model="datePopup" position="bottom">
      <p class="m-picker-text">
        <span class="cancel" @click="datePopup = false">取消</span>
        <span class="m-picker-btn" @click="dateDone">确定</span>
      </p>
      <mt-picker :slots="slots"  @change="onValuesChange" :visibleItemCount="7"></mt-picker>
    </mt-popup>
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
        datePopup: false,         // 时间选择popup
        slots: [
          {
            flex: 1,
            values: [],
            className: 'slot1',
            textAlign: 'right'
          }, {
            divider: true,
            content: '-',
            className: 'slot2'
          }, {
            flex: 1,
            values: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
            className: 'slot3',
            textAlign: 'left'
          }
        ],
        date: "",                       // 本月
        dateValue: [],                  // 暂存日期
        recordList: [],
        number: "",
        guess:null,
        productImages:[]
      }
    },
    components: {},
    methods: {
      // 跳转其他页面的方法
      changeRoute(v, item) {
        if(!item) {
          localStorage.removeItem('tipDate');
        }
        this.$router.push(v);
      },
      // 用户获取今天猜数字活动所有商品
      getTodayProduct() {
        axios.get(api.today_gnap + '?token='+ localStorage.getItem('token')).then(res => {
          if(res.data.status == 200) {
            this.guess = res.data.data;
            this.productImages = [];
            for(let i in res.data.data.fresh_man) {
              this.productImages.push(res.data.data.fresh_man[i].product)
            }
          }
        });
      },
      //点击竞猜记录
      oneClick(item){
        if(item.historystatus == 0){
          localStorage.setItem('guess',JSON.stringify(this.guess));
          this.$router.push({path:'/guessProduct',query:{which:'guess'}})
        }else{
          Toast({ message: item.historystatus_zh });
        }
      },
      // 时间popup确认按钮
      dateDone() {
        this.datePopup = false;
        this.date = this.dateValue[0] + "-" + this.dateValue[1];
        this.getHistory();               // 获取竞猜记录
      },
      onValuesChange(picker, values) {
        if(values[0]) {
          this.dateValue = values;
        }
      },
      // 获取竞猜记录
      getHistory() {
        let params = {
          token: localStorage.getItem('token'),
          year : this.dateValue[0],
          month : this.dateValue[1]
        };
        axios.get(api.history_join, { params: params }).then(res => {
          if(res.data.status == 200) {
            this.number = res.data.correct_count;
            this.recordList = res.data.data;
            // 商品名称显示优化
            for(let i = 0; i < this.recordList.length; i ++) {
              this.recordList[i].product.prtitle = this.recordList[i].product.prtitle.substring(0, 12) + "..";
            }
          }
        });
      },
      // 设置可选择的年份
      setYear() {
        let now = new Date();
        let year = Number(now.toString().substring(11, 15)) + 1;
        for(let i = 2018; i < year; i ++) {
          this.slots[0].values.push(i);
        }
        this.date = now.toString().substring(11, 15) + "-" + this.slots[2].values[now.getMonth()];
        this.dateValue = [now.toString().substring(11, 15), this.slots[2].values[now.getMonth()]];
      }
    },
    mounted() {
      common.changeTitle('竞猜记录');
      this.setYear();                  // 设置可选择的年份
      this.getHistory();               // 获取竞猜记录
      this.getTodayProduct();
    }
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>
  @import "../../../common/css/index";

  .m-guess{
    min-height: 100%;
    .m-date-box {
      width: 26%;
      margin-left: 37%;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 50px 0 30px 0;
      .m-date-text {

      }
      .m-date-img {
        width: 24px;
        height: 12px;
        margin-left: 10px;
      }
    }
    .m-guess-row {
      display: flex;
      justify-content: space-between;
      font-size: 30px;
      font-weight: bold;
      padding: 0 70px 20px 70px;
    }
    .m-red {
      color: #F53B52;
    }
    .m-no-guess {
      .m-no-img {
        display: inline-block;
        width: 516px;
        height: 516px;
        background: url("/static/images/icon-no-coupon.png") no-repeat;
        background-size: 100% 100%;
      }
      .m-no-text {
        margin-top: -100px;
      }
    }
    .m-record-box {
      padding: 0 70px;
      margin-bottom: 10px;
      &.active {
        background-color: #FCE889;
      }
      .m-record-item {
        display: flex;
        color: #666666;
        font-size: 24px;
        align-items: center;
        padding: 10px 0;
        border-bottom: 1px #E9E9E9 solid;
        .m-product-img {
          width: 119px;
          height: 119px;
        }
        .m-text-box {
          flex: 1;
          margin-left: 40px;
          text-align: left;
          .m-text-row {
            margin: 5px 0;
          }
        }
        .m-date-text {

        }
      }
    }
    .m-date-popup {
      .m-picker-text{
        display: flex;
        flex-flow: row;
        align-items: center;
        justify-content: space-between;
        font-size: 30px;
        padding: 10px 20px;
        span.cancel{
          color: #a4a4a4;
        }

      }
    }
  }
</style>
