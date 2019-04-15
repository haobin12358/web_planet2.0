<template>
  <div class="m-code">
    <!--<div class="m-day-box">-->
      <!--<h3>-->
        <!--<span class="m-day">{{dayNum}}</span>-->
        <!--<span>{{monthNum}}</span>-->
      <!--</h3>-->
      <!--<h3>{{month}} / {{day}}</h3>-->
    <!--</div>-->
    <!--<img :src="user.usqrcode" class="m-code-img" alt="">-->
    <!--<p class="m-right-info">用户二维码</p>-->
    <!--<ul class="m-code-ul">-->
      <!--<li>-->
        <!--1.该二维码是您的专属推广二维码，可直接右上角分享到朋友圈邀请好友成为商城会员。</li>-->
        <!--<li>2.使用微信扫一扫功能直接邀请您的好友成为商城会员。</li>-->
        <!--<li>3.长按图片保存后分享到朋友圈。</li>-->
    <!--</ul>-->
    <!--<img class="m-code-back" alt="">-->
    <!--<img  v-lazy="back_img"  class="m-code-back" v-if="!have_done" alt="">-->
    <img id="avatar"   class="m-code-back"/>
  </div>
</template>

<script type="text/ecmascript-6">
  import common from '../../../common/js/common';
  import axios from 'axios';
  import api from '../../../api/api';
  import { Indicator,Toast } from 'mint-ui';
  import wxapi from '../../../common/js/mixins';
  import wx from 'weixin-js-sdk';
  export default {
    data() {
      return {
        back_img:'/static/images/icon-code-back-now.png',
        name: '',
        user: {},
        day: "",
        month: "",
        dayNum: "",
        monthNum: "",
        have_done:false
      }
    },
    mixins: [wxapi],
    components: {},
    methods: {
      // 获取个人信息
      getUser() {
        axios.get(api.get_home + "?token=" + localStorage.getItem('token')).then(res => {
          if(res.data.status == 200){
            this.user = res.data.data;
            this.have_done = true;
            this.drawAndShareImage()
          }
        });
      },// 获取时间
      getDate() {
        this.dayNum = new Date().getDate();
        this.monthNum = new Date().toString().substr(4, 4);

        // 判断星期几
        switch(new Date().getDay()) {
          case 1:
            this.day = "星期一";
            break;
          case 2:
            this.day = "星期二";
            break;
          case 3:
            this.day = "星期三";
            break;
          case 4:
            this.day = "星期四";
            break;
          case 5:
            this.day = "星期五";
            break;
          case 6:
            this.day = "星期六";
            break;
          case 7:
            this.day = "星期日";
            break;
        }

        // 判断月份
        switch(new Date().getMonth() + 1) {
          case 1:
            this.month = "一月";
            break;
          case 2:
            this.month = "二月";
            break;
          case 3:
            this.month = "三月";
            break;
          case 4:
            this.month = "四月";
            break;
          case 5:
            this.month = "五月";
            break;
          case 6:
            this.month = "六月";
            break;
          case 7:
            this.month = "七月";
            break;
          case 8:
            this.month = "八月";
            break;
          case 9:
            this.month = "九月";
            break;
          case 10:
            this.month = "十月";
            break;
          case 11:
            this.month = "十一月";
            break;
          case 12:
            this.month = "十二月";
            break;
        }
      },
      drawAndShareImage(){
        Indicator.open({ text: '加载中...', spinnerType: 'fading-circle' });
        var canvas = document.createElement("canvas");
        canvas.width = 750;
        canvas.height = 6900;
        var context = canvas.getContext("2d");

        context.rect(0 , 0 , canvas.width , canvas.height);
        context.fillStyle = "#fff";
        context.fill();

        var myImage = new Image();
        myImage.src = "/static/images/icon-code-back-now.png";    //背景图片  你自己本地的图片或者在线图片
        myImage.crossOrigin = 'Anonymous';
       let that = this;
        myImage.onload = function(){
          context.drawImage(myImage , 0 , 0 , 750 , 6900);

          // context.font = "60px Courier New";
          // context.fillText("我是文字",350,450);

          var myImage2 = new Image();
          myImage2.src = that.user.usqrcode;   //你自己本地的图片或者在线图片
          myImage2.crossOrigin = 'Anonymous';
          // myImage2.setAttribute("crossOrigin",'anonymous');
          myImage2.onload = function(){
            context.drawImage(myImage2 , 500 , 6500 , 150 , 150);
            var base64 = canvas.toDataURL("image/jpeg",0.7);  //"image/png" 这里注意一下
            var img = document.getElementById('avatar');

            // document.getElementById('avatar').src = base64;
            img.setAttribute('src' , base64);
            Indicator.close();
            console.log(Indicator,'加载完成')
          }
        }
      },
      // 分享code
      shareCode(val) {
        if(localStorage.getItem('token')) {
          let options = {
            title: this.user.usname,
            desc: this.user.usidname,
            imgUrl: this.user.usqrcode,
            link: location.href.split('#')[0]+'?page=index'
          };
          axios.get(api.secret_usid + '?token=' + localStorage.getItem('token')).then(res => {
            if(res.data.status == 200) {
              options.link += '&secret_usid=' + res.data.data.secret_usid;
            }
          });

          // 自定义“分享给朋友”及“分享到QQ”按钮的分享内容（1.4.0）
          if(wx.updateAppMessageShareData) {
            wx.updateAppMessageShareData(options);
          }
          // 自定义“分享到朋友圈”及“分享到QQ空间”按钮的分享内容（1.4.0）
          if(wx.updateTimelineShareData) {
            wx.updateTimelineShareData(options);
          }
          // 获取“分享给朋友”按钮点击状态及自定义分享内容接口（即将废弃）
          if(wx.onMenuShareAppMessage) {
            wx.onMenuShareAppMessage(options);
          }
          // 获取“分享到朋友圈”按钮点击状态及自定义分享内容接口（即将废弃）
          if(wx.onMenuShareTimeline) {
            wx.onMenuShareTimeline(options);
          }
        }else {
          Toast('请登录后再试');
        }
      },
    },
    mounted() {
      common.changeTitle('用户二维码');
      wxapi.wxRegister(location.href.split('#')[0]);
      this.getUser();       // 获取个人信息
      // this.getDate();       // 获取时间
      localStorage.removeItem('share');
      localStorage.removeItem('url');
      if(localStorage.getItem('token')) {
        // 倒计时
        const TIME_COUNT = 1;
        let count = TIME_COUNT;
        let time = setInterval(() => {
          if(count > 0 && count <= TIME_COUNT) {
            count --;
          }else {
            this.shareCode(1);
            clearInterval(time);
          }
        }, 300);
        Indicator.open({ text: '加载中...', spinnerType: 'fading-circle' });
      }
    }
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>
.m-code{
  width: 100%;
  height: 6900px;
  position: relative;
  /*height: 1334px;*/
  /*background: url("/static/images/icon-code-back.png") no-repeat;*/
  background-size: 100% 100%;
  .m-code-back{
    width: 750px;
    height: 6900px;
  }
  .m-code-img{
    position: absolute;
    bottom: 240px;
    right: 50px;
    width: 150px;
    height: 150px;
  }
  /*.m-day-box{*/
    /*padding: 130px 67px 56px;*/
    /*h3{*/
      /*text-align: left;*/
      /*font-size: 40px;*/
      /*color: #fff;*/
      /*margin: 0;*/
      /*font-weight: 400;*/
      /*.m-day{*/
        /*font-size: 60px;*/
        /*font-weight: bold;*/
      /*}*/
    /*}*/
  /*}*/
  /*.m-code-img{*/
    /*display: block;*/
    /*width: 621px;*/
    /*height: 621px;*/
    /*background: #edb3b1;*/
    /*margin-left: 67px;*/
    /*margin-bottom: 20px;*/
  /*}*/
  /*.m-right-info{*/
    /*text-align: right;*/
    /*padding-right: 67px;*/
    /*color: #fff;*/
    /*font-size: 28px;*/
  /*}*/
  /*.m-code-ul{*/
    /*padding: 0 67px;*/
    /*margin-top: 60px;*/
    /*li{*/
      /*list-style: none;*/
      /*text-align: left;*/
      /*color: #fff;*/
      /*width: 603px;*/
      /*line-height: 36px;*/
    /*}*/
  /*}*/
}
</style>
