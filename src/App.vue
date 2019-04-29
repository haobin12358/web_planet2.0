<!--<template>
  <div id="app">
    &lt;!&ndash;<span class="m-return" @click.stop="returnClick">返回</span>&ndash;&gt;
    <router-view v-if="isRouterAlive"/>
  </div>
</template>-->

<template>
  <div id="app" >
    <keep-alive>
      <router-view :key="key" v-if="isRouterAlive && $route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view :key="key" v-if="isRouterAlive && !$route.meta.keepAlive"></router-view>
    <div class="m-login-modal" v-if="$store.state.show_login" >
      <div class="m-modal-state">
        <h3 class="m-modal-head">微信登录</h3>
        <div class="m-logo-box">
          <img src="/static/images/logo.jpg" alt="">
          <span>大行星商城申请获取以下权限：</span>
        </div>
        <div class="m-text">
          <span class="m-dot"></span>
          <span class="m-t">获得你的公开信息(昵称、头像、地区及性别)</span>
        </div>
        <div class="m-btn-box">
          <span @click.stop="cancelLogin">拒绝</span>
          <span class="active" @click.stop="login">允许</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import api from './api/api';
  import common from './common/js/common';
  import {Toast} from 'mint-ui';
  String.prototype.endWith=function(endStr){
    let d=this.length-endStr.length;
    return (d>=0&&this.lastIndexOf(endStr)==d);
  }
export default {
  name: 'App',
  provide(){
    return{
      reload:this.reload
    }
  },
  data(){
    return{
      isRouterAlive:true
    }
  },
  computed:{
    key(){
      return this.$route.path + Math.random();
    }
  },
  created() {
    // this.$router.beforeEach((to, from, next) => {
    //   setTimeout(function () {
    //     window.location.href = window.location.href;
    //   }, 500);
    // });
    // 将邀请人的usid保存，等注册的时候使用
    if((location.href.indexOf('editInput') > 0 && localStorage.getItem('is_new'))){
      this.$store.state.show_login = false;
    }
    if(!localStorage.getItem('token')) {
        if(localStorage.getItem('wx_url') && localStorage.getItem('wx_url').indexOf('secret_usid') > 0){


            localStorage.setItem('secret_usid', localStorage.getItem('wx_url').split('secret_usid=')[1])

        }else if(location.href.indexOf('secret_usid') > 0){
          localStorage.setItem('secret_usid', location.href.split('secret_usid=')[1])
        }

        // localStorage.setItem('location',location.href);
        // location.href = location.origin +'/login';
    }
    let url =location.href.indexOf('&from') > 0? location.href.split('&from')[0]:location.href;
    if(!localStorage.getItem('url')) {
      if(url.indexOf('&secret_usid') > 0) {
        localStorage.setItem('url', url);
      }
    }else {
      if(localStorage.getItem('url').indexOf('&secret_usid') < 0) {
        localStorage.removeItem('url');
        if(url.indexOf('&secret_usid') > 0) {
          localStorage.setItem('url', url);
        }
      }
    }
    let params = {};
    if(location.href.indexOf('mbjid') > 0) {                    // 邀请好友帮拆魔盒
      localStorage.setItem('share', 'mbjid');
      location.href = location.origin;
      this.shareRecord(params);
    }else if(location.href.indexOf('fmfpid') > 0) {             // 新人首单
      localStorage.setItem('share', 'fmfpid');
      location.href = location.origin;
      this.shareRecord(params);
    }else if(location.href.indexOf('tlpid') > 0) {             // 限时活动
      localStorage.setItem('share', 'tlpid');
      location.href = location.origin;
      this.shareRecord(params);
    }else if(location.href.indexOf('tcid') > 0) {               // 试用商品
      localStorage.setItem('share', 'tcid');
      location.href = location.origin;
      this.shareRecord(params);
    }else if(location.href.indexOf('neid') > 0) {               // 圈子详情 - 在圈子列表页点击的分享
      localStorage.setItem('share', 'neid');
      location.href = location.origin;
      this.shareRecord(params);
    }else if(location.href.indexOf('prid') > 0) {               // 商品详情
      localStorage.setItem('share', 'prid');
      location.href = location.origin;
      this.shareRecord(params);
    }else if(location.href.indexOf('ipid') > 0) {               // 星币商品详情
      localStorage.setItem('share', 'ipid');
      location.href = location.origin;
      this.shareRecord(params);
    }else if(location.href.indexOf('circleid') > 0) {           // 店主版圈子右上角分享
      location.href = location.origin + '/#/circle';
      this.shareRecord(params);
    }else if(location.href.indexOf('activityId=new') > 0) {     // 新人首单默认右上角分享
      localStorage.setItem('share', 'activityId=new');
      location.href = location.origin;
      this.shareRecord(params);
    }else if(location.href.indexOf('activityId=try') > 0) {     // 试用商品默认右上角分享
      localStorage.setItem('share', 'activityId=try');
      location.href = location.origin;
      this.shareRecord(params);
    }else if(location.href.indexOf('uaid') > 0) {     // 竞猜填写数字页面
      localStorage.setItem('share', 'uaid');
      location.href = location.origin;
      this.shareRecord(params);
    }else if(location.href.indexOf('tlaid') > 0) {     // 限时活动列表
      localStorage.setItem('share', 'tlaid');
      location.href = location.origin;
      this.shareRecord(params);
    }else if(location.href.indexOf('page') > 0) {     // 跳转到首页
      localStorage.setItem('share', 'index');
      location.href = location.origin;
      this.shareRecord(params);
    }else if(location.href.indexOf('actype') > 0) {     // 跳转到活动
      localStorage.setItem('share', 'actype');
      location.href = location.origin;
      this.shareRecord(params);
    }
    // 新人不绑手机号就清除localStorage
    if(localStorage.getItem('is_new')) {
      localStorage.clear()
    }
  },
  mounted() {
    console.log('v 0.7.5');
    // let token = 'eyJhbGciOiJIUzI1NiIsImlhdCI6MTU1MDk4Nzc4MSwiZXhwIjoxNTUxNTkyNTgxfQ.eyJ1c2VybmFtZSI6Ilx1NTNlYVx1NjYyZlx1NmNhMVx1NjcwOVx1NTk4Mlx1Njc5YyIsImlkIjoiNTE4NjZlZjYtMTI3NS0xMWU5LWI4YjItMDAxNjNlMDhkMzBmIiwibW9kZWwiOiJVc2VyIiwibGV2ZWwiOjJ9.BHLdRBzIWQRl7xuMyi2vBh6HP_fUR1kVOHBmQMTFiTg';
    // let token = 'eyJhbGciOiJIUzI1NiIsImlhdCI6MTU1MTUwNDk0NywiZXhwIjoxNTUyMTA5NzQ3fQ.eyJ1c2VybmFtZSI6Ilx1NTNlYVx1NjYyZlx1NmNhMVx1NjcwOVx1NTk4Mlx1Njc5YyIsImlkIjoiMjczNDU1ODItM2MwYS0xMWU5LWE0ZjYtMDAxNjNlMTNhM2UzIiwibW9kZWwiOiJVc2VyIiwibGV2ZWwiOjF9.4JXjxmYNjqu95XVoLb17bzyzbS3bpswRGpBZOsEXmGA';
    // localStorage.setItem('token', token);
    localStorage.setItem('toLogin', '');
    if(localStorage.getItem('token') || (location.href.indexOf('editInput') > 0 && localStorage.getItem('is_new'))){
      this.$store.state.show_login = false;
    }else{
      if(this.isWeiXin()){    //是来自微信内置浏览器
        if(common.GetQueryString('code')) {
          // Toast(common.GetQueryString('code'));
          /* if(localStorage.getItem('is_new')) {

           }else {*/
          // 获取微信信息，如果之前没有使用微信登陆过，将进行授权登录
          window.localStorage.setItem("code", common.GetQueryString('code'));
          let params = {
            app_from: window.location.origin.substr(8, window.location.origin.length),
            code: common.GetQueryString('code')
          };
          if(localStorage.getItem('secret_usid')) {
            let _usid = localStorage.getItem('secret_usid').split('&from')[0];
            if(_usid.endsWith('#/')) {
              _usid = _usid.substr(0, _usid.length - 2);
            }else if(_usid.endsWith('#/selected')){
              _usid = _usid.substr(0, _usid.length - 10);
            }
            params.secret_usid = _usid;
          }
          if(localStorage.getItem('login_not_silent')){
            axios.post(api.wx_login, params).then(res => {
              if(res.data.status == 200) {
                // localStorage.removeItem('secret_usid');
                localStorage.removeItem('toLogin');
                localStorage.removeItem('login_not_silent');
                localStorage.removeItem('login_silent')
                if(res.data.data.token){
                  window.localStorage.setItem("token", res.data.data.token);
                }
                window.localStorage.setItem("openid",res.data.data.user.openid);
                if(res.data.data.is_new) {
                  localStorage.setItem('is_new', res.data.data.is_new);
                  localStorage.setItem('new_url',location.href.split('&from')[0]);
                  this.$router.push({ path: '/personal/editInput', query: { from: 'new' }});
                }else {
                  this.$store.state.show_login = false;
                  if(localStorage.getItem('wx_url')){
                    localStorage.setItem('url', localStorage.getItem('wx_url').split('&from')[0]);
                    if(localStorage.getItem('wx_url').indexOf('fmfpid') > 0) {             // 新人首单
                      localStorage.setItem('share', 'fmfpid');
                    }else if(localStorage.getItem('wx_url').indexOf('tcid') > 0) {               // 试用商品
                      localStorage.setItem('share', 'tcid');
                    }else if(localStorage.getItem('wx_url').indexOf('neid') > 0) {               // 圈子详情 - 在圈子列表页点击的分享
                      localStorage.setItem('share', 'neid');
                    }else if(localStorage.getItem('wx_url').indexOf('prid') > 0) {               // 商品详情
                      localStorage.setItem('share', 'prid');
                    }else if(localStorage.getItem('wx_url').indexOf('tlpid') > 0) {               // 商品详情
                      localStorage.setItem('share', 'tlpid');
                    }
                    this.$router.push('/selected');
                  }else{
                    this.$router.go(0);
                  }
                  Toast('登录成功');
                }
              }
            });
          }else{
            axios.post(api.wx_login_silent, params).then(res => {
              if(res.data.status == 200) {
                // localStorage.removeItem('secret_usid');
                localStorage.removeItem('toLogin');
                if(res.data.data.token){
                  window.localStorage.setItem("token", res.data.data.token);
                }
                window.localStorage.setItem("openid", res.data.data.user.openid);
                if(localStorage.getItem('wx_url')){
                  localStorage.setItem('url', localStorage.getItem('wx_url').split('&from')[0]);
                  if(localStorage.getItem('wx_url').indexOf('fmfpid') > 0) {             // 新人首单
                    localStorage.setItem('share', 'fmfpid');
                  }else if(localStorage.getItem('wx_url').indexOf('tcid') > 0) {               // 试用商品
                    localStorage.setItem('share', 'tcid');
                  }else if(localStorage.getItem('wx_url').indexOf('neid') > 0) {               // 圈子详情 - 在圈子列表页点击的分享
                    localStorage.setItem('share', 'neid');
                  }else if(localStorage.getItem('wx_url').indexOf('prid') > 0) {               // 商品详情
                    localStorage.setItem('share', 'prid');
                  }else if(localStorage.getItem('wx_url').indexOf('tlpid') > 0) {               // 商品详情限时
                    localStorage.setItem('share', 'tlpid');
                  }
                  this.$router.push('/selected');
                }
                // else{
                //   this.$router.go(0);
                // }
                // Toast('登录成功');
              }
            });
          }
          // }
        }else{
          if(!localStorage.getItem('login_silent')){
            this.login_new();
          }
        }
      }
    }

  },
  methods:{
    returnClick(){
      this.$router.go(-1);
    },
    reload(){
      this.isRouterAlive = false;
      this.$nextTick(function () {
        this.isRouterAlive =true;
      })
    },
    shareRecord(params) {
      console.log(params);
      /*axios.post(api.refund_cancel + '?token='+ localStorage.getItem('token'), { oraid: this.refund.oraid }).then(res => {
        if(res.data.status == 200) {

        }
      });*/
    },
    cancelLogin(){
      this.$store.state.show_login = false;
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
          localStorage.setItem('login_not_silent','not_silent');
          const id = res.data.data.appId;
          // const url = window.location.origin + '/#/login';
          let url = window.location.href;
          if(url.indexOf('?') != -1){
            localStorage.setItem('wx_url',url);
            url = window.location.origin + '/#/selected';
          }else if(url.indexOf('code') != -1){
            url = window.location.origin + '/#/selected';
          }
          axios.get('https://test.bigxingxing.com/api/v1/user/wx_auth',{
            params:{
              url:encodeURIComponent(url),
              scope:'snsapi_userinfo'
            }
          }).then(res => {
            if(res.data.status == 200){
              window.location.href = res.data.data.url;
            }
          })
          // snsapi_userinfo
          // window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='
          //   + id + '&redirect_uri='+ encodeURIComponent(url) + '&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect'
        }
      }).catch((error) => {
        console.log(error ,'1111');
      });
    },
    // 获取微信参数
    login_new() {
      let params = {
        url: window.location.href.split('#')[0],
        // url: window.location.href,
        app_from: window.location.origin.substr(8, window.location.origin.length)
      };
      axios.get(api.get_wxconfig, { params: params }).then((res) => {
        if(res.data.status == 200){
          const id = res.data.data.appId;
          // const url = window.location.origin + '/#/login';
          localStorage.setItem('login_silent','silent');
          let url = window.location.href;
          if(url.indexOf('?') != -1){
            localStorage.setItem('wx_url',url);
            // url = window.location.origin + '/#/selected';
          }
          // snsapi_userinfo
          axios.get('https://test.bigxingxing.com/api/v1/user/wx_auth',{
            params:{
              url:encodeURIComponent(url),
              scope:'snsapi_base'
            }
          }).then(res => {
            if(res.data.status == 200){
              window.location.href = res.data.data.url;
            }
          })
          // window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='
          //   + id + '&redirect_uri='+ encodeURIComponent(url) + '&response_type=code&scope=snsapi_base&state=1#wechat_redirect'
        }
      }).catch((error) => {
        console.log(error ,'1111');
      });
    },
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
  background-color: #fff;
}

.m-return{
  position: fixed;
  left: 10px;
  top: 10px;
  width: 80px;
  height: 40px;
  line-height: 44px;
  border-radius: 15px;
  background-color: rgba(255,255,255,0.6);
  color: #f7f7f7;
  z-index: 10000;
}
  .m-login-modal{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.4);
    z-index: 1000;
    .m-modal-state{
      width: 640px;
      height: 500px;
      background-color: #fff;
      box-sizing: border-box;
      padding: 20px 40px;
      position: absolute;
      top: 50%;
      left: 50%;
      margin: -200px 0 0 -320px;
      .m-modal-head{
        font-size: 36px;
        text-align: left;
        font-weight: normal;
      }
      .m-logo-box{
        display: flex;
        flex-flow: row;
        align-items: center;
        justify-content: flex-start;
        padding-bottom: 30px;
        border-bottom: 1px solid #eee;
        img{
          display: inline-block;
          width: 120px;
          height: 120px;
          border-radius: 50%;
          margin-right: 20px;
        }
      }
      .m-text{
        /*font-size: 12px;*/
        color: #999;
        margin: 30px 0;
        text-align: left;
        display: flex;
        flex-flow: row;
        align-items: center;
        justify-content: flex-start;
        .m-dot{
          display: block;
          width: 16px;
          height: 16px;
          background-color: #999;
          border-radius: 50%;
          margin-right: 30px;
        }
        .m-t{
          display: block;
          width: 560px;
        }
      }
      .m-btn-box{
        text-align: right;
        span{
          display: inline-block;
          padding: 0 30px;
          color: #999;
          font-size: 34px;
          &.active{
            color: #333;
          }
        }
      }
    }
  }
</style>
