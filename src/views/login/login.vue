<template>
  <div class="m-login">
    <!--<p>登录</p>-->
    <img class="m-login-logo" src="/static/images/logo.jpg" alt="">
    <!--<div  class="m-login-input" >
    <input type="text" v-model="ustelphone" placeholder="请输入手机号码">
    <span class="m-code" @click="sendCode" v-if="!isSend">发送验证码</span>
    <span class="m-code cancel" v-else>{{count}}秒后重新发送</span>
  </div>
    <div type="text" class="m-login-input">
      <input type="text" v-model="identifyingcode" maxlength="6" placeholder="请输入验证码">
    </div>
    <div class="m-login-btn" @click="loginClick">登  录</div>-->

    <div class="m-wei-box" @click="login">
      <p >
        <span class="m-icon-wei"></span>
      </p>
      <p class="m-ft-28">微信快速登录</p>
    </div>
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
        ustelphone:'',
        identifyingcode:'',
        isSend:false,
        timer:null,
        count:''
      }
    },
    components: {},
    methods: {
      sendCode() {
        if(this.ustelphone){
          const TIME_COUNT = 60;
          axios.get(api.get_inforcode + "?ustelphone=" + this.ustelphone).then(res => {
            if(res.data.status ==200){
              // console.log(res.data.data);
            }
          });
          if(!this.timer) {
            this.count = TIME_COUNT;
            this.isSend = true;
            this.timer = setInterval(() => {
              if(this.count > 0 && this.count <= TIME_COUNT) {
                this.count--;
              }else {
                this.isSend = false;
                clearInterval(this.timer);
                this.timer = null;
              }
            }, 1000)
          }
        }else{
          Toast("请先输入手机号码");
        }
      },
      loginClick(){
        if(!this.ustelphone){
          Toast("请先输入手机号码");
          return false;
        }else if(!this.identifyingcode){
          Toast("请先输入验证码");
          return false;
        }
        let params = {
          ustelphone: this.ustelphone,
          identifyingcode: this.identifyingcode,
          app_from: window.location.origin.substr(8, window.location.origin.length)
        };
        axios.post(api.login, params).then(res => {
          if(res.data.status == 200) {
            if(res.data.data.openid) {
              localStorage.setItem('token', res.data.data.token);
              this.$router.push('/selected');
            }else {
              Toast({ message: '检测到您未进行过微信登录，请点击下方微信快速登录进入', duration: 3000 });
              localStorage.setItem('ustelphone', this.ustelphone);
            }
          }
        });
      },
      // 是否是微信自带的浏览器
      isWeiXin() {
        // mozilla/5.0 (iphone; cpu iphone os 9_1 like mac os x) applewebkit/601.1.46 (khtml, like gecko)version/9.0 mobile/13b143 safari/601.1
        let ua = window.navigator.userAgent.toLowerCase();
        // console.log(ua);

        if(ua.match(/MicroMessenger/i) == 'micromessenger') {
          return true;
        }else {
          return false;
        }
      },
      // 获取微信参数
      login() {
        let params = {
          url: window.location.href.split('#')[0],
          // url: window.location.href,
          app_from: window.location.origin.substr(8, window.location.origin.length)
        };
        axios.get(api.get_wxconfig, { params: params }).then((res) => {
          if(res.data.status == 200){
            const id = res.data.data.appId;
            // const url = window.location.origin + '/#/login';
            const url = window.location.href;
            window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='
              + id + '&redirect_uri='+ encodeURIComponent(url) + '&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect'
          }
        }).catch((error) => {
          console.log(error ,'1111');
        });
      },
    },
    mounted() {
      common.changeTitle('登录');
      if(this.isWeiXin()){    //是来自微信内置浏览器
        if(common.GetQueryString('code')) {
         /* if(localStorage.getItem('is_new')) {

          }else {*/
            // 获取微信信息，如果之前没有使用微信登陆过，将进行授权登录
            window.localStorage.setItem("code", common.GetQueryString('code'));
            let params = {
              app_from: window.location.origin.substr(8, window.location.origin.length),
              code: common.GetQueryString('code')
            };
            if(localStorage.getItem('secret_usid')) {
              params.secret_usid = localStorage.getItem('secret_usid').split('&from')[0];
            }
            axios.post(api.wx_login, params).then(res => {
              if(res.data.status == 200) {
                // localStorage.removeItem('secret_usid');
                localStorage.removeItem('toLogin');
                window.localStorage.setItem("token",res.data.data.token);
                window.localStorage.setItem("openid",res.data.data.user.openid);
                if(res.data.data.is_new) {
                  localStorage.setItem('is_new', res.data.data.is_new);
                  this.$router.push({ path: '/personal/editInput', query: { from: 'new' }});
                }else {
                  if(localStorage.getItem('login_to')){
                    localStorage.setItem('url', localStorage.getItem('login_to').split('&from')[0]);
                    if(localStorage.getItem('login_to').indexOf('fmfpid') > 0) {             // 新人首单
                      localStorage.setItem('share', 'fmfpid');
                    }else if(localStorage.getItem('login_to').indexOf('tcid') > 0) {               // 试用商品
                      localStorage.setItem('share', 'tcid');
                    }else if(localStorage.getItem('login_to').indexOf('neid') > 0) {               // 圈子详情 - 在圈子列表页点击的分享
                      localStorage.setItem('share', 'neid');
                    }
                  }
                  this.$router.push('/selected');
                  Toast('登录成功');
                }
              }
            });
          // }
        }
      }
    },
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>
  @import "../../common/css/index";

  .m-login{
    min-height: 100vh;
    background: url("/static/images/login-bg.png") no-repeat;
    background-size: 100% 100%;
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
      margin: 71px 0 127px;
    }
    .m-login-input{
      width: 600px;
      height: 100px;
      border-radius: 10px;
      box-shadow: 0 5px 6px 0 rgba(0, 0, 0, 0.16);
      background-color: rgba(255,255,255,0.2);
      color: #333;
      text-align: left;
      margin-bottom: 45px;
      .m-code{
        display: inline-block;
        margin-left: 40px;
        padding: 6px 18px;
        border-radius: 10px;
        background-color: @mainColor;
        font-size: 21px;
        color: #fff;
        box-shadow: 0 3px 6px rgba(0,0,0,0.16);
        &.cancel{
          background-color: #ccc;
          margin-left: 5px;
        }
      }
      input{
        display: inline-block;
        width: 308px;
        padding-left: 52px;
        height: 100px;
        border-radius: 10px;
        border: none;
        text-align: left;
        font-size: 28px;
        background-color: transparent;
        color: #333;
      }
    }
    .m-login-forget{
      width: 600px;
      text-align: right;
      font-size: 24px;
      margin: 8px 0;
    }
    .m-login-btn{
      width: 600px;
      height: 100px;
      line-height: 100px;
      border-radius: 10px;
      box-shadow: 0 5px 6px 0 rgba(0, 0, 0, 0.16);
      background-color: @mainColor;
    }
    .m-wei-box{
      margin: 300px 0 200px 0;
      color: #fff;
      .m-icon-wei{
        display: inline-block;
        width: 110px;
        height: 110px;
        background: url("/static/images/icon-wei.png") no-repeat;
        background-size: 100% 100%;
      }
    }
  }
  input::-webkit-input-placeholder{
    color: #333;
  }
  input::-moz-placeholder{  //不知道为何火狐的placeholder的颜色是粉红色，怎么改都不行，希望有大牛路过帮忙指点
    color: #333;
  }
  input:-ms-input-placeholder{  //由于我的IE刚好是IE9，支持不了placeholder，所以也测试不了(⊙﹏⊙)，有IE10以上的娃可以帮我试试
    color: #333;
  }
</style>
