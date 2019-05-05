// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import axios from 'axios'
import 'lib-flexible'
Vue.config.productionTip = false

//mint-ui
import Mint from 'mint-ui';
Vue.use(Mint);
import 'mint-ui/lib/style.css'
import VueClipboard from 'vue-clipboard2'

import router from './router'
VueClipboard.config.autoSetContainer = true // add this line
Vue.use(VueClipboard)
window.router = router;

/*点击事件延迟问题*/
import fastClick from 'fastclick'
fastClick.attach(document.body)
//视频播放
// import VideoPlayer from 'vue-video-player'
// require('video.js/dist/video-js.css')
// require('vue-video-player/src/custom-theme.css')
// Vue.use(VideoPlayer)



//处理移动端click事件300毫秒延迟。
import FastClick from 'fastclick'
FastClick.attach(document.body);

import promise from 'es6-promise';//解决axios在ie9下不生效的方法
promise.polyfill();

// 引入moment用来格式化时间
import moment from "moment";
Vue.prototype.$moment = moment;

// 引入animate.css
import animate from 'animate.css'

Vue.prototype.$http = axios;
import api from './api/api';
Vue.prototype.$api = api;
//拦截器、
// import { Loading, Message, MessageBox  } from 'element-ui'
import { Indicator,Toast,MessageBox} from 'mint-ui';
// 超时时间
axios.defaults.timeout = 60000;


//http请求拦截器
var loadinginstace
axios.interceptors.request.use(config => {
  // 每次请求的时候判断是否是新人即没有验证手机号
  /*if(localStorage.getItem('is_new')) {
    if(config.url.indexOf('bing_telphone') < 0 && config.url.indexOf('get_inforcode') < 0) {
      // router.push({ path: '/personal/editInput', query: { from: 'new' }})
      // 避免code影响
      window.location.href = window.location.origin + '/#/personal/editInput?from=new';
      // return false;
    }
  }*/

  Indicator.open({ text: '加载中...', spinnerType: 'fading-circle' });
  return config
}, error => {
  // Message({
  //   message:'加载超时',
  //   type:'warning'
  // });
  // loadinginstace.close()
  Indicator.close();
  return Promise.reject(error)
})
import store from './vuex';
// localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsImlhdCI6MTU0NzEwNzQ4NSwiZXhwIjoxNTQ3NzEyMjg1fQ.eyJ1c2VybmFtZSI6Ilx1Njc2OFx1NTZmZFx1NjgwYiIsImlkIjoiNjFmNjdiNWUtMTQyNC0xMWU5LTg0YTgtMDAxNjNlMTNhM2UzIiwibW9kZWwiOiJVc2VyIiwibGV2ZWwiOjR9.8ezghAQB-APPaTigMex2LmAhAeudU1ZwMAHUBdC3184');
// localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsImlhdCI6MTU0NzE3OTA0NCwiZXhwIjoxNTQ3NzgzODQ0fQ.eyJ1c2VybmFtZSI6Ilx1Njc2OFx1NjdkMCIsImlkIjoiODU0YjNlYTAtMDcyNy0xMWU5LWIyMDAtMDAxNjNlMDhkMzBmIiwibW9kZWwiOiJVc2VyIiwibGV2ZWwiOjF9.STGgLdOvD73gpSjKbtwy3T-kKXYxE9i94jnUyoM8hvY');
// http响应拦截器
import common from './common/js/common';
axios.interceptors.response.use(data => {// 响应成功关闭loading
  // loadinginstace.close()

  // 返回状态码不是200时统一报错
  if(data.data.status != 200) {

    // token有问题
    if(data.data.status_code == 405007 || data.data.message == '用户不存在') {
      localStorage.removeItem('token');

      if(localStorage.getItem('toLogin')) {
        Toast({ message: data.data.message, duration: 600 });  // Toast('未登录');
        store.state.show_login = true;
      }else {
        // 避免code影响
        // router.push('/login');
        // alert(location.href);
        // alert(location.href.indexOf('code') < 0)
        if(location.href.indexOf('code') < 0) {
          localStorage.setItem('href', location.href);
        }

        // window.location.href = window.location.origin + '/#/login';
        store.state.show_login = true;
        localStorage.setItem('toLogin', 'toLogin');
        // 倒计时60秒*5再提醒一次
        const TIME_COUNT = 60*5;
        let count = TIME_COUNT;
        let time = setInterval(() => {
          if (count > 0 && count <= TIME_COUNT) {
            count --;
          } else {
            localStorage.setItem('toLogin', '');
            clearInterval(time);
          }
        }, 1000);
      }
    }
    // 微信登录失败
    else if(data.data.status_code == 405012 || data.data.message == '微信登录失败') {
      // 避免code影响
      // window.location.href = window.location.origin + '/#/login';
      store.state.show_login = true;
    }
    // 店主版块显示无权限 - 刷新token
    else if(data.data.status_code == 405003 && data.data.message == '无权限') {
      axios.get(api.auth_fresh + '?token=' + localStorage.getItem('token')).then(res => {
        if(res.data.status == 200){
          localStorage.setItem('token', res.data.data);
        }
      })
    }
    // 每日竞猜 - 昨日未参与 不显示
    else if(data.data.status_code == 405004 && data.data.status == 404 && data.data.message == '昨日未参与') {

    }
    else {
      Toast(data.data.message);
    }
  }

  Indicator.close();
  return data
}, error => {
  // Message({
  //   message:'请求失败',
  //   type:'warning'
  // });
  // loadinginstace.close()
  // if(data.data.status == 502){
    router.push('/systemfix');
  // }
  Indicator.close();
  return Promise.reject(error)
});


//引入微信
import 'weixin-js-sdk';

//过滤器
Vue.filter('money', function(val) {
  val = val.toString().replace(/\$|\,/g,'');
  if(isNaN(val)) {
    val = "0";
  }
  let sign = (val == (val = Math.abs(val)));
  val = Math.floor(val*100+0.50000000001);
  let cents = val%100;
  val = Math.floor(val/100).toString();
  if(cents<10) {
    cents = "0" + cents
  }
  for (var i = 0; i < Math.floor((val.length-(1+i))/3); i++) {
    val = val.substring(0,val.length-(4*i+3))+',' + val.substring(val.length-(4*i+3));
  }

  return (((sign)?'':'-') + val + '.' + cents);
});
Vue.filter('time', function(val) {

  let _val = '';

  if(val){
    val = val.toString();


    _val = `${val.slice(0,4)}/${val.slice(5,7)}/${val.slice(8,10)}`

  }

  return _val;
});

router.beforeEach((to,from,next) => {
  if(localStorage.getItem('version') && localStorage.getItem('version') != store.state.version){
    MessageBox.confirm('检测到系统更新，为了更好的体验，请点击确定清除缓存').then(() => {
      localStorage.clear();
      localStorage.setItem('wx_url',window.location.href);
      localStorage.setItem('version',store.state.version);
      // this.$store.state.show_login = true;
      // this.$router.go(0);
      next('/');
    }).catch(() => {
      next();
    });

  }else{
    localStorage.setItem('version',store.state.version);
    next();
  }

})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
});
