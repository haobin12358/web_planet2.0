<template>
  <div class="w-withdraw">
    <div class="w-withdraw-box">
      <div class="w-withdraw-amount">
        <p>提现金额</p>
        <div class="w-withdraw-form">
          <span>￥</span>
          <input type="text" class="w-withdraw-input" v-model="amount" placeholder="请输入金额">
          <span class="w-withdraw-icon-empty" :class="(!amount) ? '' : 'not-empty'" @click="emptyInput"></span>
        </div>
      </div>
      <div class="w-withdraw-attention">
        <p>提示：</p>
        <p>提交申请后，提现金额将在3个工作日内到微信钱包。</p>
      </div>
      <div class="w-foot-btn" @click="submitMoney">
        <span>提交申请</span>
      </div>
      <div class="w-out" v-if="show_modal">
        <div class="m-out-box">
          <img class="m-out-know-img" src="/static/images/storekeeper/store-icon-success.png" alt="">
          <div class="m-out-know-title">提交成功</div>
          <!-- <div class="m-out-know-text">{{msg}}</div> -->
          <div class="w-out-know">
            <p class="m-out-know-text">已成功提交提现申请</p>
            <p class="m-out-know-text">我们将在3个工作日内完成审核</p>
            <p class="m-out-know-text">请及时关注您的账户余额</p>
          </div>
          <div class="m-out-btn" @click="outBtn('know')">我知道了</div>
        </div>
      </div>

    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import common from '../../../common/js/common';
  import { Toast} from 'mint-ui';
  export default {
    data() {
      return {
        amount: null,
        user: {
          uc_count: '',
          mounth_count: '',
          usbalance: ''
        },
        moneyNum: '',
        num_box: null,
        usidentification: '',
        show_modal:false
      }
    },
    methods: {
      emptyInput() {
        this.amount = null;
      },
      getUser() {
        this.$http.get(this.$api.get_agent_center + "?token=" + localStorage.getItem('token')).then(res => {
          if (res.data.status == 200) {
            // this.user = res.data.data;
            this.moneyNum = res.data.usbalance;
          }
        })
        this.$http.get(this.$api.get_home + "?token=" + localStorage.getItem('token')).then(res => {
          if (res.data.status == 200) {
            // this.num_box = res.data.data;
            this.usidentification = res.data.usidentification;
          }
        })
      },
      outBtn(){
        this.$router.go(-1);
      },
      submitMoney(){
        this.$http.post(this.$api.apply_cash + '?token=' +localStorage.getItem('token'),{
          cncashnum:Number(this.amount)
        }).then(res => {
          if(res.data.status == 200){
            this.show_modal = true;
          }else{
            Toast(res.data.message);
          }
        })
      }

    },
    mounted() {
      common.changeTitle('提现');
      this.getUser();
    },
  }

</script>

<style lang="less" scoped>
  @import "../../../common/css/index";

  .w-withdraw {
    background-color: #fff;

    .w-withdraw-box {
      .w-withdraw-amount {
        padding: 30px 60px;
        height: 280px;
        font-size: 28px;
        border-bottom: 10px solid #F4F4F4;
        .flex-col(space-between, flex-start);

        p {
          font-weight: 400;
          line-height: 40px;
          color: #666666;
          text-align: left;
        }

        .w-withdraw-form {
          width: 100%;
          .flex-row(space-between);

          .w-withdraw-input {
            display: inline-block;
            width: 350px;
            height: 70px;
            color: @mainColor;
            font-size: 48px;
            font-weight: 600;
          }

          .w-withdraw-icon-empty {
            width: 30px;
            height: 30px;
            background: none;

            &.not-empty {
              background: url("/static/images/storekeeper/store-icon-empty.png") no-repeat;
              background-size: 100% 100%;
            }
          }
        }
      }

      .w-withdraw-attention {
        padding: 0 60px;
        font-size: 28px;
        color: #666666;

        p {
          text-align: left;
          margin-top: 30px;
        }

      }

      .w-foot-btn {
        position: absolute;
        bottom: 50px;

        // left: 25px;
        span {
          color: #ffffff;
          display: inline-block;
          width: 750px;
          height: 106px;
          line-height: 106px;
          background: linear-gradient(304deg, @mainColor 0%, @subColor 100%);
          font-size: 38px;
          font-weight: bold;
        }
      }

      .w-out {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background-color: rgba(0, 0, 0, 0.16);
        .flex-col(center, center);

        .m-out-box {
          width: 600px;
          height: 800px;
          // margin: 185px 75px 462px;
          background-color: #ffffff;
          .flex-col(space-between, center);

          .m-out-know-img {
            width: 120px;
            height: 120px;
            padding: 186px 0 40px 0;
          }

          .m-out-know-title {
            font-size: 32px;
            font-weight: 600;
            padding: 0 0 35px 0;
            color: @mainColor;
          }

          .w-out-know {
						padding-bottom: 175px;
            .m-out-know-text {
              font-size: 24px;
              text-align: center;
              // padding-bottom: 140px;
            }
          }

          .m-out-btn {
            width: 601px;
            height: 98px;
            white-space: nowrap;
            color: #ffffff;
            background: linear-gradient(313deg, @mainColor 0%, @subColor 100%);
            font-size: 30px;
            font-weight: 500;
            line-height: 98px;
            // padding: 15px 60px;
            // border-radius: 10px;
            // box-shadow: 2px 8px 8px rgba(0, 0, 0, 0.16);
            // margin: 50px 0 0 170px;
          }
        }
      }

    }
  }

</style>
