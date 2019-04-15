<template>
  <div class="m-activity" ref="activity">
    <!--<div class="m-activity-top-bg"></div>-->

    <div class="m-activity-box">
      <div class="m-activity-item" v-for="item in activityList">
        <img class="m-activity-img" :src="item.acbackground" alt="">
        <div class="m-product-count animated infinite pulse" v-if="item.actype == 2 && item.stock">
          <div v-if="item.stock > 99" class="m-ft-44" style="line-height: 90px">余量充足</div>
          <div v-else>{{item.stock}}</div>
        </div>
        <div class="m-product-count animated infinite pulse" v-if="item.actype == 1 && item.prcount">
          <div v-if="item.prcount > 99" class="m-ft-44" style="line-height: 90px">余量充足</div>
          <div v-else>{{item.prcount}}</div>
        </div>
        <!--<img class="m-activity-img" src="http://img.zcool.cn/community/01e021593541cfa8012193a3a081af.gif" alt="">-->
        <!--用户****中奖了-->
        <!--<div class="m-activity-user-demo" v-if="item.record">{{item.record}}</div>-->
        <div class="m-activity-btn animated infinite pulse" :class="item.acbutton.length > 6 ? 'active' : ''" @click="changeRoute(item.actype)">{{item.acbutton}}</div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import common from '../../../common/js/common';
  import axios from 'axios';
  import api from '../../../api/api';
  import { Toast } from 'mint-ui';

  export default {
    name: 'activityIndex',
    data() {
      return {
        name: '',
        activityList: []
      }
    },
    components: {},
    methods: {
      // 跳转页面
      changeRoute(v) {
        switch(v) {
          case 0:
            this.$router.push({ path: "/activityProduct", query: { which: "new" }});
            break;
          case 1:
            this.$router.push("/dailyGuess");
            break;
          case 2:
            this.$router.push("/pandora");
            break;
          case 3:
            this.$router.push({ path: "/activityProduct", query: { which: "try" }});
            break;
          case 4:
            this.$router.push({ path: "/limitedTime"});   //限时活动
            break;
        }
      },
      // 获取活动list
      getActivit() {
        axios.get(api.activity_list + "?token=" + localStorage.getItem('token')).then(res => {
          if(res.data.status == 200){
            this.activityList = res.data.data;
            // this.$refs.activity.style.height = this.activityList.length * 520 + 'px';
          }
        });
      }
    },
    mounted() {
      common.changeTitle('活动');
      if(this.$route.query.token) {
        localStorage.setItem('token', this.$route.query.token);
      }
      this.getActivit();                // 获取活动list
    }
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>
  @import "../../../common/css/index";

  .m-activity {
    /*height: 100%;*/
    /*overflow-y: hidden;*/
    min-height: 100vh;
    background-color: #ffffff;
    margin-bottom: -100px;
    .m-activity-top-bg {
      width: 750px;
      height: 350px;
      background: linear-gradient(180deg, @mainColor 0%, @subColor 100%);
    }
    .m-activity-box {
      /*position: absolute;*/
      /*top: 20px;*/
      padding-top: 20px;
      .m-activity-item {
        width: 700px;
        height: 500px;
        margin: 0 0 20px 25px;
        box-shadow: 0 5px 6px rgba(0,0,0,0.16);
        border-radius: 20px;
        position: relative;
        text-align: center;
        &:last-child {
          margin-bottom: 130px;
        }
        .m-activity-img {
          width: 700px;
          height: 500px;
          background: #ffffff;
          border-radius: 20px;
        }
        .m-product-count {
          white-space: nowrap;
          width: 180px;
          font-size: 120px;
          padding: 20px 50px;
          margin: 0 auto;
          border-radius: 50px;
          background-color: #ffffff;
          position: absolute;
          top: 120px;
          left: 200px;
          opacity: 0.9;
        }
        .m-activity-user-demo {
          width: 490px;
          padding: 10px 25px;
          opacity: 0.5;
          border-radius: 50px;
          background-color: #EEEEEE;
          position: absolute;
          bottom: 180px;
          left: 80px;
        }
        .m-activity-btn {
          width: 300px;
          color: #ffffff;
          /*color: #AF3300;*/
          font-size: 38px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          padding: 20px 25px;
          background: linear-gradient(180deg, @subColor 0%, @mainColor 100%);
          box-shadow: 0 5px 10px rgba(0,0,0,0.16);
          border-radius: 50px;
          position: absolute;
          bottom: 50px;
          left: 175px;
          &.active {
            font-size: 30px;
          }
        }
      }
    }
  }
</style>
