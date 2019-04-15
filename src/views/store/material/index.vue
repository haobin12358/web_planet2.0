<template>
  <div class="m-material">
    <!--搜索-->
    <div class="m-selected-search">
      <span class="m-icon-home"></span>
      <div class="m-search-input-box" @click="changeRoute('/search')">
        <span class="m-icon-search"></span>
        <span>搜索品牌/商品</span>
      </div>
      <span class="m-icon-upload"></span>
    </div>
    <!--轮播图-->
    <div class="m-swipe">
      <mt-swipe :auto="3000">
        <mt-swipe-item>
          <img src="" class="img" alt="">
        </mt-swipe-item>
        <mt-swipe-item>
          <img src="" class="img" alt="">
        </mt-swipe-item>
        <mt-swipe-item>
          <img src="" class="img" alt="">
        </mt-swipe-item>
      </mt-swipe>
    </div>
    <!--nav滑动选项-->
    <div class="m-nav">
      <navList :navlist="navList" :isScroll="true" @navClick="navClick"></navList>
    </div>
    <!--内容-->
    <div class="m-material-content">
      <div class="m-material-part">
        <div class="m-part-left">
          <img class="m-left-img" src="http://dummyimage.com/90x90" alt="">
        </div>
        <div class="m-part-right">
          <div class="m-user-name">大虾</div>
          <div class="m-material-description">商品描述活动描述商品描述活动描述商品描述活动描述商品描述活动描述商品描述活动描述商品描述活动描述</div>
          <div class="m-img-box">
            <img class="m-material-img" src="http://dummyimage.com/200x200" alt="">
            <img class="m-material-img" src="http://dummyimage.com/200x200" alt="">
            <img class="m-material-img" src="http://dummyimage.com/200x200" alt="">
            <img class="m-material-img" src="http://dummyimage.com/200x200" alt="">
          </div>
          <div class="m-release-time">今日发布</div>
          <div class="m-material-share">
            <img class="m-share-img" src="/static/images/icon-gray-share.png" alt="">
            <div class="m-share-text">分享</div>
          </div>
        </div>
      </div>
      <div class="m-material-part">
        <div class="m-part-left">
          <img class="m-left-img" src="http://dummyimage.com/90x90" alt="">
        </div>
        <div class="m-part-right">
          <div class="m-user-name">大虾</div>
          <div class="m-material-description">商品描述活动描述商品描述活动描述商品描述活动描述商品描述活动描述商品描述活动描述商品描述活动描述</div>
          <div class="m-img-box">
            <img class="m-material-img" src="http://dummyimage.com/200x200" alt="">
            <img class="m-material-img" src="http://dummyimage.com/200x200" alt="">
            <img class="m-material-img" src="http://dummyimage.com/200x200" alt="">
            <img class="m-material-img" src="http://dummyimage.com/200x200" alt="">
          </div>
          <div class="m-release-time">今日发布</div>
          <div class="m-material-share">
            <img class="m-share-img" src="/static/images/icon-gray-share.png" alt="">
            <div class="m-share-text">分享</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import navList from '../../../components/common/navlist';
  import common from '../../../common/js/common';

  export default {
    data() {
      return {
        name: '',
        navList: [
          { name: "全 部", active: true }, { name: "专题活动", active: false }, { name: "大牌推荐", active: false },
          { name: "新 品", active: false }, { name: "动 态", active: false }
        ]
      }
    },
    components: { navList },
    methods: {
      // 跳转其他页面的方法
      changeRoute(v){
        this.$router.push(v)
      },
      // 滚动navList的点击事件
      navClick(index){
        let arr = [].concat(this.navList);
        for(let i = 0; i < arr.length; i ++){
          arr[i].active = false;
        }
        arr[index].active = true;
        this.navList = [].concat(arr);
      }
    },
    mounted() {
      common.changeTitle('素材');
    }
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>
  @import "../../../common/css/index";

  .m-material {
    min-height: 100%;
    .m-search-input-box {
      width: 555px !important;
    }
    .m-swipe{
      padding: 0 33px;
      /*margin: auto;*/
    }
    .m-nav{
      width: 690px;
      /*overflow-x: auto;*/
      /*overflow-y: hidden;*/
      margin: 30px 0 45px 30px;
    }
    .m-material-content {
      padding: 0 33px;
      .m-material-part {
        display: flex;
        .m-part-left {
          .m-left-img {
            width: 90px;
            height: 90px;
            border-radius: 10px;
          }
        }
        .m-part-right {
          text-align: left;
          margin: 0 0 45px 30px;
          border-bottom: 1px #cccccc solid;
          .m-user-name {
            font-size: 28px;
            font-weight: bold;
          }
          .m-material-description {
            font-size: 24px;
            padding: 10px 0;
          }
          .m-img-box {
            .m-material-img {
              width: 200px;
              height: 200px;
              margin: 0 10px 10px 0;
            }
          }
          .m-release-time {
            color: #999999;
            font-size: 25px;
          }
          .m-material-share {
            display: flex;
            margin-bottom: 45px;
            justify-content: flex-end;
            .m-share-img {
              width: 25px;
              height: 30px;
            }
            .m-share-text {
              color: #999999;
              font-size: 25px;
              margin: -2px 0 0 10px;
            }
          }
        }
      }
    }
  }

</style>
