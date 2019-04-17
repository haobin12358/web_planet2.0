<template>
  <div class="m-personal  m-service" >
    <div class="m-personal-bg">
      <span class="m-icon-bg"></span>
    </div>
    <div class="m-personal-content m-serviceCenter ">
      <div class="m-personal-body">
        <div class="m-one-part">
          <div>
            <span class="m-icon-text active">问</span>
            <span class="m-ft-26">{{question.ququest}}</span>
          </div>
          <div class="m-serviceCenter-answer">
            <span class="m-icon-text">答</span>
            <p class="m-serviceCenter-answer-content m-ft-24">{{question.qacontent}}</p>
          </div>
        </div>

        <div class="m-serviceCenter-foot">
          <div class="m-serviceCenter-btn">
            <span class="m-icon-tell"></span>
            <div>
              <p>客服电话</p>
              <p>15079564151</p>
            </div>
          </div>
          <div class="m-serviceCenter-btn">
            <span class="m-icon-service"></span>
            <div>
              <p>客服QQ</p>
              <p>3441362480</p>
            </div>
            <!--            <div>-->
            <!--              <p>客服邮箱</p>-->
            <!--              <p>kuahu123@163.com</p>-->
            <!--            </div>-->
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import common from '../../../common/js/common';
  import api from '../../../api/api';
  import axios from 'axios';

  export default {
    data() {
      return {
        question: { ququest: "" }
      }
    },
    components: {},
    methods: {
      // 通过问题id获取答案
      getQuestion() {
        let params = {
          quid: this.$route.query.quid,
          token: localStorage.getItem('token')
        };
        axios.get(api.get_answer, { params: params }).then(res => {
          if(res.data.status == 200) {
            this.question = res.data.data;
          }
        })
      },
    },
    mounted() {
      common.changeTitle('客服中心');
      this.getQuestion();      // 通过问题id获取答案
    }
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>
  @import "../../../common/css/personal";
  .m-service{
    &.m-personal{
      .m-personal-content{
        padding-bottom: 80px;
      }
    }
  }
  .m-serviceCenter{
    margin-top: 30px;
    .m-one-part{
      min-height: 1000px;
      .m-icon-text{
        display: inline-block;
        width: 60px;
        height: 60px;
        font-size: 30px;
        line-height: 60px;
        text-align: center;
        border-radius: 10px;
        background-color: #CCCCCC;
        color: #fff;
        margin-right: 30px;
        &.active{
          background-color: @mainColor;
        }
      }
      .m-serviceCenter-answer{
        display: flex;
        flex-flow: row;
        justify-content: flex-start;
        margin-top: 40px;
        .m-serviceCenter-answer-content{
          width: 507px;
          padding: 14px 4px;
          line-height: 40px;
          text-indent: 2em;
        }
      }
    }
    .m-serviceCenter-foot{
      padding: 10px 0;
      border-radius: 10px;
      box-shadow:0 5px 6px rgba(0,0,0,0.16);
      margin-top: 44px;
      .flex-row(space-around);
      background-color: @mainColor;
      .m-serviceCenter-btn{
        width: 50%;
        text-align: center;
        .flex-row(center);
        line-height: 36px;
        color: #fff;
        &:first-child{
          border-right: 1px solid #fff;
        }
        .m-icon-service{
          display: inline-block;
          width: 59px;
          height: 60px;
          background: url("/static/images/icon-qq.png") no-repeat;
          background-size: 100% 100%;
          margin-right: 20px;
        }
        .m-icon-tell{
          display: inline-block;
          width: 61px;
          height: 60px;
          background: url("/static/images/icon-email.png") no-repeat;
          background-size: 100% 100%;
          margin-right: 20px;
        }
      }
    }
  }
</style>
