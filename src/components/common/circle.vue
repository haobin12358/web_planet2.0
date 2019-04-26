<template>
  <div class="m-circle-item">
    <div class="m-circle-user-box">
      <div class="m-flex-start">
        <img :src="circle.author.usheader" class="m-circle-user-avator" alt="">
        <span class="m-circle-user-name">{{circle.author.usname}}</span>
        <span class="m-circle-user-level">{{circle.author.usgrade}}</span>
      </div>
      <span class="m-circle-collect" v-if="!circle.is_own && !circle.follow" @click.stop="followClick">关注</span>
      <span class="m-circle-collect cancel" v-if="!circle.is_own && circle.follow" @click.stop="followClick">取消关注</span>
    </div>
<!--    <div class="m-circle-img-box">-->
<!--      <img src="" class="m-circle-img" alt="">-->
<!--      <img src="" class="m-circle-img" alt="">-->
<!--      <img src="" class="m-circle-img" alt="">-->
<!--    </div>-->
<!--    <div class="m-circle-text">-->
<!--      <span class="m-circle-label">#去热带的岛屿游泳#</span>-->
<!--      攻略测评打赏,榜单场景内容推荐网红打卡自由主题圈子活动游记攻略测评打赏榜单场景,内容推荐网红打卡自由主题圈子活动游记攻略测评打赏榜单场景内,容推荐自由zhuzhu-->
<!--    </div>-->
    <div class="m-one-circle-content" @click.stop="changeRoute('/circle/detail', circle)">
      <span class="m-label">{{circle.item}}</span>
      <div class="m-video-box" v-if="circle.showtype == 'video'">
        <video src="" class="m-video"></video>
        <!--<video :src="items.video" class="m-video"></video>-->
        <div class="m-img-box">
          <img :src="circle.videothumbnail" class="m-img">
        </div>
        <span class="m-video-time">{{circle.videoduration}}</span>
        <span class="m-icon-video"></span>
      </div>
      <div class="m-circle-img-box" v-else-if="circle.showtype == 'picture'">
        <img :src="circle.mainpic" class="m-circle-img">
      </div>
      <div class="m-circle-text" v-if="circle.netext" >
        <span class="m-circle-topic" v-if="circle.toctitle">#{{circle.toctitle}}#</span>
        <span  v-html="circle.netext">
        </span>
      </div>
    </div>

    <div class="m-circle-loc m-flex-start" v-if="circle.nelocation">
      <img src="/static/images/circle/icon-loc.png" class="m-icon-loc" alt="">
      <span>{{circle.nelocation}}</span>
    </div>
    <div class="m-circle-icon-box m-flex-between">
      <img src="/static/images/circle/icon-share.png" class="m-icon" @click.stop="shareCircle(circle)" alt="">
      <div class="m-flex-end">
        <div class="m-circle-icon-one" @click.stop="likeClick(index)">
          <img src="/static/images/circle/icon-like-active.png" v-if="circle.is_favorite" class="m-icon" alt="">
          <img src="/static/images/circle/icon-like.png" v-else class="m-icon" alt="">
          <span :class="circle.is_favorite?'active':''">{{circle.favoritnumber}}</span>
        </div>
        <div class="m-circle-icon-one" @click.stop="changeRoute('/circle/detail', circle, 'comments')">
          <img src="/static/images/circle/icon-comment.png" class="m-icon" alt="">
          <span>{{circle.commentnumber}}</span>
        </div>
        <div class="m-circle-icon-one" @click.stop="clickCollect">
          <img src="/static/images/circle/icon-collect-active.png" v-if="circle.collected" class="m-icon" alt="">
          <img src="/static/images/circle/icon-collect.png" v-else class="m-icon" alt="">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import api from '../../api/api';
  import wx from 'weixin-js-sdk';
    export default {
        name: "circleComponent",
      data(){
          return{

          }
      },
      props:{
          circle:{
            type:Object,
            default:null
          },
        index:{
            type:Number,
          default: 0
        }
      },
      methods:{
        // 分享圈子
        shareCircle(items) {
          if(localStorage.getItem('token')) {
            let options = {
              title: items.netitle,
              desc: items.netext,
              imgUrl: items.usheader,       // 初步考虑用用户头像
              link: location.href.split('#')[0] + '?neid=' + items.neid
            };
            this.$http.get(api.secret_usid + '?token=' + localStorage.getItem('token')).then(res => {
              if(res.data.status == 200) {
                options.link += '&secret_usid=' + res.data.data.secret_usid;
                // 点击分享
                // this.show_invite = true;
              }
            });

            // 倒计时
            const TIME_COUNT = 3;
            let count = TIME_COUNT;
            let time = setInterval(() => {
              if (count > 0 && count <= TIME_COUNT) {
                count --;
              } else {
                // this.show_invite = false;
                clearInterval(time);
              }
            }, 1000);

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
            // Toast('请登录后再试');
            if(!localStorage.getItem('token')){
              let url = location.href.split('#')[0] + '?neid=' + items.neid
              // localStorage.setItem('login_to',url);
              // this.$router.push('/login');
              this.$store.state.show_login = true;
              return false;
            }
          }
        },
        /*跳转路由*/
        changeRoute(v,params,value){
          if(v == '/circle/detail'){
            if(value == 'comments') {
              sessionStorage.setItem('showComments', 'show');
              this.$router.push({path:v,query:{neid:params.neid}});
              return false;
            }else {
              this.$router.push({path:v,query:{neid:params.neid}});
              sessionStorage.setItem('circleFrom', 'buyer');
              return false;
            }
          }
          if(params == 'shtype'){
            this.$router.push({path:v,query:{shtype:value}})
          }else{
            this.$router.push({path:v})
          }
        },
        likeClick(index){
          this.$emit('likeClick',index)
        },
        clickCollect(circle){
          this.$emit('clickCollect',this.index)
        },
        followClick(){
          this.$emit('followClick',this.index)
        }
      }
    }
</script>

<style scoped lang="less">
  @import "../../common/css/index";
  .m-circle-item{
    border-bottom: 1px solid #F2F2F2;
    padding: 30px;
    .m-circle-user-box{
      .flex-row(space-between);
      padding-bottom: 20px;
      .m-circle-user-avator{
        display: inline-block;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background-color: #F2F2F2;
      }
      .m-circle-user-name{
        font-size: 28px;
        margin: 0 10px;
        max-width:200px ;
        overflow: hidden;
        text-overflow: ellipsis;    // 溢出用省略号显示
        white-space:nowrap;
        height: 36px;
        line-height: 36px;
      }
      .m-circle-user-level{
        font-size: 16px;
        color: @mainColor;
        border: 1px solid @mainColor;
        padding: 0 10px;
      }
      .m-circle-collect{
        color: @mainColor;
        border: 1px solid @mainColor;
        padding: 0 20px;
        font-size: 24px;
        &.cancel{
          color: #c1c1c1;
          border: 1px solid #c1c1c1;
        }
      }
    }
    .m-one-circle-content{
      margin-bottom: 20px;
      width: 700px;
      position: relative;
      .m-label{
        position: absolute;
        top: -20px;
        right: 0;
        padding: 0 10px;
        font-size: 20px;
        height: 40px;
        line-height: 40px;
        background-color: @mainColor;
        color: #fff;
        z-index: 1000;
      }
    }
    .m-video-box{
      position: relative;
      .m-video{
        display: block;
        width: 700px;
        height: 360px;
        position: absolute;
        top:0;
        left: 0;
      }
      .m-icon-video{
        display: block;
        width: 109px;
        height: 109px;
        position: absolute;
        top: 125px;
        left: 298px;
        background: url("/static/images/icon-video.png") no-repeat;
        background-size: 100% 100%;
      }
      .m-video-time{
        position: absolute;
        bottom: 4px;
        right: 40px;
        color: #fff;
      }
    }
    .m-img-box {
      width: 700px;
      height: 360px;
      position: relative;
      background-color: #ffffff;
      .m-img {
        width: 700px;
        height: 360px;
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        margin: auto;
      }
    }
    .m-circle-img-box{
      margin-bottom: 20px;
      display: flex;
      flex-flow: row;
      justify-content: flex-start;
      flex-wrap: wrap;
      .m-circle-img{
        display: block;
        width: 700px;
        height: 384px;
        margin: 0 10px 10px 0;
        background-color: #F2F2F2;
      }
    }
    .m-circle-text{
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      overflow: hidden;
      text-align: left;
      /*margin-bottom: 20px;*/
      .m-circle-topic{
        color: #006FCE;
      }
    }
    .m-circle-loc{
      color: #C1C1C1;
      font-size: 24px;
      text-align: left;
      margin-bottom: 20px;
      .m-icon-loc{
        display: inline-block;
        width: 30px;
        height: 30px;
        margin-right: 10px;
      }
    }
    .m-circle-icon-box{
      .m-icon{
        display: inline-block;
        width: 40px;
        height: 40px;
      }
      .m-circle-icon-one{
        display: flex;
        flex-flow: row;
        align-items: flex-start;
        margin-left: 40px;
        span{
          &.active{
            color: @mainColor;
          }
        }
      }
    }
  }
</style>
