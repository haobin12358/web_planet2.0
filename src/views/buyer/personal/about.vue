<template>
  <div class="m-personal">
    <div class="m-personal-about">
      <img src="/static/images/about-us.png" class="m-about-us-img" alt="">
      <div class="m-text">
        <span class="m-ft-28">www.bigxingxing.com</span>
        <img src="/static/images/logo.jpg" class="m-logo" alt="">
      </div>
    </div>
    <div class="m-about-content">
      <h3>大行星</h3>
      <ul>
        <li>
          大行星是一家立足于户外生态圈的垂直社交电商平台。
        </li>
        <li>
          将关注、分享、沟通、讨论、互动等社交化的元素应用于电子商务交易过程，给予用户更好的线上线下购物体验。
        </li>
      </ul>
    </div>
    <!--Copyright-->
    <div class="m-copy-right">
      <img src="/static/images/logo.jpg" class="m-bottom-logo" alt="">
      <p class="m-ft-28">www.bigxingxing.com</p>
      <p class="m-copy-right-text-one">
        <span>Copyright</span>
        <span class="m-icon-copy-right"></span>
        <span>2018-2019</span>
      </p>
      <p class="m-copy-right-text-two">
        杭州跨狐信息技术有限公司 版权所有
      </p>
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

      }
    },
    components: {},
    methods: {

    },
    mounted() {
      common.changeTitle('关于');
    }
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>
  @import "../../../common/css/personal";

  .m-personal {
    min-height: 100vh;
    background-color: #fff;
  }
  .m-personal-about{
    position: relative;
    .m-about-us-img{
      display: block;
      width: 100%;
      height: 460px;
    }
    .m-text{
      position: absolute;
      bottom: 20px;
      right: 20px;
      color: #fff;
      .m-logo{
        display: inline-block;
        width: 50px;
        height: 50px;
      }
    }
  }
  .m-about-content{
    text-align: left;
    padding: 40px;
    h3{
      font-size: 48px;
    }
    ul{
      padding-left: 40px;
      margin-top: 40px;
      li{
        margin-bottom: 20px;
        list-style: disc;
      }
    }
  }
  .m-copy-right {
    /*color: #666666;*/
   margin: 100px 0 0;
    text-align: center;
    width: 750px;
    opacity: 0.6;
    .m-bottom-logo{
      display: inline-block;
      width: 100px;
      height: 100px;
    }
    .m-ft-28{
      color: #333;
      margin-bottom: 40px;
    }
    .m-copy-right-text-one {
      font-size: 20px;
      line-height: 30px;
      .m-icon-copy-right {
        display: inline-block;
        margin-top: -5px;
        width: 25px;
        height: 25px;
        background: url("/static/images/icon-copyright.png") no-repeat;
        background-size: 100% 100%;
        vertical-align: middle;
      }
    }
    .m-copy-right-text-two {
      font-size: 22px;
    }
  }
</style>
