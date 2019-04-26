import wx from 'weixin-js-sdk';
import axios from 'axios';
import api from '../../api/api';
import {Toast} from 'mint-ui';
const wxApi = {
  /**
   * [isweixin 判断是否微信浏览器]
   */
  isweixin() {
    const ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
      return true
    } else {
      this.$router.push({path: '/wxkj/isnotWechat'});
      return false
    }
  },
  isWxAuth() {
    let localUid = localStorage.getItem('localUid');
    let localToken = localStorage.getItem('localToken');
    if (!localToken) {
      let token = this.$route.query.token;
      let uid = this.$route.query.uid;
      if (token) {
        localStorage.setItem('localToken', token);
        localStorage.setItem('localUid', uid)
      } else {
        // 将url编码后传给后端，解决微信过滤Vue hash模式 #被过滤的问题
        var u = encodeURIComponent(window.location.href);
        window.location.href = hostName + '/wxpl/oauth?forwardUrl=' + u
      }
    }
  },


  wxRegister(link) {
    let params = {
      url: link,
      app_from: window.location.origin.substr(8, window.location.origin.length)
    };
    axios.get(api.get_wxconfig, { params: params }).then((res) => {
      if(res.data.status == 200) {
        wx.config({
          debug: false,
          appId: res.data.data.appId,
          timestamp: Number(res.data.data.timestamp),
          nonceStr: res.data.data.noncestr,
          signature: res.data.data.sign,
          jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData', 'onMenuShareAppMessage', 'onMenuShareTimeline',
            'previewImage','getLocation']
        });
      }
    }).catch((error) => {
      console.log(error)
    });
    // 需在用户可能点击分享按钮前就先调用
    wx.ready(function() {
      // 获取微信分享参数
      // axios.get(api.get_share_params).then(res => {
      //   if(res.data.status == 200) {
      //     let params = res.data.data;
      //     // 自定义“分享给朋友”及“分享到QQ”按钮的分享内容（1.4.0）
          if(wx.updateAppMessageShareData) {
            wx.updateAppMessageShareData({
              title: params.title, // 分享标题
              desc: params.content, // 分享描述
              link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
              imgUrl: params.img, // 分享图标
              success: function () {
                // 设置成功
              }
            });
          }
          // 自定义“分享到朋友圈”及“分享到QQ空间”按钮的分享内容（1.4.0）
          if(wx.updateTimelineShareData) {
            wx.updateTimelineShareData({
              title: params.title, // 分享标题
              link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
              imgUrl: params.img, // 分享图标
              success: function () {
                // 设置成功
              }
            });
          }
        // }
      // });
    });
  },

  // 预览图片
  previewImage(options) {
    wx.previewImage({
      current: options.current, // 当前显示图片的http链接
      urls: options.urls, // 需要预览的图片http链接列表
      success() {
        console.log("success", options);
      },
      failed() {
        console.log("failed", options);
      }
    });
  }

};
export default wxApi
