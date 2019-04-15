<template>
  <div class="m-add-product">
    <div class="m-content-radius">
      <!--选择商品类别-->
      <div class="m-product-part-title">选择商品类别</div>
      <div class="m-product-select-box">
        <select class="m-product-select" :options="options" v-model="selected">
          <option v-for="item in options">{{item.text}}</option>
        </select>
        <select class="m-product-select" :options="options" v-model="selected">
          <option v-for="item in options">{{item.text}}</option>
        </select>
        <select class="m-product-select" :options="options" v-model="selected">
          <option v-for="item in options">{{item.text}}</option>
        </select>
      </div>
      <!--选择商品品牌-->
      <div class="m-product-part-title">选择商品品牌</div>
      <div class="m-product-select-box">
        <select class="m-product-select" :options="options" v-model="selected">
          <option v-for="item in options">{{item.text}}</option>
        </select>
      </div>
      <!--选择商品使用场景-->
      <div class="m-product-part-title">选择商品使用场景</div>
      <div class="m-product-select-box m-box-bottom">
        <select class="m-product-select" :options="options" v-model="selected">
          <option v-for="item in options">{{item.text}}</option>
        </select>
        <select class="m-product-select" :options="options" v-model="selected">
          <option v-for="item in options">{{item.text}}</option>
        </select>
      </div>
    </div>
    <!--商品名称、商品描述、商品图片-->
    <div class="m-content-radius">
      <div class="m-product-part-title">商品详情</div>
      <div class="m-product-text-box">
        <div class="m-text-box-left">商品名称</div>
        <div class="m-text-box-right">
          <input type="text" class="m-row-input" placeholder="请输入商品名称">
        </div>
      </div>
      <div class="m-product-text-box">
        <div class="m-text-box-left">商品描述</div>
        <div class="m-text-box-right">
          <textarea class="m-row-textarea" rows="3" cols="20" placeholder="请输入商品描述"></textarea>
        </div>
      </div>
      <div class="m-product-text-box">
        <div class="m-text-box-left">商品主图</div>
        <div class="m-text-box-right">
          <img class="m-product-img" src="/static/images/icon-upload-img.png" alt="">
        </div>
      </div>
      <div class="m-product-text-box">
        <div class="m-text-box-left">商品轮播图</div>
        <div class="m-text-box-right">
          <div class="m-product-imgs">
            <img class="m-product-img" src="/static/images/icon-upload-img.png" alt="">
            <img class="m-product-img" src="/static/images/icon-upload-img.png" alt="">
            <img class="m-product-img" src="/static/images/icon-upload-img.png" alt="">
            <img class="m-product-img" src="/static/images/icon-upload-img.png" alt="">
            <img class="m-product-img" src="/static/images/icon-upload-img.png" alt="">
          </div>
        </div>
      </div>
      <div class="m-product-text-box">
        <div class="m-text-box-left">商品详情图</div>
        <div class="m-text-box-right">
          <div class="m-product-imgs">
            <img class="m-product-img" src="/static/images/icon-upload-img.png" alt="">
            <img class="m-product-img" src="/static/images/icon-upload-img.png" alt="">
            <img class="m-product-img" src="/static/images/icon-upload-img.png" alt="">
            <img class="m-product-img" src="/static/images/icon-upload-img.png" alt="">
            <img class="m-product-img" src="/static/images/icon-upload-img.png" alt="">
          </div>
        </div>
      </div>
    </div>
    <!--商品规格组合-->
    <div class="m-content-radius">
      <div class="m-product-sku-row">
        <div class="m-product-part-title">商品规格组合</div>
        <!--<img class="m-add-icon" src="/static/images/icon-add-sku.png" alt="">-->
      </div>
      <div class="m-product-text-box">
        <div class="m-text-box-left">商品图片</div>
        <div class="m-text-box-right">
          <img class="m-product-img" src="/static/images/icon-upload-img.png" alt="">
        </div>
      </div>
      <div class="m-product-text-box">
        <div class="m-text-box-left">商品价格</div>
        <div class="m-text-box-right">
          <input type="text" class="m-row-input m-width-160">元
        </div>
      </div>
      <div class="m-product-text-box">
        <div class="m-text-box-left">商品规格</div>
        <div class="m-text-box-right">
          <select class="m-product-select m-width-182" :options="options" v-model="selected">
            <option v-for="item in options">{{item.text}}</option>
          </select>
          <input type="text" class="m-row-input m-width-235">
          <!--<img class="m-add-icon" src="/static/images/icon-add-sku.png" alt="">-->
        </div>
      </div>
      <div class="m-product-text-box">
        <div class="m-text-box-left"></div>
        <div class="m-text-box-right">
          <select class="m-product-select m-width-182" :options="options" v-model="selected">
            <option v-for="item in options">{{item.text}}</option>
          </select>
          <input type="text" class="m-row-input m-width-235">
          <img class="m-add-icon" src="/static/images/icon-add-sku.png" alt="">
        </div>
      </div>
    </div>
    <!--商品规格组合-->
    <div class="m-content-radius">
      <div class="m-product-sku-row">
        <div class="m-product-part-title">商品规格组合</div>
        <img class="m-add-icon" src="/static/images/icon-add-sku.png" alt="">
      </div>
      <div class="m-product-text-box">
        <div class="m-text-box-left">商品图片</div>
        <div class="m-text-box-right">
          <img class="m-product-img" src="/static/images/icon-upload-img.png" alt="">
        </div>
      </div>
      <div class="m-product-text-box">
        <div class="m-text-box-left">商品价格</div>
        <div class="m-text-box-right">
          <input type="text" class="m-row-input m-width-160">元
        </div>
      </div>
      <div class="m-product-text-box">
        <div class="m-text-box-left">商品规格</div>
        <div class="m-text-box-right">
          <select class="m-product-select m-width-182" :options="options" v-model="selected">
            <option v-for="item in options">{{item.text}}</option>
          </select>
          <input type="text" class="m-row-input m-width-235">
          <!--<img class="m-add-icon" src="/static/images/icon-add-sku.png" alt="">-->
        </div>
      </div>
      <div class="m-product-text-box">
        <div class="m-text-box-left"></div>
        <div class="m-text-box-right">
          <select class="m-product-select m-width-182" :options="options" v-model="selected">
            <option v-for="item in options">{{item.text}}</option>
          </select>
          <input type="text" class="m-row-input m-width-235">
          <img class="m-add-icon" src="/static/images/icon-add-sku.png" alt="">
        </div>
      </div>
    </div>

    <!--商品活动-->
    <div class="m-content-radius">
      <div class="m-product-part-title">商品活动</div>
      <div class="m-product-text-box">
        <div class="m-text-box-left">参与活动</div>
        <div class="m-text-box-right">
          <select class="m-product-select m-width-500" :options="options" v-model="selected">
            <option v-for="item in options">{{item.text}}</option>
          </select>
        </div>
      </div>
      <div class="m-product-text-box">
        <div class="m-text-box-left">活动时间</div>
        <div class="m-text-box-right">
          <select class="m-product-select m-width-218" :options="options" v-model="selected">
            <option v-for="item in options">{{item.text}}</option>
          </select>
          <div style="margin-right: 13px">至</div>
          <select class="m-product-select m-width-218" :options="options" v-model="selected">
            <option v-for="item in options">{{item.text}}</option>
          </select>
        </div>
      </div>
    </div>
    <!--发货按钮-->
    <div class="m-submit-btn" @click="submitProduct">发 布</div>
  </div>
</template>

<script>
  import common from '../../../common/js/common';

  export default {
    name: "addProduct",
    data() {
      return {
        selected: "",
        options: [
          { id: 1, text: '登山徒步' }, { id: 2, text: '户外上装' }, { id: 3, text: '软壳衣' }, { id: 4, text: '北山' }
        ]
      }
    },
    components: {},
    methods: {
      // 发布商品按钮
      submitProduct() {

      }
    },
    mounted() {
      common.changeTitle('添加商品');
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  @import "../../../common/css/personal";

  .m-add-product {
    min-height: 100vh;
    background-color: #EEEEEE;
    padding: 20px;
    .m-content-radius {
      font-size: 24px;
      padding: 30px;
      border-radius: 10px;
      background-color: #ffffff;
      text-align: left;
      margin-bottom: 20px;
      box-shadow: 0 5px 5px rgba(0, 0, 0, 0.16);
      .m-product-sku-row {
        display: flex;
        justify-content: space-between;
      }
      .m-product-part-title {
        font-weight: bold;
        line-height: 40px;
      }
      .m-add-icon {
        width: 40px;
        height: 40px;
        margin-left: 15px;
      }
      .m-product-select-box {
        display: flex;
        padding: 20px 0 30px 0;
      }
      .m-box-bottom {
        margin-bottom: -30px;
      }
      .m-product-select {
        width: 200px;
        height: 45px;
        border-radius: 10px;
        padding: 0 0 0 15px;
        margin-right: 20px;
      }
      .m-product-text-box {
        display: flex;
        margin-top: 20px;
        .m-text-box-left {
          width: 120px;
          line-height: 48px;
          margin-right: 15px;
        }
        .m-text-box-right {
          display: flex;
          align-items: center;
          .m-row-input {
            width: 480px;
            height: 40px;
            border: 1px #999999 solid;
            border-radius: 10px;
            font-size: 24px;
            padding: 0 0 0 20px;
          }
          .m-width-160 {
            width: 160px;
            margin-right: 14px;
          }
          .m-width-182 {
            width: 182px;
          }
          .m-width-218 {
            width: 218px;
          }
          .m-width-235 {
            width: 235px;
          }
          .m-width-500 {
            width: 500px;
          }
          .m-row-textarea {
            width: 480px;
            height: 110px;
            border: 1px #999999 solid;
            border-radius: 10px;
            padding: 3px 0 0 20px;
            font-size: 24px;
          }
          .m-product-main-img {
            width: 180px;
            height: 180px;
          }
          .m-product-imgs {
            width: 500px;
          }
          .m-product-img {
            width: 160px;
            height: 160px;
          }
        }
      }
    }
    .m-submit-btn {
      width: 710px;
      height: 100px;
      margin: 100px 0 0 0;
      line-height: 100px;
      background-color: @mainColor;
      font-size: 38px;
      font-weight: bold;
      border-radius: 10px;
      box-shadow: 0 5px 6px rgba(0,0,0,0.16);
    }
  }
</style>
