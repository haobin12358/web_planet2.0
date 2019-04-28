<template>
    <div class="m-search">
      <div class="m-flex-between m-search-top">
        <div class="m-search-input-box">
          <input type="text" v-model="searchContent" maxlength="20" @input="searchInfo" @keypress="keyPress" :placeholder="placeholder">
          <span class="m-icon-close" @click="clearInput"></span>
        </div>
        <span @click="returnBack">取消</span>
        <!--<span @click="changeRoute" v-if="searchContent">搜索</span>-->
      </div>

      <div class="m-search-content" v-if="isNews">
        <div class="m-search-one" v-if="!result_list && history_list">
          <p class="m-ft-22 m-flex-between">
            <span>历史记录</span>
            <span @click="clearHistory">清除</span>
          </p>
          <ul class="m-search-result-ul" v-if="result_list">
            <li v-for="item in result_list" @click="changeRoute(item)">
              <span>{{item.ushname}}</span>
              <span class="m-icon-go"></span>
            </li>
          </ul>
        </div>
        <div class="m-search-one" v-else>
          <ul class="m-search-result-ul" v-if="result_list">
            <li v-for="item in result_list" @click="changeRoute(item)">
              <span>{{item.ushname}}</span>
              <span class="m-icon-go"></span>
            </li>
          </ul>
        </div>
      </div>
      <div class="m-search-content" v-else>
        <div class="m-search-one" v-if="!result_list.length && history_list">
          <p class="m-ft-22 m-flex-between">
            <span>历史记录</span>
            <span @click="clearHistory">清除</span>
          </p>
          <ul class="m-tab-ul">
            <li v-for="item in history_list" @click="clickHis(item)">{{item.ushname}}</li>
          </ul>
        </div>
        <div class="m-circle-content" v-else-if="isCircle">
          <div class="m-flex-between m-circle-nav">
            <nav-list :navlist="nav_list" :isScroll="true" :is-get="true" @navClick="navClick"></nav-list>
          </div>

          <div class="m-circle-body" v-if="result_list.length >0 ">

            <m-circle :index="index" v-for="(item,index) in result_list" v-if="select_nav.itid"  :key="index" :circle="item" @followClick="followClick" @likeClick="likeClick" @clickCollect="clickCollect"></m-circle>
            <!--            </template>-->
            <ul class="m-user-list" v-else-if="result_list.length > 0 " >
              <li v-for="(item,index) in result_list">
                <div class="m-flex-start">
                  <img :src="item.usheader" class="m-avator" alt="">
                  <div>
                    <h3 class="m-user-name">
                      <span >{{item.usname}}</span>
                      <span class="m-user-level">{{item.usgrade}}</span>
                    </h3>
                    <p class="m-grey">{{item.fens_count}}粉丝</p>
                  </div>
                </div>

                <img src="/static/images/newpersonal/icon-follow.png" v-if="item.follow_status == 'mutualfollowed'" class="m-user-icon" alt="" @click="cancelClick(index)">
                <img src="/static/images/newpersonal/icon-together.png" v-else-if="item.follow_status == 'followed'" class="m-user-icon" alt="" @click="cancelClick(index)">
                <span class="m-follow-btn" v-else-if="item.follow_status == 'unfollowed'" @click="followClickUser(index)">关注</span>
              </li>
            </ul>
            <bottom-line v-if="bottom_show"></bottom-line>
          </div>
           <p v-else class="m-no-data">无法搜索到相关内容</p>
        </div>
        <ul class="m-search-result-ul"  v-else="result_list">
          <li v-for="item in result_list" @click="changeRoute(item)">
            <span>{{item.ushname}}</span>
            <span class="m-icon-go"></span>
          </li>
        </ul>
        <div class="m-modal" v-if="show_modal">
          <div class="m-modal-state">
            <ul>
              <li>
                <img :src="select_user.usheader" class="m-avator" alt="">
                <p class="m-grey">您将不再关注@{{select_user.usname}} ？</p>
              </li>
              <li>
                <p class="m-active" @click.stop="followClickUser(select_index)">取消关注</p>
              </li>
            </ul>
            <p class="m-cancel" @click="show_modal = false">取消</p>
          </div>
        </div>
<!--        <div class="m-search-one" v-if="isCircle">-->
<!--          <p class="m-ft-22 m-flex-between" v-if="recommendList.length">-->
<!--            <span>推荐圈子</span>-->
<!--            &lt;!&ndash;<span class="m-icon-delete"></span>&ndash;&gt;-->
<!--          </p>-->
<!--          <ul class="m-tab-ul">-->
<!--            <li v-for="item in recommendList" @click="changeRoute(item, 'recommend')">{{item.itname}}</li>-->
<!--          </ul>-->
<!--        </div>-->




      </div>
    </div>
</template>

<script>
  import axios from 'axios';
  import api from '../../api/api'
  import {Toast} from 'mint-ui';
  import navList from '../../components/common/navlist';
  import bottomLine from '../../components/common/bottomLine';
  import mCircle from '../../components/common/circle';
    export default {
        data(){
          return{
            placeholder: '',
            searchContent: '',
            history_list: null,
            result_list: [],
            isNews: false,
            isCircle: false,
            nav_list: [
              {
                itdesc: "我是描述",
                itid: "",
                itname: "用户",
                itrecommend: true,
                itsort: null,
                ittype: 10,
                active: true,
                psid: ""
              }
            ],
            bottom_show:false,
            page_info: {
              page_num: 1,
              page_size: 10
            },
            select_nav: null,
            isScroll: true,
            total_count: 0,
            show_modal:false,
            select_index:0,
            select_user:null
          }
        },
      components:{ navList,mCircle,bottomLine},
      mounted(){
          this.historySearch();
          // 在圈子的搜索时才显示推荐圈子
          if(this.$route.query.shtype == 'news') {
            this.placeholder = '圈子搜索关键词(标题名/内容)';
            this.isCircle = true;
            this.getNav();
            this.select_nav = this.nav_list[0];
          }else {
            this.placeholder = '商品搜索关键词(商品名/品牌名)'
          }
      },
      methods:{
        // 获取圈子所在的标签
        getNav() {
          axios.get(api.items_list,{
            params:{
              ittype:10,
              token:localStorage.getItem('token')
            }
          }).then(res => {
            if(res.data.status == 200) {
              this.nav_list = this.nav_list.concat(res.data.data);
            }
          })
        },
          /*返回*/
        returnBack(){
          this.$router.go(-1)
        },
        /*获取用户搜索历史纪录*/
        historySearch(){
          axios.get(api.search_history,{
            params:{
              token:localStorage.getItem('token'),
              shtype: this.$route.query.shtype || 'product'
            }
          }).then(res => {
            if(res.data.status ==200){
              if(res.data.data.length > 0){
                this.history_list = res.data.data;
              }
            }
          })
        },
        //  圈子历史点击
        clickHis(item){
          this.searchContent = item.ushname;
          this.searchInfo();
        },
        /*搜索结果*/
        searchInfo(){
          if(this.searchContent) {
            if(this.isCircle){
              this.$http.get(this.$api.news_search,{params:{
                token:localStorage.getItem('token'),
                itid:this.select_nav.itid,
                kw:this.searchContent,
              }}).then(res => {
                if(res.data.status ==200){
                  this.result_list = [].concat(res.data.data);
                }
              })
            }else{
              axios.get(api.guess_search,{
                params:{
                  kw:this.searchContent,
                  shtype:this.$route.query.shtype || 'product'
                }
              }).then(res => {
                if(res.data.status ==200){
                  this.result_list = res.data.data;
                }
              })
            }
          }
        },
        /*切换路由*/
        changeRoute(item, where){
          this.searchContent = (item && item.ushname )|| this.searchContent;
          if(this.$route.query.shtype) {
            if(where) {
              this.$router.push({path:'/circle',query:{itid: item.itid}})
            }else {
              this.$router.push({path:'/circle',query:{kw: this.searchContent}})
            }
          }else{
            this.$router.push({path:'/searchProduct',query:{kw: this.searchContent}})
          }

        },
        /*清楚历史*/
        clearHistory(){
          axios.post(api.del_search_history+'?token='+ localStorage.getItem('token'),{
            shtype:this.$route.query.shtype || 'product'
          }).then(res => {
            if(res.data.status == 200){
              this.history_list = null;
            }
          })
        },
        /*清楚搜索内容*/
        clearInput(){
          this.searchContent = '';
        },
        /*键盘搜索*/
        keyPress(e){
          if(e.keyCode == 13){
            this.changeRoute();
          }
        },
        //  收藏
        clickCollect(index){
          this.$http.post(api.collection_collect+'?token=' +localStorage.getItem('token'),{
            uclcollection:this.result_list[index].neid,
            uclcotype:1
          }).then(res => {
            if(res.data.status == 200){
              Toast(
                {
                  message: res.data.message,
                  duration: 500
                });
              let arr = [].concat(this.result_list)
              arr[index].collected = !arr[index].collected;
              // arr.splice(index,1);
              this.result_list = [].concat(arr)
            }
          })
        },
        //  关注
        followClick(index){
          this.$http.post(api.collection_collect+'?token=' +localStorage.getItem('token'),{
            uclcollection:this.result_list[index].neid,
            uclcotype:2
          }).then(res => {
            if(res.data.status == 200){
              Toast(
                {
                  message: res.data.message,
                  duration: 500
                });
              let arr = [].concat(this.result_list);
              // arr[index].follow = !arr[index].follow;
              //
              for(let i in arr){
                if(arr[i].author.usname == this.result_list[index].author.usname){
                  arr[i].follow = !arr[i].follow;
                }
              }
              this.result_list = [].concat(arr)
            }
          })
        },
        /*导航切换*/
        navClick(index){
          localStorage.setItem('circleIndex', index);
          let arr = [].concat(this.nav_list);
          for(let i=0;i<arr.length;i++){
            arr[i].active = false;
          }
          arr[index].active = true;
          this.nav_list = [].concat(arr);
          this.select_nav = arr[index];
          this.page_info.page_num = 1;
          this.bottom_show = false;
          this.searchInfo()

        },
        /*点赞*/
        likeClick(i){
          // if(!localStorage.getItem('token')){
          //   Toast('请登录后再试');
          //   let url = location.href.split('#')[0] + '?neid=' + this.news_list[i].neid
          //   localStorage.setItem('login_to',url);
          //   this.$router.push('/login');
          //   return false;
          // }
          axios.post(api.favorite_news + '?token='+localStorage.getItem('token'),{
            neid:this.result_list[i].neid,
            tftype:1
          }).then(res => {
            if(res.data.status == 200){
              let arr = [].concat(this.result_list);
              if(arr[i].is_favorite){
                arr[i].favoritnumber = arr[i].favoritnumber-1;
              }else{
                arr[i].favoritnumber = arr[i].favoritnumber+1;
              }
              arr[i].is_favorite = !arr[i].is_favorite;
              this.result_list = [].concat(arr);
            }
          })
        },
        //滚动加载更多
        touchMove(e){
          let scrollTop = common.getScrollTop();
          let scrollHeight = common.getScrollHeight();
          let ClientHeight = common.getClientHeight();
          if (scrollTop + ClientHeight  >= scrollHeight -10) {
            if(this.isScroll){
              this.isScroll = false;
              if(this.result_list.length == this.total_count){
                this.bottom_show = true;
              }else{
                for(let i=0;i<this.nav_list.length;i++){
                  if(this.nav_list[i].active){
                    this.searchInfo(this.nav_list[i].itid);
                  }
                }
              }
            }
          }
        },
        cancelClick(index){
          if(this.result_list[index].follow_status == 'mutualfollowed' || this.result_list[index].follow_status == 'followed'){
            this.select_user = this.result_list[index];
            this.select_index = index;
            this.show_modal = true;
          }
        },
        followClickUser(index){
          this.$http.post(api.collection_collect+'?token=' +localStorage.getItem('token'),{
            uclcollection:this.result_list[index].usid,
            uclcotype:2
          }).then(res => {
            if(res.data.status == 200){
              Toast(
                {
                  message: res.data.message,
                  duration: 500
                });
              this.show_modal = false;
              this.searchInfo();
            }
          })
        }
      }
    }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  @import "../../common/css/index";
.m-search{
  color: #666666;
  .m-search-top{
    border-bottom: 1px solid @borderColor;
    padding: 20px 33px;
    .m-search-input-box{
      width: 627px;
      border-radius: 30px;
      background-color: #eee;
      height: 50px;
      position: relative;
      input{
        position: absolute;
        top: 0;
        left:0;
        width: 530px;
        height: 50px;
        line-height: 50px;
        background-color: transparent;
        border: none;
        padding-left: 40px;
        font-size: 21px;
      }
      .m-icon-close{
        position: absolute;
        right: 15px;
        top:12.5px;
        width: 25px;
        height: 25px;
        background: url("/static/images/icon-search-close.png") no-repeat;
        background-size: 100% 100%;
      }
    }
  }
  .m-search-content{
    padding: 13px 0;
    .m-search-one{
      padding: 0 33px;
    }
    .m-icon-delete{
      display: inline-block;
      width: 25px;
      height: 25px;
      background: url("/static/images/icon-search-delete.png") no-repeat;
      background-size: 100% 100%;
    }
    .m-icon-history{
      display: inline-block;
      width: 25px;
      height: 25px;
      background: url("/static/images/icon-history.png") no-repeat;
      background-size: 100% 100%;
    }
    .m-tab-ul{
      .flex-row(flex-start);
      flex-wrap: wrap;
      margin-bottom: 20px;
      /*padding: 0 33px;*/
      li{
        padding: 5px 51px;
        background-color: #E9E9E9;
        border-radius: 30px;
        margin: 20px 30px 20px 0;
      }
    }
    .m-search-result-ul{
      /*padding: 0 33px;*/
      li{
        .flex-row(space-between);
        padding: 10px;
        border-bottom: 1px solid @borderColor;
        .m-icon-go{
          display: block;
          width: 25px;
          height: 25px;
          background: url("/static/images/icon-go.png") no-repeat;
          background-size: 100% 100%;
        }
      }
    }
    .m-circle-content{
      .m-circle-nav{
        box-shadow:0 3px 6px rgba(0,0,0,0.16);
        margin-bottom: 10px;
        .m-add-nav-label{
          display: block;
          padding: 0 30px;
          border-left: 1px solid #EFEFEF;
          font-size: 30px;
          color: #C1C1C1;
        }
      }
      .m-scroll-l{
        width: 750px;
        overflow-x: auto;
        overflow-y: hidden;
        margin: 20px 0 0;
        padding: 0 28px;
        box-sizing: border-box;
        .m-circle-nav{
          width: 101%;
          overflow-y: hidden;
          text-align: left;
          display: inline;
          white-space: nowrap;
          overflow-x: scroll;
          li{
            display: inline-block;
            padding: 5px;
            height: 34px;
            line-height: 34px;
            margin-right: 62px;
            &.active{
              border-bottom: 3px solid @mainColor;
            }
          }
        }
      }
      .m-circle-body{
        margin-bottom: 20px;
        padding-bottom: 20px;
        background-color: #fff;
        .m-video-one{
          position: relative;
          /*width: 700px;*/
          /*border-radius: 10px;*/
          /*box-shadow: 0 5px 6px 0 rgba(0, 0, 0, 0.16);*/
          margin-bottom: 30px;
          background-color: #fff;
          padding-bottom: 26px;
          .m-mark-label{
            position: absolute;
            top:10px;
            right:0;
            height: 33px;
            line-height: 33px;
            padding: 0 25px;
            background-color: #E9E9E9;
            border-radius: 10px  0   0  10px;
            box-shadow: 3px 5px 6px 0 rgba(0, 0, 0, 0.16);
            font-size: 18px;
            color: #999999;
            &.active{
              color: #C70000;
            }
          }
          h3{
            font-size: 28px;
            font-weight: bold;
            text-align: left;
            padding: 10px 20px;
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
              max-width: 700px;
              max-height: 360px;
              position: absolute;
              top: 0;
              right: 0;
              bottom: 0;
              left: 0;
              margin: auto;
            }
          }
          .m-text{
            width: 630px;
            text-align: left;
            padding: 10px 22px;
            /*text-indent: 2em;*/
            overflow: hidden; // 超出的文本隐藏
            text-overflow: ellipsis;    // 溢出用省略号显示
            display: -webkit-box; // 将对象作为弹性伸缩盒子模型显示。
            -webkit-box-orient: vertical; // 从上到下垂直排列子元素（设置伸缩盒子的子元素排列方式）
            -webkit-line-clamp: 2; // 这个属性不是css的规范属性，需要组合上面两个属性，表示显示的行数。
          }

          .m-video-like{
            position: absolute;
            top: 161px;
            right:16px;
            color: #fff;
            height: 27px;
            line-height: 27px;
            .m-like-icon{
              display: inline-block;
              width: 28px;
              height: 27px;
              background: url("/static/images/icon-collect.png") no-repeat;
              background-size: 100% 100%;
              vertical-align: text-bottom;
              margin-right: 10px;
              &.active{
                background: url("/static/images/icon-collect-active.png") no-repeat;
                background-size: 100% 100%;
              }
            }
          }
          .m-video-icon-ul{
            .flex-row(space-around);
            margin: 18px 0 0;
            color: #999;
            li{
              width: 33.3%;
              text-align: center;
            }
            .m-border{
              border-left: 1px solid #999999;
              border-right: 1px solid #999999;
              &:last-child{
                border-right: none;
              }
            }
            .m-icon-like{
              display: inline-block;
              width: 24px;
              height: 24px;
              background: url("/static/images/icon-like.png") no-repeat;
              background-size: 100% 100%;
              margin-right: 10px;
              &.active{
                background: url("/static/images/icon-like-active.png") no-repeat;
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
            }
            .m-icon-transmit{
              display: inline-block;
              width: 23px;
              height: 20px;
              background: url("/static/images/icon-transmit.png") no-repeat;
              background-size: 100% 100%;
            }
            .m-icon-collect{
              display: inline-block;
              width: 23px;
              height: 20px;
              background: url("/static/images/circle/icon-collect.png") no-repeat;
              background-size: 100% 100%;
              &.active{
                background: url("/static/images/icon-circle-collect-active.png") no-repeat;
                background-size: 100% 100%;
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
          .m-refuse-reason{
            padding: 14px 0;
            border-top: 1px solid #CCCCCC;
            text-align: left;
            margin: 30px 20px 0 20px;
            color: #C70000;
            font-size: 18px;
          }
        }
      }
    }
    .m-user-list{
      .m-avator{
        display: inline-block;
        width: 80px;
        height: 80px;
        border-radius: 50%;
        margin-right: 20px;
      }
      li{
        .flex-row(space-between);
        padding: 20px 33px;
        border-bottom: 1px solid #F2F2F2;
        text-align: left;
        .m-user-name{
          font-size: 28px;
          font-weight: 600;
          .m-user-level{
            font-size: 16px;
            color: @mainColor;
            border: 1px solid @mainColor;
            padding: 2px 5px;
          }
        }
        .m-user-icon{
          display: block;
          width: 50px;
          height: 50px;
        }
        .m-follow-btn{
          display: block;
          font-size: 24px;
          color: @mainColor;
          border: 1px solid @mainColor;
          padding: 2px 20px;
        }
      }
    }
    .m-modal{
      position: fixed;
      bottom: 0;
      top: 0;
      left:0;
      right:0;
      width: 100%;
      height: 100%;
      background-color: rgba(0,0,0,0.2);
      z-index: 100;
      .m-modal-state{
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        -webkit-transition: height 0.88s;
        transition: height 0.88s;
        .m-avator{
          display: inline-block;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          margin-right: 20px;
        }
        ul{
          border-bottom: 10px solid #F4F4F4;
          li{
            padding: 13px 0;
            background-color: #fff;
            text-align: center;
            border-bottom: 1px solid #F2F2F2;
            p.m-active{
              padding: 10px 0;
              color: @mainColor;
              font-size: 28px;
              font-weight: 400;
            }
          }
        }
        .m-cancel{
          padding: 27px 0;
          background-color: #fff;
          font-size: 30px;
        }
      }
    }
  }

}
</style>
