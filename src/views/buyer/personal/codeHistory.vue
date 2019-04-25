<template>
  <div class="m-history">
    <div class="m-history-box">
      <div class="w-month">
          <div class="w-month-last" @click="lastMonth"></div>
          <div class="w-month-now">{{year}}年{{month}}月</div>
          <div class="w-month-next" :class="this.month<this.now.getMonth()+1 ? 'active' : (this.year<this.now.getFullYear() ? 'active' : '')" @click="nextMonth"></div>
      </div>
      <div class="m-history-item" v-for="item in history">
        
        <div class="m-text-content">
          <div class="m-item" @click="changeRoute('/personal/codeHistory/codeDetail',item.acaid)">
              <div class="w-item-time">{{item.createtime}}</div>
              <div class="w-item-code">{{item.uaccode}}</div>       
            <!-- <p v-if="item.acareason">
              <span>审核回复：</span>
              <span>{{item.uaccode}}</span>
            </p> -->
          </div>
        </div>
        <!-- <img class="m-image-content" v-for="(img, index) in item.acavouchers"
             @click="previewImage(index, item.acavouchers)" v-lazy="img" :key="img"> -->
      </div>
    </div>
    <div class="m-no-history" v-if="history.length == 0">
      <!-- <span class="m-no-img"></span> -->
      <div class="m-no-text m-ft-26 m-ft-b">暂无申请历史</div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import common from '../../../common/js/common';
  import axios from 'axios';
  import api from '../../../api/api';
  import wxapi from '../../../common/js/mixins';
  import { Toast } from 'mint-ui';

  export default {
    data() {
      return {
        history: [],
        year: '',
        month: '',
        now: new Date()
      }
    },
    mixins: [wxapi],
    components: {},
    methods: {
      changeRoute(v,value){
        this.$router.push({path:v,query:{index:value}});
      },
      // 预览图片
      previewImage(index, image) {
        let images = [];
        for(let i = 0; i < image.length; i ++) {
          images.push(image[i]);
        }
        let options = {
          current: image[index], // 当前显示图片的http链接
          urls: images,                  // 当前预览图片的list
        };
        wxapi.previewImage(options);
      },
      // 获取申请列表
      getHistory() {
        let params = { 
          token: localStorage.getItem('token'),
          year: this.year,
          month: this.month,
          page_size: '10',
          page_num: '1'
          };
        axios.get(api.act_code_get_list, { params: params }).then(res => {
          if(res.data.status == 200) {
            this.history = res.data.data;
          }
        });
      },
      getDate(){
        let now = new Date();
        this.year=now.getFullYear();
        this.month=now.getMonth() + 1;
      },
      lastMonth(){
        if(this.month==1){
          this.year--;
          this.month=12;
        }else{
          this.month--;
        }
        this.getHistory();
      },
      nextMonth(){
        if(this.month==this.now.getMonth()+1 && this.year==this.now.getFullYear()){
          Toast({ message: '不能再往下翻啦！', position: 'bottom' });
          return;
        }
        if(this.month==12){
          this.year++;
          this.month=1;
        }else{
          this.month++;
        }
        this.getHistory();
      }
    },
    filters:{

    },
    mounted() {
      common.changeTitle('购买记录');
      this.getDate();
      this.getHistory();               // 获取申请列表
    }
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>
  @import "../../../common/css/index";

  .m-history {
    min-height: 100vh;
    background-color: #fff;
    .m-history-box {
      width: 750px;
      // margin: 50px 30px;
      text-align: left;
      .w-month{
        padding: 30px 0;
        .flex-row(center);
        .w-month-last{
          border-width: 15px;
          border-style: solid;
          border-color: transparent @mainColor transparent transparent;
          margin-right: 10px;
          // &.active{
          //   border-color: transparent @mainColor transparent transparent;
          // }
        }
        .w-month-now{
          font-size:28px;
          font-weight:300;
          line-height:40px;
          color:#666666;
        }
        .w-month-next{
          border-width: 15px;
          border-style: solid;
          border-color: transparent transparent transparent #C1C1C1;
          margin-left: 10px;
          &.active{
            border-color: transparent transparent transparent @mainColor;
          }
        }
      }
      .m-history-item {
        background-color: #ffffff;
        // border-radius: 10px;
        // box-shadow: 0 5px 6px rgba(0,0,0,0.16);
        // margin-bottom: 20px;
        .m-text-content {
          // display: flex;
          .m-item {
            padding: 38px 40px;
            border-bottom: 1px solid #F2F2F2;
            .flex-row(space-between);
            .w-item-time{
              height: 40px;
              font-size:28px;
              font-weight:300;
              line-height:40px;
              color: #000000;
            }
            .w-item-code{
              height: 40px;
              font-size:28px;
              font-weight:500;
              line-height:40px;
              color: #000000;
            }
            span {
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
        .m-image-content {
          width: 200px;
          height: 200px;
          background-color: #EEEEEE;
          margin: 0 0 20px 20px;
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
        color: #C1C1C1;
        font-size:24px;
        font-weight:400;
      }
    }
  }
</style>
