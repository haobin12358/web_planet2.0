<template>
  <div class="m-history">
    <div class="m-history-box">
      <div class="m-history-item" >
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
          <p>
            <span>申请金额：</span>
            <span>￥{{item.cncashnum | money}}</span>
          </p>
          <p >
            <span>审核状态：</span>
            <span v-if="item.cnstatus_en != 'refuse'" :class="item.cnstatus_en == 'agree'?'m-had':'active'">{{item.cnstatus_zh}}</span>
            <span v-else class="m-refuse">{{item.cnstatus_zh}}:{{item.cnrejectreason}}</span>
          </p>

        </div>
<!--        <div class="m-item-right">-->
<!--          <p class="m-price">￥{{item.cncashnum | money}}</p>-->
<!--          <p>{{item.cnstatus}}</p>-->
<!--        </div>-->
      </div>
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
        item:null
      }
    },
    components: {},
    methods: {
      // // 获取提现历史记录
      // getHistory() {
      //   let params = {
      //     token: localStorage.getItem('token'),
      //     page_size: 200,
      //     page_num: 1
      //   };
      //   axios.get(api.get_cash_notes, { params: params }).then(res => {
      //     if(res.data.status == 200) {
      //       this.history = res.data.data;
      //     }
      //   });
      // }
    },
    mounted() {
      common.changeTitle('提现历史');
      // this.getHistory();               // 获取提现历史
      this.item = JSON.parse(this.$route.query.item)
      console.log(this.item)
    }
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>
  @import "../../../common/css/index";

  .m-history {
    min-height: 100vh;
    background-color: #fff;
    color: #333;
    .m-history-box {
      width: 750px;
      text-align: left;
      .m-history-item {
        background-color: #ffffff;
        display: flex;

        .m-item-left {

          p {
            width: 750px;
            box-sizing: border-box;
            font-size: 24px;
            line-height: 35px;
            padding: 30px 40px;
            border-bottom: 1px solid #f4f4f4;
            .flex-row(space-between);
            span:last-child{
              color: #999;
              &.active{
                color: @mainColor;
              }
              &.m-refuse{
                color: #B70000;
              }
            }
          }
        }
      }
    }

  }

</style>
