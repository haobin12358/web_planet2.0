<template>
  <div class="m-history">
    <div class="m-history-box">
      <div class="m-history-item" v-for="item in history">
        <div class="m-text-content">
          <div class="m-item-left">
            <p>
              <span>姓名：</span>
              <span>{{item.acaname}}</span>
            </p>
            <p>
              <span>银行卡号：</span>
              <span>{{item.acabanksn}}</span>
            </p>
            <p>
              <span>银行名称：</span>
              <span>{{item.acabankname}}</span>
            </p>
            <p v-if="item.acareason">
              <span>审核回复：</span>
              <span>{{item.acareason}}</span>
            </p>
          </div>
          <div class="m-item-right">
            <p>{{item.acaapplystatus_zh}}</p>
          </div>
        </div>
        <img class="m-image-content" v-for="(img, index) in item.acavouchers"
             @click="previewImage(index, item.acavouchers)" v-lazy="img" :key="img">
      </div>
    </div>
    <div class="m-no-history" v-if="history.length == 0">
      <span class="m-no-img"></span>
      <div class="m-no-text m-ft-26 m-ft-b">暂无申请历史</div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import common from '../../../common/js/common';
  import axios from 'axios';
  import api from '../../../api/api';
  import wxapi from '../../../common/js/mixins'

  export default {
    data() {
      return {
        history: []
      }
    },
    mixins: [wxapi],
    components: {},
    methods: {
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
        let params = { token: localStorage.getItem('token') };
        axios.get(api.act_code_list, { params: params }).then(res => {
          if(res.data.status == 200) {
            this.history = res.data.data;
          }
        });
      }
    },
    mounted() {
      common.changeTitle('申请列表');
      this.getHistory();               // 获取申请列表
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
        margin-bottom: 20px;
        .m-text-content {
          display: flex;
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
        margin-top: -100px;
      }
    }
  }
</style>
