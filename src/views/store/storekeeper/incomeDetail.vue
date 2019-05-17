<template>
  <div class="m-income-detail">
    <div class="m-nav">
      <nav-list :navlist="nav_list" @navClick="navClick"></nav-list>
    </div>
    <div class="m-detail-top">
      <!-- 年月选择器 -->
      <div class="m-time-box" @click="openPicker">
        <div class="m-time-text">{{now}}</div>
        <img class="m-time-img" v-if="!popupVisible" src="/static/images/storekeeper/store-icon-open.png" alt="">
        <img class="m-time-img" v-if="popupVisible" src="/static/images/storekeeper/store-icon-close.png" alt="">
      </div>
      <!-- <div class="m-date-popup-box">
        <mt-popup class="m-date-popup" v-model="popupVisible" position="bottom">
          <div class="m-popup-btn">
            <div @click="popupVisible = false">取消</div>
            <div @click="timeDone">确认</div>
          </div>
          <mt-picker :slots="slots" @change="onValuesChange"></mt-picker>
        </mt-popup>
      </div> -->
      <!--本月总计-->
      <div class="m-total-text-box">
        <div class="m-total-text">本月总计</div>
        <div class="m-total-num" v-if="nav_list[0].active">￥{{income.usercommission_mount | money}}</div>
        <div class="m-total-num" v-if="nav_list[1].active">￥{{withdraw.cntotal | money}}</div>
      </div>
      <!--nav滑动选项-->
      <!--<div class="m-nav">
        <navList :navlist="navList" :isScroll="false" @navClick="navClick"></navList>
      </div>-->
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
    <!--收益详情-->
    <div class="m-income-detail-box">
      <div v-if="detailList.length != 0 && nav_list[0].active">
        <div class="m-detail-item" v-for="item in detailList">
          <div class="m-detail-item-left">
            <img class="m-product-img" v-if="item.skupic" :src="item.skupic">
            <img class="m-product-img" v-else src="/static/images/logo.jpg">
          </div>
          <div class="m-detail-item-middle">
            <div class="m-product-name">{{item.prtitle}}</div>
            <!--<div class="m-product-name">{{item.prname}}</div>-->
            <div class="m-product-time">{{item.createtime}}</div>
          </div>
          <div class="m-detail-item-right">
            <!-- 暂未完成收益显示，等后端 -->
            <div class="money-text">￥{{item.uccommission | money}}</div>
            <!-- <div class="money-text" :class="item.ucstatus=='预计到账'?'status':''">+{{item.uccommission | money}}</div>
          <div class="status-text" v-if="item.ucstatus">（{{item.ucstatus}}）</div> -->
          </div>
        </div>
      </div>
      <div v-if="detailList.length != 0 && nav_list[1].active">
        <div class="w-withdrawdetail-item" v-for="item in detailList">
          <div class="m-detail-item-middle">
            <div class="m-product-name" :class="item.cnstatus==1 ? 'agree': (item.cnstatus==0 ? 'submit' : 'refuse')">
              {{item.cnstatus_zh}}
            </div>
            <!--<div class="m-product-name">{{item.prname}}</div>-->
            <div class="m-product-time">{{item.createtime}}</div>
          </div>
          <div class="m-detail-item-right">
            <!-- 暂未完成收益显示，等后端 -->
            <div class="money-text">
              <span class="w-withdraw-again" v-if="item.cnstatus==-1" @click="changeRoute('/storekeeper/withDraw')">再次发起</span>
              <span>￥{{item.cncashnum | money}}</span>
            </div>
            <!-- <div class="money-text" :class="item.ucstatus=='预计到账'?'status':''">+{{item.uccommission | money}}</div>
          <div class="status-text" v-if="item.ucstatus">（{{item.ucstatus}}）</div> -->
          </div>
        </div>
      </div>
      <div v-if="detailList.length == 0">
        <!-- <img class="m-detail-img" src="/static/images/icon-no-income.png" alt=""> -->
        <div class="m-detail-text">暂无记录，请加油哦~</div>
      </div>
    </div>
  </div>
</template>

<script>
  import common from '../../../common/js/common';
  import axios from 'axios';
  import api from '../../../api/api';
  import navList from '../../../components/common/navlist';
  import { Toast } from 'mint-ui';

  export default {
    name: "incomeDetail",
    data() {
      return {
        nav_list: [{
            name: '收益详情',
            value: 'income',
            active: true,
          },
          {
            name: '提现历史',
            value: 'withdraw',
            active: false,
          }
        ],
        now: "", // 当前时间 - 年月
        navList: [{
          name: "普 通",
          active: true
        }, {
          name: "爆 款",
          active: false
        }],
        income: {
          usercommission_mount: ''
        },
        withdraw: {
          cntotal: ''
        },
        detailList: [],
        popupVisible: false,
        slots: [{
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
        }],
        // 和group类似的页面
        timeValue: []
      }
    },
    components: {
      navList
    },
    methods: {
      // 跳转其他页面的方法
      changeRoute(v) {
        this.$router.push(v)
      },
      changeRoute(v,item){
        this.$router.push({path:v,query:{index:item}});
      },
      // 打开 - 关闭时间选择器
      openPicker() {
        if (this.popupVisible) {
          this.popupVisible = false;
        } else {
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
        if(this.nav_list[0].active){
          this.getIncomeList(); // 如果收益详情选项卡激活，变更时间时获取店主收益详情
        }
        if (this.nav_list[1].active) {
          this.getWithdrawHistory(); // 如果提现历史选项卡激活，变更时间时获取店主收益详情
        }
        
        this.popupVisible = false;
      },
      // navList的点击事件
      navClick(index) {
        for (let i in this.nav_list) {
          this.nav_list[i].active = false;
        }
        this.nav_list[index].active = true;
        console.log(index);
        console.log(this.nav_list);
        switch (index) {
          case 0:{this.getIncomeList(); break;}
          case 1:{this.getWithdrawHistory(); break;} 
        }
      },
      // 获取店主收益详情
      getIncomeList() {
        let params = {
          token: localStorage.getItem('token'),
          date: this.now
        };
        axios.get(api.get_agent_commission, {
          params: params
        }).then(res => {
          if (res.data.status == 200) {
            this.income = res.data.data;
            this.detailList = this.income.usercommission_common_list;
            console.log(this.detailList);
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
      },
      getWithdrawHistory() {
        let params = {
          token: localStorage.getItem('token'),
          page_size: '10',
          page_num: '1',
          month: this.now.split('-')[1],
          year: this.now.split('-')[0]
        };
        axios.get(api.get_cash_notes, {
          params: params
        }).then(res => {
          if (res.data.status == 200) {
            this.withdraw = res.data.data;
            this.detailList = this.withdraw.cash_notes;
            console.log(this.withdraw);
            console.log(this.detailList);
          }
        });
      },
      withdrawAgain(item){
        let params = {
          cncashnum: item.cncashnum,
          cncardno: item.cncardno,
          cncardname: item.cncardname,
          cnbankname: item.cnbankname,
          cnbankdetail: item.cnbankdetail
        };
        axios.post(api.apply_cash,{
          params:params
        }).then(res => {
          if(res.data.status == 200){
            Toast({ message: '提交成功', position: 'bottom' });
          }
        }).catch(err => {
          Toast({ message: '提交失败，请重新提交', position: 'bottom' });
        })
      }
    },
    mounted() {
      common.changeTitle('收益详情');
      this.navClick(this.$route.query.index)
      switch(this.$route.query.index){
        case 0:{this.getIncomeList(); break;}
        case 1:{this.getWithdrawHistory(); break;}
      }

      // 设置当前时间 - 年月
      let now = new Date();
      if ((now.getMonth() + 1).toString().length == 1) {
        this.now = now.getFullYear() + "-0" + (now.getMonth() + 1);
      } else {
        this.now = now.getFullYear() + "-" + (now.getMonth() + 1);
      }
      this.slots[0].defaultIndex = now.getFullYear() - 2018;
      this.slots[2].defaultIndex = now.getMonth(); // 默认当前月份
      // this.getIncomeList(); // 获取店主收益详情
      // this.getWithdrawHistory();
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

    .m-nav {
      background-color: #fff;
      box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
      margin-bottom: 3px;
    }

    .m-nav-list {
      padding: 0 26px;
    }

    .m-detail-top {
      width: 100%;
      // position: fixed;
      // top: 0;
      background-color: #ffffff;
      border-bottom: 10px solid #F4F4F4;
      .flex-row(space-between);

      .m-time-box {
        display: flex;
        justify-content: center;
        align-items: center;
        // text-align: center;
        margin: 20px 0 20px 40px;
        width: 165px;
        height: 40px;
        background: rgba(235, 235, 235, 1);
        border-radius: 50px;

        .m-time-text {
          font-size: 28px;
          margin-right: 15px;
        }

        .m-time-img {
          width: 19px;
          height: 19px;
        }
      }

      .m-total-text-box {
        display: flex;
        justify-content: space-between;
        margin-right: 40px;

        // padding: 0 160px;
        .m-total-text {}

        .m-total-num {
          color: #000000;
          // font-weight: bold;
        }
      }

      .m-nav {
        width: 450px;
        margin: 0 0 40px 150px;
      }
    }

    // .m-date-popup-box {
    //     .m-date-popup {
    //       width: 750px;
    //       .m-popup-btn {
    //         display: flex;
    //         justify-content: space-between;
    //         font-size: 28px;
    //         padding: 20px 40px 0 40px;
    //       }
    //     }
    //   }
    .m-income-detail-box {

      // margin: 260px 50px 0 70px;
      // padding: 30px 0;
      .m-detail-item {
        display: flex;
        align-items: center;
        padding: 30px 43px;
        border-bottom: 1px solid #F2F2F2;

        .m-detail-item-left {
          .m-product-img {
            width: 97px;
            height: 97px;
            // border-radius: 10px;
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
            height: 40px;
            font-size: 28px;
            line-height: 40px;
            font-weight: 350;
            color: #000000;
            white-space: normal;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
            // overflow: hidden; // 超出的文本隐藏
            // word-break: break-word;  // 英文换行
            // text-overflow: ellipsis;    // 溢出用省略号显示
            // display: -webkit-box; // 将对象作为弹性伸缩盒子模型显示。
            // -webkit-box-orient: vertical; // 从上到下垂直排列子元素（设置伸缩盒子的子元素排列方式）
            // -webkit-line-clamp: 1; // 这个属性不是css的规范属性，需要组合上面两个属性，表示显示的行数。
          }

          .m-product-time {
            color: #999999;
            font-size: 24px;
            line-height: 35px;
          }
        }

        .m-detail-item-right {
          font-size: 26px;
          color: #000000;

          .money-text {
            font-weight: 500;
            font-size: 28px;

            &.status {
              color: #000000;
            }
          }

          .status-text {
            color: #000000;
            font-size: 18px;
            margin-top: -5px;
          }
        }
      }

      .w-withdrawdetail-item {
        display: flex;
        align-items: center;
        padding: 30px 40px;
        border-bottom: 1px solid #F2F2F2;

        .m-detail-item-left {
          .m-product-img {
            width: 97px;
            height: 97px;
            // border-radius: 10px;
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
            height: 40px;
            font-size: 28px;
            line-height: 40px;
            font-weight: 350;
            color: #000000;
            white-space: normal;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
            .flex-row(space-between);
            &.agree{
              color: #C1C1C1;
            }
            &.submit{
              color:@mainColor;
            }
            &.refuse{
              color:#B70000;
            }
            
            // overflow: hidden; // 超出的文本隐藏
            // word-break: break-word;  // 英文换行
            // text-overflow: ellipsis;    // 溢出用省略号显示
            // display: -webkit-box; // 将对象作为弹性伸缩盒子模型显示。
            // -webkit-box-orient: vertical; // 从上到下垂直排列子元素（设置伸缩盒子的子元素排列方式）
            // -webkit-line-clamp: 1; // 这个属性不是css的规范属性，需要组合上面两个属性，表示显示的行数。
          }

          .m-product-time {
            color: #000000;
            font-size: 24px;
            line-height: 35px;
          }
        }

        .m-detail-item-right {
          font-size: 26px;
          color: #000000;

          .money-text {
            font-weight: 500;
            font-size: 28px;
            .flex-col(flex-start);
            span{
              display: inline-block;
            }
            .w-withdraw-again{
              width: 150px;
              height: 40px;
              background-color: @mainColor;
              line-height: 40px;
              font-size: 24px;
              font-weight: 400;
              color: #fff;
              margin-bottom: 20px;
            }
          }

          .status-text {
            color: #000000;
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
        color: #000000;
        font-size: 28px;
        margin-top: 20px;
      }
    }
  }

</style>
