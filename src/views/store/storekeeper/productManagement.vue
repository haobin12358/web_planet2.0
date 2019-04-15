<template>
  <div class="m-product-management">
    <!--搜索-->
    <div class="m-selected-search">
      <div class="m-search-input-box" @click="changeRoute('/search')">
        <span class="m-icon-search"></span>
        <span>搜索商品/活动关键词</span>
      </div>
      <span class="m-icon-add" @click="changeRoute('/storekeeper/addProduct')"></span>
    </div>
    <!--nav滑动选项-->
    <div class="m-nav">
      <navList :navlist="navList" :isScroll="false" @navClick="navClick"></navList>
    </div>
    <!--商品内容-->
    <div class="m-product-box">
      <div class="m-product-part" @click="changeRoute('/member/productDetail')">
        <div class="m-part-left">
          <img class="m-product-img" src="http://dummyimage.com/200x200" alt="">
        </div>
        <div class="m-part-right">
          <div class="m-right-row">
            <div class="m-product-name">哑铃</div>
            <div class="m-product-btn-box">
              <div class="m-product-btn">编辑</div>
              <div class="m-product-btn">删除</div>
            </div>
          </div>
          <div class="m-product-description">商品描述活动描述商品描述活动描述商品描述活动描述商品描述活动描述商品</div>
          <div class="m-price-share">
            <div class="m-product-price"><span class="m-price-time">￥850.00</span></div>
            <div class="m-share-text">利润￥150.00</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import common from '../../../common/js/common';
  import navList from '../../../components/common/navlist';

  export default {
    name: "productManagement",
    data() {
      return {
        name: '',
        navList: [
          { name: "最新发布", active: true }, { name: "最热商品", active: false }, { name: "全部商品", active: false }
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
      navClick(index) {
        let arr = [].concat(this.navList);
        for(let i = 0; i < arr.length; i ++){
          arr[i].active = false;
        }
        arr[index].active = true;
        this.navList = [].concat(arr);
      }
    },
    mounted() {
      common.changeTitle('商品管理');
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  @import "../../../common/css/index";

  .m-product-management {
    min-height: 100%;
    .m-nav{
      width: 590px;
      margin: 0 0 40px 80px;
    }
    .m-product-box {
      padding: 0 45px;
    }
  }
</style>
