<template>
  <div class="m-activity-management">
    <!--搜索-->
    <div class="m-selected-search">
      <div class="m-search-input-box" @click="changeRoute('/search')">
        <span class="m-icon-search"></span>
        <span>搜索商品/活动关键词</span>
      </div>
      <span class="m-icon-add"></span>
    </div>
    <!--nav滑动选项-->
    <div class="m-nav">
      <navList :navlist="navList" :isScroll="false" @navClick="navClick"></navList>
    </div>
    <!--活动内容-->
    <div class="m-activity-box">
      <div class="m-product-part">
        <div class="m-part-left">
          <img class="m-product-img" src="http://dummyimage.com/200x200" alt="">
        </div>
        <div class="m-part-right">
          <div class="m-right-row">
            <div class="m-product-name">哑铃</div>
            <div class="m-product-btn-box">
              <div class="m-product-btn">删除</div>
            </div>
          </div>
          <div class="m-product-description">活动描述活动描述活动描述...</div>
          <div class="m-price-share">
            <div class="m-product-price"><span class="m-price-time">￥850.00</span></div>
            <div class="m-share-text">利润￥150.00</div>
          </div>
          <div class="m-price-share">
            <div class="m-product-price">活动类型：新品促销</div>
          </div>
          <div class="m-price-share">
            <div class="m-product-price">距离活动结束：<span class="m-price-time">9天22小时22分43秒</span></div>
          </div>
          <!--历史活动-->
          <!--<div class="m-price-share">
            <div class="m-product-price">活动时间：18/05/20-18/06/20</div>
          </div>-->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import common from '../../../common/js/common';
  import navList from '../../../components/common/navlist';

  export default {
    name: "activityManagement",
    data() {
      return {
        name: '',
        navList: [
          { name: "活动中", active: true }, { name: "历史活动", active: false }
        ]
      }
    },
    components: { navList },
    methods: {
      // 跳转其他页面的方法
      changeRoute(v) {
        this.$router.push(v)
      },
      // navList的点击事件
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
      common.changeTitle('活动管理');
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  @import "../../../common/css/index";

  .m-activity-management {
    min-height: 100%;
    .m-nav{
      width: 510px;
      margin: 0 0 40px 120px;
    }
    .m-activity-box {
      padding: 0 45px;
      .m-part-right {
        min-width: 440px;
      }
    }
  }
</style>
