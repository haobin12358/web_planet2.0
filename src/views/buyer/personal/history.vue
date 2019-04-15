<template>
  <div class="m-history">
    <div class="m-history-box">
      <div class="m-history-item" v-for="item in history">
        <div class="m-item-left">
          <p>
            <span>姓名：</span>
            <span>{{item.cncardname}}</span>
          </p>
          <p>
            <span>银行卡号：</span>
            <span>{{item.cncardno}}</span>
          </p>
          <p>
            <span>银行名称：</span>
            <span>{{item.cnbankname}}</span>
          </p>
          <p>
            <span>开户行：</span>
            <span>{{item.cnbankdetail}}</span>
          </p>
          <p>
            <span>申请时间：</span>
            <span>{{item.createtime}}</span>
          </p>
          <p v-if="item.cnrejectreason">
            <span>审核回复：</span>
            <span>{{item.cnrejectreason}}</span>
          </p>
        </div>
        <div class="m-item-right">
          <p class="m-price">￥{{item.cncashnum | money}}</p>
          <p>{{item.cnstatus}}</p>
        </div>
      </div>
    </div>
    <div class="m-no-history" v-if="history.length == 0">
      <span class="m-no-img"></span>
      <div class="m-no-text m-ft-26 m-ft-b">暂无提现历史</div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import common from '../../../common/js/common';
  import axios from 'axios';
  import api from '../../../api/api';

  export default {
    data() {
      return {
        history: []
      }
    },
    components: {},
    methods: {
      // 获取提现历史记录
      getHistory() {
        let params = {
          token: localStorage.getItem('token'),
          page_size: 200,
          page_num: 1
        };
        axios.get(api.get_cash_notes, { params: params }).then(res => {
          if(res.data.status == 200) {
            this.history = res.data.data;
          }
        });
      }
    },
    mounted() {
      common.changeTitle('提现历史');
      this.getHistory();               // 获取提现历史
    }
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>
  @import "../../../common/css/index";

  .m-history {
    min-height: 100vh;
    background-color: #EEEEEE;
    .m-history-box {
      width: 690px;
      margin: 50px 30px;
      text-align: left;
      .m-history-item {
        background-color: #ffffff;
        border-radius: 10px;
        box-shadow: 0 5px 6px rgba(0,0,0,0.16);
        display: flex;
        margin-bottom: 20px;
        .m-item-left {
          padding: 20px 30px;
          p {
            font-size: 24px;
            line-height: 35px;
          }
        }
        .m-item-right {
          padding: 60px 0 0 40px;
          text-align: center;
          font-size: 30px;
          .m-price {
            color: #FF0000;
          }
        }
      }
    }
    .m-no-history {
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
  }
</style>
