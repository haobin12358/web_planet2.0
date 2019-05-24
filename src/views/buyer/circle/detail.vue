<template>
  <div class="m-circle-detail" @touchmove="touchMove">
    <div class="m-circle-content" v-if="news_info">
<!--      <h3 class="m-circle-title">{{news_info.netitle}}</h3>-->
      <div class="m-author-box">
        <div class="m-flex-start">
          <img class="m-author-img" :src="news_info.author.usheader">
          <div class="m-author-name">{{news_info.author.usname}}</div>
          <div class="m-user-leval">{{news_info.author.usgrade}}</div>
        </div>
        <span class="m-follow" v-if="!news_info.is_own && !news_info.follow" @click.stop="followClick">关注</span>
        <span class="m-follow cancel" v-if="!news_info.is_own && news_info.follow" @click.stop="followClick">取消关注</span>
      </div>

      <div class="m-content">
        <div>
          <template v-for="(item,index) in news_info.netext">
            <div class="m-circle-text" v-if="item.type == 'text'" >
              <span class="m-circle-topic" v-if="news_info.toctitle && index == text_index">#{{news_info.toctitle}}#</span>
              <span  v-html="item.content"></span>
            </div>
            <template v-if="item.type == 'image'" v-for="(i,j) in item.content">
              <img class="m-circle-img" :src="i" @click="previewImage(i, item.content)">
            </template>
            <div class="m-video-box" v-if="item.type == 'video'" v-on:click="playVideo()">
              <!--<img :src="news_info.video.nvthumbnail" class="m-video-img" alt="">-->
              <div class="m-img-box">
                <img :src="item.content.thumbnail" class="m-img">
              </div>
              <video :src="item.content.video" id="videoPlay" v-show="false">您的浏览器不支持 video 视频播放</video>
              <span class="m-video-time">{{item.content.duration}}</span>
              <span class="m-icon-video"></span>
            </div>
          </template>
        </div>



        <div class="m-circle-icon-box m-flex-between">
          <img src="/static/images/circle/icon-share.png" class="m-icon" @click.stop="shareCircle" alt="">
          <div class="m-flex-end">
            <div class="m-circle-icon-one"  @click.stop="isLickClick(1)">
              <img src="/static/images/circle/icon-like-active.png" v-if="news_info.is_favorite == 1" class="m-icon" alt="">
              <img src="/static/images/circle/icon-like.png" v-else class="m-icon" alt="">
              <span :class="news_info.is_favorite == 1?'active':''">{{news_info.favoritnumber}}</span>
            </div>
            <div class="m-circle-icon-one"  @click="showComment">
              <img src="/static/images/circle/icon-comment.png" class="m-icon" alt="">
              <span>{{news_info.commentnumber}}</span>
            </div>
            <div class="m-circle-icon-one" @click.stop="clickCollect">
              <img src="/static/images/circle/icon-collect-active.png" v-if="news_info.collected" class="m-icon" alt="">
              <img src="/static/images/circle/icon-collect.png" v-else class="m-icon" alt="">
            </div>
          </div>
        </div>
        <div class="m-more-link" >
          <template v-if="news_info.toctitle == '别老翻我朋友圈 喜欢就跟我告白'">
            <span @click.stop="changeOut">我要参加</span>
            <img src="/static/images/circle/icon-circle-more.png" @click.stop="changeOut" class="m-icon-more" alt="">
          </template>
          <template >
            <span @click.stop="lookMore">查看更多</span>
            <img src="/static/images/circle/icon-circle-more.png" @click.stop="lookMore" class="m-icon-more" alt="">
          </template>

        </div>
      </div>
    </div>

    <div class="m-box">
      <div class="m-item" v-if="news_info.coupon">
        <div class="m-box-title">优惠领取</div>
        <coupon-card :couponList="news_info.coupon" @getCoupon="getCoupon"></coupon-card>
      </div>
      <div class="m-item" v-if="news_info.product">
        <div class="m-box-title m-margin">相关推荐</div>
        <product :list="news_info.product"></product>
      </div>

    </div>
    <img class="m-invite-course" src="/static/images/invite.png" v-if="show_invite" @click="show_invite = false">

    <div class="m-comment-modal" >
      <div class="m-modal-state">
        <div class="m-modal-content">
           <h3 class="m-no-data" v-if="!comment_count">成为第一个评论的人吧</h3>
          <div class="m-scroll" v-else ref="comment" >
            <ul class="m-comment-ul">
              <li v-for="(items,index) in comment_list">
                <img :src="items.user.usheader" class="m-user-img" alt="">
                <div class="m-comment-text">
                  <div>
                    <div class="m-user-name m-flex-between">
                      {{items.user.usname}}
                      <div cllass="m-icon-list m-like">
                        <span :class="items.is_favorite?'active':''">{{items.favorite_count}}</span>
                        <span class="m-icon-like" :class="items.is_favorite?'active':''" @click.stop="commentLike(index)"></span>

<!--                        <span class="m-icon-comment" @click.stop="commentClick(items,index)"></span>-->
<!--                        <span @click.stop="commentClick(items,index)">{{items.reply_count}}</span>-->
                      </div>
                    </div>
                    <div class="m-icon-list">
                      <span >{{items.createtime}}</span>
                    </div>
                    <p class="m-user-comment" @touchstart="gtouchstart(items,index)" @touchmove="gtouchmove()" @touchend="gtouchend(items,index)" @click.stop="commentClick(items,index)">{{items.nctext}}</p>

                  </div>
                  <div class="m-comment-content" v-if="items.reply.length > 0">
                    <p v-for="(item,i) in items.reply" @click.stop="commentClick(item,index)" @touchstart="gtouchstart(item,index,i)" @touchmove="gtouchmove()" @touchend="gtouchend(item,index,i)">
                      <span class="m-user-name m-mr">{{item.commentuser}}:</span>
                      <span class="m-comment-back" v-if="item.replieduser">回复</span>
                      <span class="m-user-name m-mr" v-if="item.replieduser">{{item.replieduser}}</span>
                      <span>{{item.nctext}}</span>
                    </p>

                  </div>
                </div>
              </li>
            </ul>
            <bottom-line v-if="bottom_show"></bottom-line>
          </div>
          <p v-if="show_comment" class="m-comment-input">
            <input type="text" v-model="comment_content" placeholder="请输入评论">
            <span class="m-input-sure" @click.stop="sureComment">确定</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import api from '../../../api/api';
  import { Toast, MessageBox } from 'mint-ui';
  import bottomLine from '../../../components/common/bottomLine';
  import couponCard from '../components/couponCard';
  import product from '../components/product';
  import wxapi from '../../../common/js/mixins';
  import wx from 'weixin-js-sdk';

  // var scroll = (function (className) {
  //   var scrollTop;
  //   return {
  //     afterOpen: function () {
  //       scrollTop = document.scrollingElement.scrollTop || document.body.scrollTop;
  //       document.body.classList.add(className);
  //       document.body.style.top = -scrollTop + 'px';
  //     },
  //     beforeClose: function () {
  //       document.body.classList.remove(className);
  //       document.scrollingElement.scrollTop = scrollTop;
  //       document.body.scrollTop = scrollTop;
  //     }
  //   };
  // })('scroll');
  export default {
    name: "detail",
    data() {
      return {
        show_modal:false,
        news_info: { author: {}, coupon: [], product: [] },
        page_info:{
          page_num:1,
          page_size:10
        },
        isScroll:true,
        total_count:0,
        comment_count:0,
        bottom_show:false,
        comment_list:null,
        comment_one :null,
        comment_content:'',
        comment_index:null,
        show_comment:false,
        show_invite:false,
        timeOutEvent:null,
        show_more:false,
        get_comment:false,
        text_index:-1
      }
    },
    mixins: [wxapi],
    components: { bottomLine, couponCard, product },
    //进入该页面时，用之前保存的滚动位置赋值
    beforeRouteEnter (to, from, next) {
      console.log(to,from)
      next()
    },
    mounted() {
      this.getNewsDetail();
      if(localStorage.getItem('token')){
        this.getComment();
      }

      // 从圈子首页点击单条的评论图标
      sessionStorage.setItem('neid', this.$route.query.neid);
      if(sessionStorage.getItem('showComments') == 'show') {
        if(localStorage.getItem('token')){
          this.changeModal('show_modal',true);
        }else{
          let url = location.href.split('#')[0] + '?neid=' + this.$route.query.neid;
          localStorage.setItem('login_to',url);
          this.$store.state.show_login = true;
        }

        sessionStorage.removeItem('showComments');
      }
      if(localStorage.getItem('secret_usid')){
        this.show_more = true;
      }
      localStorage.removeItem('share');
      localStorage.removeItem('url');
      localStorage.removeItem('login_to');
      if(!localStorage.getItem('token') && localStorage.getItem('toLogin'))
          localStorage.removeItem('toLogin');
      // wxapi.wxRegister(location.href.split('#')[0]);
      if(localStorage.getItem('token')) {
        // 倒计时
        const TIME_COUNT = 1;
        let count = TIME_COUNT;
        let time = setInterval(() => {
          if(count > 0 && count <= TIME_COUNT) {
            count --;
          }else {
            this.shareCircle(1);
            clearInterval(time);
          }
        }, 300);
      }
    },
    beforeDestroy() {
      this.changeModal('show_modal',false, 1);
      sessionStorage.removeItem('neid');

      // console.log(this.$route)
      //
      // if(this.$route.path == '/productDetail') {
      //   // sessionStorage.setItem('shop', true);
      // }else {
      //   if(sessionStorage.getItem('circleFrom') == 'buyer') {
      //     if(this.$route.name == 'productDetail') {
      //       sessionStorage.setItem('circleProduct', true)
      //     }else {
      //       this.$router.push('/circle');
      //     }
      //   }else if(sessionStorage.getItem('circleFrom') == 'store') {
      //     this.$router.push('/material/circle');
      //   }
      //   sessionStorage.removeItem('circleFrom');
      // }
    },
    methods: {
      // 删除圈子
      deleteCircle() {
        let that = this;
        MessageBox.confirm('你确定要删除这条圈子吗?').then(action => {
          if(action){
            axios.post(api.del_news + '?token='+localStorage.getItem('token'),{
              neid: [that.news_info.neid]
            }).then(res => {
              if(res.data.status == 200) {
                Toast('删除成功');
                this.$router.go(-1);
              }
            })
          }
        });
      },
      // 分享圈子 - 详情页点击
      shareCircle(val) {
        let _text = '';
        for(let i in this.news_info.netext){
          if(this.news_info.netext[i].type=='text'){
            _text = this.news_info.netext[i].content;
            break;
          }
        }

        if(localStorage.getItem('token')) {
          let options = {
            title: this.news_info.netitle,
            desc: _text,
            imgUrl: this.news_info.author.usheader,       // 初步考虑用用户头像
            link: location.href.split('#')[0] + '?neid=' + this.$route.query.neid
          };
          axios.get(api.secret_usid + '?token=' + localStorage.getItem('token')).then(res => {
            if(res.data.status == 200) {
              options.link += '&secret_usid=' + res.data.data.secret_usid;
              // if(val !== 1) {
              //   // 点击分享
              //   this.show_invite = true;
              // }
            }
          });

          // 倒计时
          const TIME_COUNT = 3;
          let count = TIME_COUNT;
          let time = setInterval(() => {
            if (count > 0 && count <= TIME_COUNT) {
              count --;
            } else {
              this.show_invite = false;
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
          Toast('请登录后再试');
        }
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
      // 播放视频
      playVideo() {
        let vdo = document.getElementById("videoPlay");
        vdo.play();
      },
      //显示评论
      showComment(){
        this.show_comment = !this.show_comment;
        if(!this.get_comment){
          this.getComment();
        }
        this.comment_one = null;
        this.comment_index = null;
      },
      /*跳转路由*/
      changeRoute(v,params,value){
        if(params == 'shtype'){
          this.$router.push({path:v,query:{shtype:value}})
        }else{
          this.$router.push({path:v})
        }
      },
      //
      changeModal(v,bool,i){
        // if(v == 'show_modal' && bool && !localStorage.getItem('token')){
        //   let url = location.href.split('#')[0] + '?neid=' + this.$route.query.neid;
        //   localStorage.setItem('login_to',url);
        //   this.$store.state.show_login = true;
        //   return false;
        // }
        this[v] = bool;
        if(bool){
          // scroll.afterOpen();
        }else{
          // scroll.beforeClose();
          this.comment_one = null;
        }
        if(v == 'show_modal' && !i ) {
          // this.getComment();
        }
        if(v == 'show_modal' && !bool && i == 0) {
          this.getNewsDetail();
        }
        this.page_info.page_num = 1;
        this.show_comment = true;
      },
      /*获取资讯详情*/
      getNewsDetail(){
        axios.get(api.get_news_content,{
          params:{
            neid:this.$route.query.neid,
            token:localStorage.getItem('token')
          }
        }).then(res => {
          if(res.data.status == 200){
            this.news_info = res.data.data;
            let text_index = -1;
            for(let i in this.news_info.netext){
              if(this.news_info.netext[i].type == 'text'){
                if(text_index == -1){
                  text_index = i;
                }
                this.news_info.netext[i].content = this.news_info.netext[i].content.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>').replace(/\s/g, '&nbsp;');
              }
            }
            this.text_index = text_index;
            if(res.data.data.commentnumber > 99) {
              this.news_info.commentnumber = "99+";
            }
          }
        })
      },
      // 点击领取优惠券
      getCoupon(index) {
        axios.post(api.coupon_fetch + '?token=' + localStorage.getItem('token'), { coid: this.news_info.coupon[index].coid }).then(res => {
          if(res.data.status == 200){
            Toast("领取成功");
            this.news_info.coupon[index].ready_collected = true;
          }
        });
      },
      /*点赞*/
      isLickClick(v) {
        if(!localStorage.getItem('token')){
          let url = location.href.split('#')[0] + '?neid=' + this.$route.query.neid;
          localStorage.setItem('login_to',url);
          Toast('请登录后再试');
          // this.$router.push('/login');
          this.$store.state.show_login = true;
          return false;
        }
        axios.post(api.favorite_news + '?token=' + localStorage.getItem('token'),
          { neid: this.$route.query.neid, tftype: v }).then(res => {
          if(res.data.status == 200){
            this.news_info.favoritnumber = res.data.data.favorite_count;
            this.news_info.is_favorite = res.data.data.is_favorite;
            this.news_info.tramplenumber = res.data.data.trample_count;
            this.news_info.is_trample = res.data.data.is_trample;
          }
        })
      },
      /*获取评论*/
      getComment(){
        if(!localStorage.getItem('token')){
          let url = location.href.split('#')[0] + '?neid=' + this.$route.query.neid;
          localStorage.setItem('login_to',url);
          // Toast('请登录后再试');
          // this.$router.push('/login');
          this.$store.state.show_login = true;
          return false;
        }
        axios.get(api.get_news_comment,{
          params:{
            neid: this.$route.query.neid,
            token:localStorage.getItem('token'),
            page_num:this.page_info.page_num,
            page_size: this.page_info.page_size
          }
        }).then(res => {
          if(res.data.status == 200){
            this.isScroll =true;
            this.get_comment = true;
            if(res.data.data.length >0){
              if(this.page_info.page_num >1){
                this.comment_list =  this.comment_list.concat(res.data.data);
              }else{
                this.comment_list = res.data.data;
              }
              this.page_info.page_num = this.page_info.page_num + 1;
              this.total_count = res.data.total_count;
              this.comment_count = res.data.comment_count;
            }else{
              this.comment_list = null;
              this.page_info.page_num = 1;
              this.total_count = 0;
              this.show_comment = true;
            }
          }
        })
      },
      /*点击评论*/
      commentClick(item,index){
        this.show_comment = !this.show_comment;
        this.comment_one = item;
        this.comment_index = index;
      },
      //点击评论确定
      sureComment() {
        if(!localStorage.getItem('token')){
          let url = location.href.split('#')[0] + '?neid=' + this.$route.query.neid;
          localStorage.setItem('login_to',url);

          // this.$router.push('/login');
          this.$store.state.show_login = true;
          return false;
        }
        if(!this.comment_content) {
          Toast({ message: '请先输入评论', duration: 1000 });
          return false;
        }
        axios.post(api.create_comment + '?token=' + localStorage.getItem('token'),{
          neid:this.$route.query.neid,
          nctext:this.comment_content,
          ncid:this.comment_one && this.comment_one.ncid
        }).then(res => {
          if(res.data.status == 200){
            Toast('评论成功');
            if(this.page_info.page_num >1){
              this.page_info.page_num = this.page_info.page_num -1
            }
            this.news_info.commentnumber += 1;
            this.getComment();
            this.comment_content = '';
            // this.comment_one.comment = false;
            // this.show_comment = !this.show_comment;      // 注释后评论成功继续显示评论框
          }
        })
      },
      //评论点赞
      commentLike(index){
        if(!localStorage.getItem('token')){
          let url = location.href.split('#')[0] + '?neid=' + this.$route.query.neid;
          localStorage.setItem('login_to',url);
          // Toast('请登录后再试');
          // this.$router.push('/login');
          this.$store.state.show_login = true;
          return false;
        }
        axios.post(api.favorite_comment + '?token='+localStorage.getItem('token'),{
          ncid:this.comment_list[index].ncid,
        }).then(res => {
          if(res.data.status == 200){
            let arr = [].concat(this.comment_list);
            if(arr[index].is_favorite){
              arr[index].favorite_count = arr[index].favorite_count-1;
            }else{
              arr[index].favorite_count = arr[index].favorite_count+1;
            }
            arr[index].is_favorite = !arr[index].is_favorite;
            this.comment_list = [].concat(arr);
          }
        })
      },
      //  收藏
      clickCollect(){
        axios.post(api.collection_collect+'?token=' +localStorage.getItem('token'),{
          uclcollection:this.$route.query.neid,
          uclcotype:1
        }).then(res => {
          if(res.data.status == 200){
            Toast(
              {
                message: res.data.message,
                duration: 500
              });
            this.news_info.collected = !this.news_info.collected;
          }
        })
      },
      //滚动加载更多
      touchMove(e){
        // let scrollTop = common.getScrollTop();
        // let scrollHeight = common.getScrollHeight();
        // let ClientHeight = common.getClientHeight();
        let scrollTop = this.$refs.comment.scrollTop;
        let scrollHeight = this.$refs.comment.scrollHeight;
        let ClientHeight = this.$refs.comment.offsetHeight;
        if (scrollTop + ClientHeight  >= scrollHeight -10) {
          if(this.isScroll){
            this.isScroll = false;
            if(this.comment_list.length == this.total_count){
              this.bottom_show = true;
            }else{
              this.getComment();
            }
          }

        }
      },
      //记录手指初始
      gtouchstart(item,index,i){
        let that = this;
        this.timeOutEvent = setTimeout(function(){
          that.longPress(item,index,i)
        },500);//这里设置定时器，定义长按500毫秒触发长按事件，时间可以自己改，个人感觉500毫秒非常合适
        return false;
      },
      //手释放，如果在500毫秒内就释放，则取消长按事件，此时可以执行onclick应该执行的事件
      gtouchend(item){
        let that = this;
        clearTimeout(that.timeOutEvent);//清除定时器
        if(that.timeOutEvent!=0){
          //这里写要执行的内容（尤如onclick事件）
          // vm.goChat(item);
        }
        return false;
      },
      //如果手指有移动，则取消所有事件，此时说明用户只是要移动而不是长按
      gtouchmove(){
        let that =this;
        clearTimeout(that.timeOutEvent);//清除定时器
        that.timeOutEvent = 0;
      },
      //真正长按后应该执行的内容
      longPress(item, index, i) {
        // 1 为自己的评论， 0 不是自己的评论
        if(item.is_own == 1) {
          this.timeOutEvent = 0;
          //执行长按要执行的内容，如弹出菜单
          let that = this;
          MessageBox.confirm('你确定要删除这条评论吗?').then(action => {
            if(action){

              axios.post(api.del_comment + '?token='+localStorage.getItem('token'),{
                ncid:item.ncid
              }).then(res => {
                if(res.data.status == 200){
                  if(i == undefined) {
                    that.comment_list.splice(index, 1);
                  }else {
                    that.comment_list[index].reply.splice(i, 1);
                  }
                  Toast({ message: res.data.message, duration: 1000 });
                }
              })
            }
          });
        }
      },
      //查看更多
      lookMore(){
        if(localStorage.getItem('token')){
          window.router.push('/circle');
        }else{
          let url = location.href.split('#')[0] + '?neid=' + this.$route.query.neid;
          localStorage.setItem('login_to',url);
          localStorage.setItem('fresh',true);
          // Toast('请登录后再试');
          // window.router.push('/login');
          this.$store.state.show_login = true;
        }
      },
      //我要参加
      changeOut(){
        location.href = 'http://mp.weixin.qq.com/s?__biz=Mzg4MTAxNzkzNg==&mid=2247484151&idx=1&sn=18301836b157e08c21259dbfed9762a8&chksm=cf6d17c8f81a9ededacc207a20962cb33565f2bf9452780cb4e976a62d3d4c3f6f8dd121e4e9&token=2012798514&lang=zh_CN#rd';
      },
      //  关注
      followClick(){
        this.$http.post(api.collection_collect+'?token=' +localStorage.getItem('token'),{
          uclcollection:this.news_info.neid,
          uclcotype:2
        }).then(res => {
          if(res.data.status == 200){
            Toast(
              {
                message: res.data.message,
                duration: 500
              });
           this.news_info.follow = !this.news_info.follow;
          }
        })
      }
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "../../../common/css/index";
.m-circle-content{
  padding: 18px 0 20px 0;
  border-bottom: 10px solid #F4F4F4;
  .m-circle-title{
    width: 640px;
    font-size: 28px;
    font-weight: bold;
    margin-left: 28px;
    text-align: left;
  }
  .m-icon-gray-share {
    position: absolute;
    top: 30px;
    right: 45px;
    display: block;
    width: 33px;
    height: 40px;
    background: url("/static/images/icon-gray-share.png") no-repeat;
    background-size: 100% 100%;
  }
  .m-author-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 25px 40px;
    font-size: 24px;
    .m-author-img {
      display: block;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      margin-right: 18px;
      border: none;
      background: url("/static/images/logo.jpg") no-repeat;
      background-size: 100% 100%;
    }
    .m-author-name {
      /*flex: 1;*/
      text-align: left;
      color: #000;
      font-size: 28px;
      max-width: 360px;
    }
    .m-user-leval{
      display: inline-block;
      padding: 0 8px;
      border: 1px solid @mainColor;
      color: @mainColor;
      font-size: 16px;
      margin-left: 10px;
    }
    .m-follow{
      display: inline-block;
      padding: 0 8px;
      border: 1px solid @mainColor;
      color: @mainColor;
      &.cancel{
        color: #c1c1c1;
        border: 1px solid #c1c1c1;
      }
    }
  }
  .m-circle-img{
    display: block;
    width: 640px;
    max-height: 100%;
    /*background-color: #9fd0bf;*/
    margin: 20px 0 20px ;
  }
  .m-content{
    padding: 46px 46px 20px 46px;
    text-align: left;
    .m-circle-topic{
      color: #006FCE;
    }
    .m-video-box{
      position: relative;
      margin: 20px 0;
      .m-img-box {
        width: 640px;
        height: 360px;
        position: relative;
        background-color: #ffffff;
        .m-img {
          width: 640px;
          max-height: 360px;
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          margin: auto;
        }
      }
      .m-video{
        display: block;
        width: 100%;
        height: 360px;
        border-radius: 10px;
        margin-bottom: 20px;
        /*border: 1px red solid;*/
      }
      .m-video-img{
        position: absolute;
        top:0;
        left: 0;
        width: 100%;
        height: 360px;
        border-radius: 10px;
      }
      .m-icon-video{
        display: block;
        width: 109px;
        height: 109px;
        position: absolute;
        top: 130px;
        left: 297px;
        background: url("/static/images/icon-video.png") no-repeat;
        background-size: 100% 100%;
      }
      .m-video-time{
        position: absolute;
        bottom: -150px;
        right: 13px;
        color: #fff;
      }
    }
    h3{
      font-size: 28px;
      font-weight: bold;
      margin-bottom: 20px;
    }
    p{
      text-align:justify;
      margin-bottom: 20px;
      color: #666666;
      width: 650px;
      /*text-indent: 2em;*/
      word-wrap: break-word;
      font-size: 28px;
    }

  }
  .m-more-link{
    padding-top: 30px ;
    font-size: 24px;
    color: @mainColor;
    .flex-row(flex-end);
    .m-icon-more{
      display: inline-block;
      width: 12px;
      height: 21px;
      margin-left: 10px;
    }
  }
}
.m-comment-modal{
  /*position: fixed;*/
  /*top: 0;*/
  /*left: 0;*/
  /*height: 100vh;*/
  /*width: 100%;*/
  /*background-color: rgba(0,0,0,0.2);*/
  /*z-index: 101;*/
  /*transition: opacity .5s;*/
  padding-bottom: 100px;
  .m-modal-state{
    background-color: #fff;
    /*position: absolute;*/
    /*width: 100%;*/
    /*height: 80%;*/
    /*right:0;*/
    /*bottom:0;*/
    /*margin: auto;*/

    .m-modal-content{
      padding: 28px 30px;
      h3{
        font-size: 28px;
      }
      .m-scroll{
        width: 750px;
        /*height: 880px;*/
        /*overflow-y: auto;*/
        .m-comment-ul{
          li{
            display: flex;
            flex-flow: row;
            justify-content: flex-start;
            align-items: flex-start;
            width: 750px;
            box-sizing: border-box;
            padding: 40px 0 60px 0;
            .m-user-img{
              display: block;
              width: 96px;
              height: 96px;
              border-radius: 50%;
              margin-right: 20px;
              background: url("/static/images/logo.jpg") no-repeat;
              background-size: 100% 100%;
            }
            .m-user-name{
              font-weight: bold;
              text-align: left;
              &.m-mr{
                margin-right: 8px;
                color: #006FCE;
              }
            }
            .m-user-comment {
              margin-top: 8px;
            }
            .m-comment-text{
              width: 560px;
              text-align: left;
              span{
                &.active{
                  color: @mainColor;
                }
              }
              .m-like{
                display: flex;
                flex-flow: row;
                align-items: flex-start;
              }
              .m-icon-like{
                display: inline-block;
                width: 30px;
                height: 30px;
                background: url("/static/images/circle/icon-like.png") no-repeat;
                background-size: 100% 100%;
                &.active{
                  background: url("/static/images/circle/icon-like-active.png") no-repeat;
                  background-size: 100% 100%;
                }
              }
              .m-icon-comment{
                display: inline-block;
                width: 27px;
                height: 21px;
                background: url("/static/images/icon-comment.png") no-repeat;
                background-size: 100% 100%;
                margin-right: 10px;
                margin-left: 34px;
              }
            }
            .m-icon-list{
              color: #999;
              margin: 0 0 15px;
            }
            .m-comment-content{
              margin: 8px 0;
              background-color: #EBEBEB;
              padding: 10px 17px;
            }
            .m-comment-back{
              display: inline-block;
              color: #999;
              margin-right: 8px;
            }
          }
        }
      }
      .m-comment-input{
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        border-top: 1px solid #ccc;
        height: 100px;
        background-color: #fff;
        z-index: 100;
        input{
          height: 60px;
          line-height: 60px;
          width: 80%;
          font-size: 24px;
        }
        .m-input-sure{
          padding: 0 10px ;
          line-height: 100px;
          color: @mainColor;
          margin-left: 10px;
          font-size: 24px;
        }
        input::-webkit-input-placeholder {
          color: #aab2bd;
          font-size: 24px;
        }
      }
    }
  }
}
.m-circle-icon-box{
  margin-top:20px;
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
.m-invite-course {
  position: fixed;
  top:0;
  left:0;
  width: 100%;
  height: 100%;
  z-index: 10;
}
  .m-box {
    margin: 20px   0 120px 0;
    .m-item {
      text-align: left;
      .m-box-title {
        font-size: 28px;
        font-weight: bold;
        margin: 0 0 15px 46px;
        &.m-margin {
          margin: 20px 0 -10px 46px;
        }
      }
    }

  }
</style>
