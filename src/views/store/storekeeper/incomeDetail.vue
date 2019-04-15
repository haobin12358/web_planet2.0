
<template>
  <div class="m-income-detail">
    <div class="m-detail-top">
      <!--年月选择器-->
      <div class="m-time-box" @click="openPicker">
        <div class="m-time-text">{{now}}</div>
        <img class="m-time-img" v-if="!popupVisible" src="/static/images/icon-down-close.png" alt="">
        <img class="m-time-img" v-if="popupVisible" src="/static/images/icon-down-open.png" alt="">
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
      <!--本月总计-->
      <div class="m-total-text-box">
        <div class="m-total-text">本月总计</div>
        <div class="m-total-num">￥{{income.usercommission_mount | money}}</div>
      </div>
      <!--nav滑动选项-->
      <!--<div class="m-nav">
        <navList :navlist="navList" :isScroll="false" @navClick="navClick"></navList>
      </div>-->
    </div>
    <!--收益详情-->
    <div class="m-income-detail-box">
      <div class="m-detail-item" v-if="detailList.length != 0" v-for="item in detailList">
        <div class="m-detail-item-left">
          <img class="m-product-img" :src="item.skupic">
        </div>
        <div class="m-detail-item-middle">
          <div class="m-product-name">{{item.prtitle}}</div>
          <!--<div class="m-product-name">{{item.prname}}</div>-->
          <div class="m-product-time">{{item.createtime}}</div>
        </div>
        <div class="m-detail-item-right">
          <div class="money-text" :class="item.ucstatus=='预计到账'?'status':''">+{{item.uccommission | money}}</div>
          <div class="status-text" v-if="item.ucstatus">（{{item.ucstatus}}）</div>
        </div>
      </div>
      <div v-if="detailList.length == 0">
        <img class="m-detail-img" src="/static/images/icon-no-income.png" alt="">
        <div class="m-detail-text">暂无收益，请加油哦~</div>
      </div>
    </div>
  </div>
</template>

<script>
  import common from '../../../common/js/common';
  import axios from 'axios';
  import api from '../../../api/api';
  import navList from '../../../components/common/navlist';

  export default {
    name: "incomeDetail",
    data() {
      return {
        now: "",                  // 当前时间 - 年月
        navList: [
          { name: "普 通", active: true }, { name: "爆 款", active: false }
        ],
        income: { usercommission_mount: '' },
        detailList: [],
        popupVisible: false,
        slots: [
          {
            flex: 1,
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
        // 和group类似的页面
        timeValue: []
      }
    },
    components: { navList },
    methods: {
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
        this.getIncomeList();         // 获取店主收益详情
        this.popupVisible = false;
      },
      // navList的点击事件
      navClick(index) {
        let arr = [].concat(this.navList);
        for(let i = 0; i < arr.length; i ++){
          arr[i].active = false;
        }
        arr[index].active = true;
        this.navList = [].concat(arr);
        if(index === 0) {         // 普通
          this.detailList = this.income.usercommission_common_list;
        }else if(index === 1) {   // 爆款
          this.detailList = this.income.usercommission_popular_list;
        }
      },
      // 获取店主收益详情
      getIncomeList() {
        let params = {
          token: localStorage.getItem('token'),
          date: this.now
        };
        axios.get(api.get_agent_commission, { params: params }).then(res => {
          if(res.data.status == 200){
            this.income = res.data.data;
            this.detailList = this.income.usercommission_common_list;
            /*for(let i = 0; i < this.detailList.length; i ++) {
              if(this.detailList[i].prtitle.length > 31) {
                this.detailList[i].prname = this.detailList[i].prtitle.substr(0, 31);
                this.detailList[i].prname = this.detailList[i].prname + '...';
              }else {
                this.detailList[i].prname = this.detailList[i].prtitle;
              }
            }*/
            // this.navClick(0);
          }
        });
      }
    },
    mounted() {
      common.changeTitle('收益详情');

      // 设置当前时间 - 年月
      let now = new Date();
      if((now.getMonth() + 1).toString().length == 1) {
        this.now = now.getFullYear() + "-0" + (now.getMonth() + 1);
      }else {
        this.now = now.getFullYear() + "-" + (now.getMonth() + 1);
      }
      this.slots[2].defaultIndex = now.getMonth();          // 默认当前月份
      this.getIncomeList();         // 获取店主收益详情
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  @import "../../../common/css/index";

  .m-income-detail {
    min-height: 100vh;
    background-color: #ffffff;
    display: flex;
    flex-direction: column;
    color: #666666;
    font-size: 24px;
    .m-detail-top {
      width: 100%;
      position: fixed;
      top: 0;
      background-color: #ffffff;
      .m-time-box {
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        padding: 50px 0 70px 0;
        .m-time-text {
          font-size: 28px;
          margin-right: 15px;
        }
        .m-time-img {
          width: 30px;
          height: 15px;
        }
      }
      .m-date-popup-box {
        .m-date-popup {
          width: 750px;
          .m-popup-btn {
            display: flex;
            justify-content: space-between;
            font-size: 28px;
            padding: 20px 40px 0 40px;
          }
        }
      }
      .m-total-text-box {
        display: flex;
        justify-content: space-between;
        padding: 0 160px;
        .m-total-text {

        }
        .m-total-num {
          color: #C70000;
          font-weight: bold;
        }
      }
      .m-nav{
        width: 450px;
        margin: 0 0 40px 150px;
      }
    }
    .m-income-detail-box {
      margin: 260px 50px 0 70px;
      .m-detail-item {
        display: flex;
        align-items: center;
        margin-bottom: 50px;
        .m-detail-item-left {
          .m-product-img {
            width: 97px;
            height: 97px;
            border-radius: 10px;
          }
        }
        .m-detail-item-middle {
          flex: 1;
          height: 100px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          text-align: left;
          margin: 0 25px;
          .m-product-name {
            height: 50px;
            font-size: 24px;
            line-height: 28px;
            white-space: normal;
            overflow: hidden; // 超出的文本隐藏
            word-break: break-word;  // 英文换行
            text-overflow: ellipsis;    // 溢出用省略号显示
            display: -webkit-box; // 将对象作为弹性伸缩盒子模型显示。
            -webkit-box-orient: vertical; // 从上到下垂直排列子元素（设置伸缩盒子的子元素排列方式）
            -webkit-line-clamp: 2; // 这个属性不是css的规范属性，需要组合上面两个属性，表示显示的行数。
          }
          .m-product-time {
            color: #999999;
            font-size: 21px;
            line-height: 35px;
          }
        }
        .m-detail-item-right {
          font-size: 26px;
          color: #C70000;
          .money-text {
            font-weight: bold;
            &.status {
              color: @mainColor;
            }
          }
          .status-text {
            color: @mainColor;
            font-size: 18px;
            margin-top: -5px;
          }
        }
      }
      .m-detail-img {
        width: 516px;
        height: 516px;
      }
      .m-detail-text {
        color: #333333;
        font-size: 28px;
        font-weight: bold;
      }
    }
  }
</style>
