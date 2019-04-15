<template>
  <div class="m-login">
    <p>注册</p>
    <img src="" class="m-login-logo" alt="">
    <div type="text" class="m-login-input" >
      <input type="text" placeholder="用户名">
    </div>
    <div type="text" class="m-login-input" >
      <input type="text" placeholder="密 码">
    </div>
    <div class="m-login-btn">注  册</div>
    <p class="m-login-p">已有账号？ <span class="m-login-y" @click="toLogin">登录</span></p>
  </div>


</template>

<script type="text/ecmascript-6">
  import axios from 'axios';
  import api from '../../api/api';
  import common from '../../common/js/common';
  import {Toast} from 'mint-ui';
  export default {
    data() {
      return {
        name: '',
        check:true
      }
    },
    components: {},
    methods: {
      toLogin(){
        this.$router.push('/login');
      }
    },
    mounted(){
      common.changeTitle('注册');
    },
    created() {

    }
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>
  @import "../../common/css/index";

  .m-login{
    background-color: #9fd0bf;
    min-height: 100%;
    text-align: center;
    color: #fff;
    display: flex;
    flex-flow: column;
    align-items: center;
    justify-content: center;
    font-size: 38px;
    .m-login-logo{
      display: block;
      width: 280px;
      height: 280px;
      border-radius: 50%;
      background-color: #a4a4a4;
      box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.16);
      margin: 71px 0 157px;
    }
    .m-login-input{
      width: 600px;
      height: 100px;
      border-radius: 10px;
      box-shadow: 0 5px 6px 0 rgba(0, 0, 0, 0.16);
      background-color: #fff;
      margin-bottom: 45px;
      input{
        width: 600px;
        height: 100px;
        border-radius: 10px;
        border: none;
        text-align: center;
        font-size: 36px;
      }
    }
    .m-login-btn{
      width: 600px;
      height: 100px;
      line-height: 100px;
      border-radius: 10px;
      box-shadow: 0 5px 6px 0 rgba(0, 0, 0, 0.16);
      background-color: @mainColor;
    }
    .m-login-y{
      color: @mainColor;
    }
    .m-login-p{
      font-size: 24px;
    }
  }
  input::-webkit-input-placeholder{
    color: #ccc;
  }
  input::-moz-placeholder{  //不知道为何火狐的placeholder的颜色是粉红色，怎么改都不行，希望有大牛路过帮忙指点
    color: #ccc;
  }
  input:-ms-input-placeholder{  //由于我的IE刚好是IE9，支持不了placeholder，所以也测试不了(⊙﹏⊙)，有IE10以上的娃可以帮我试试
    color: #ccc;
  }
</style>
