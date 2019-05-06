<template>
  <div class="m-personal " >
    <!-- <div class="m-personal-bg">
      <span class="m-icon-bg"></span>
    </div> -->
    <div class="m-personal-content m-serviceCenter ">
      <div class="m-personal-body">
        <div class="m-one-part">

          <div class="m-serviceCenter-ul">
            <div v-for="(item, index) in qa_list">
              <div class="m-serviceCenter-li" @click="openQuestion(index)">
                <div>
                  <!-- <img class="m-question-img" :src="item.qoicon" alt=""> -->
                  <span>{{item.qoname}}</span>
                </div>
                <span class="m-icon-more" :class="item.questions ? 'm-icon-unfold' : ''"></span>
              </div>
              <div class="m-serviceCenter-li-ul" v-if="item.questions">
                <p v-for="items in item.question" class="m-ft-24" @click="changeRoute(items)">{{items.ququest}}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="m-serviceCenter-foot">
          <div class="m-serviceCenter-btn">
            <!-- <span class="m-icon-tell"></span> -->
            <div>
              <p>客服QQ</p>
              <p>3441362480</p>
            </div>
          </div>
          <div class="m-serviceCenter-btn">
            <!-- <span class="m-icon-service"></span> -->
            <div>
              <p>客服邮箱</p>
              <p>kuahu123@163.com</p>
            </div>
           <!-- <div>
             <p>客服邮箱</p>
             <p>kuahu123@163.com</p>
           </div> -->
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
        qa_list: [{ question: [] }]
      }
    },
    components: {},
    methods: {
      // 跳转页面
      changeRoute(items) {
        this.$router.push({ path: '/personal/serviceCenterDetail', query: { quid: items.quid }});
      },
      // 获取所有的问题
      getQuestion() {
        axios.get(api.get_all_quest).then(res => {
          if(res.data.status == 200) {
            this.qa_list = res.data.data;
            for(let i = 0; i < this.qa_list.length; i ++) {
              this.qa_list[i].questions = false;
            }
          }
        })
      },
      // 展开问题
      openQuestion(index) {
        this.qa_list[index].questions = !this.qa_list[index].questions;
        this.qa_list = this.qa_list.concat();
      }
    },
    mounted() {
      common.changeTitle('客服中心');
      this.getQuestion();       // 获取所有的问题
    }
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>
  @import "../../../common/css/personal";
  .m-serviceCenter{
    // margin-top: 30px;
    .m-one-part{
      min-height: 1000px;
      .m-icon-more{
        &.m-icon-unfold{
          background: url("/static/images/storekeeper/store-icon-more.png");
          transform: rotate(90deg);
          background-size: 100% 100%;
        }
      }
    }
    .m-serviceCenter-ul{
      // padding: 0 22px 0 40px;
      .m-serviceCenter-li{
        padding: 30px;
        border-bottom: 1px solid #F2F2F2;
        .flex-row(space-between);
        font-size: 30px;
        .m-question-img {
          width: 46px;
          height: 43px;
          margin: 0 20px -8px 0;
        }
      }
      .m-serviceCenter-li-ul{
        p{
          margin-left: 70px;
          margin-right: 50px;
          padding-top: 25px;
        }

      }
    }
    .m-serviceCenter-foot{
      height: 98px;
      width: 749px;
      // position: fixed;
      // bottom: 70px;
      // padding: 10px 0;
      // border-radius: 10px;
      // box-shadow:0 5px 6px rgba(0,0,0,0.16);
      margin-top: 200px;
      border: 1px solid @mainColor;
      .flex-row(space-around);
      // background-color: @mainC;
      .m-serviceCenter-btn{
        width: 50%;
        height: 98px;
        text-align: center;
        .flex-row(center);
        // line-height: 36px;
        color: @mainColor;
        &:first-child{
          border-right: 1px solid @mainColor;
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
