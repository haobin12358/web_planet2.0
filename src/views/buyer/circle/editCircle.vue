<template>
    <div class="m-editCircle">
      <div class="m-editCircle-content">
        <div class="m-select m-one" @click="circlePopup = true">
          <span>{{circle}}</span>
          <span class="m-select-more"></span>
        </div>
        <!--圈子类别-->
        <mt-popup class="m-circle-popup" v-model="circlePopup" position="bottom">
          <div class="m-popup-btn">
            <div @click="circlePopup = false">取消</div>
            <div @click="circleDone">确认</div>
          </div>
          <mt-checklist class="m-checklist" v-model="circleList" :options="options"></mt-checklist>
        </mt-popup>

        <div class="m-input m-one m-ft-24">
          <input type="text" v-model="title" placeholder="请输入标题">
        </div>
        <div class="m-textarea m-one">
          <textarea v-model="content" maxlength="10000" placeholder="请输入内容"></textarea>
          <span>{{content.length}}/10000</span>
        </div>
        <div class="m-upload-box">
          <div>
            <div class="m-selectBack-img-box">
              <div class="img-box" v-for="(item,index) in img_box">
                <img class="circle-img" :src="item" alt="" @click="previewImage(index, upload_img)">
                <img class="del-img" src="/static/images/icon-close.png" alt="" @click="deleteImg(index)">
              </div>
              <div class="m-selectBack-camera" v-if="img_box.length < 4">
                <input type="file" name="file" class="m-upload-input" value="" accept="image/*" multiple="" @change="uploadImg" ref="imgUpload">
              </div>
            </div>
            <div class="m-selectBack-img-box">
              <div class="img-box" v-for="(item,index) in video_box">
                <img class="circle-img" :src="item" alt="">
                <img class="del-img" src="/static/images/icon-close.png" alt="" @click="deleteVideo(index)">
              </div>
              <div class="m-selectBack-video" v-if="video_box.length < 1">
                <input type="file" name="file" class="m-upload-input" value="" accept="video/*" multiple="" @change="uploadVideo">
              </div>
            </div>
          </div>
        </div>
        <!--店主版选择商品或优惠券-->
        <div class="m-product-coupon" v-if="usLevel == '2'">
          <!--<div class="m-input-box" @click="getProduct">
            <div class="m-input-text">选择商品</div>
            <img class="m-input-icon" v-if="productList.length == 0" src="/static/images/icon-down-active.png">
            <img class="m-input-icon" v-else src="/static/images/icon-up.png">
          </div>-->
          <div class="m-product-search">
            <input type="text" v-model="search" @focus="getProduct('')" placeholder="商品搜索关键词(商品名/品牌名)">
          </div>
          <div class="m-scroll-box">
            <div class="m-scroll">
              <ul class="m-selected-brand-product-ul">
                <li v-for="(item, index) in productList">
                  <img class="m-cancel-icon" v-if="!item.choose" src="/static/images/icon-radio.png" @click="productCouponCancel('product', index)">
                  <img class="m-cancel-icon" v-else src="/static/images/icon-radio-active.png" @click="productCouponCancel('product', index)">
                  <img :src="item.prmainpic" class="m-selected-brand-product-img">
                  <div class="m-selected-brand-product-text">
                    <h3>【{{item.brand.pbname}}】{{item.prtitle}}</h3>
                    <p class="m-flex-between m-ft-18">
                      <span>￥{{item.prprice | money}}</span>
                      <s class="m-grey m-ft-18" v-if="item.prlineprice">￥{{item.prlineprice | money}}</s>
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div class="m-input-box" @click="getUserCoupon">
            <div class="m-input-text">选择优惠券</div>
            <img class="m-input-icon" v-if="couponList.length == 0" src="/static/images/icon-down-active.png">
            <img class="m-input-icon" v-else src="/static/images/icon-up.png">
          </div>
          <div class="m-coupon-box">
            <coupon-card :couponList="couponList" :circle="circleCoupon" @productCouponCancel="productCouponCancel"></coupon-card>
            <div class="m-no-coupon" v-if="couponList.length == 0 && getCoupon">暂无优惠券</div>
          </div>
        </div>
      </div>

      <div class="m-bottom-btn-box">
        <span @click="createNews">确认发布</span>
      </div>
    </div>
</template>

<script>
  import common from '../../../common/js/common'
  import axios from 'axios'
  import api from '../../../api/api'
  import { Toast } from 'mint-ui'
  import product from '../components/product'
  import couponCard from '../components/couponCard'
  import wxapi from '../../../common/js/mixins'

  export default {
    name: "edit-circle",
    data() {
      return {
        circlePopup: false,
        options: [],
        circle: "请选择标签",
        circleList: [],
        title: "",
        content: "",
        img_box: [],            // 上传图片集合
        upload_img: [],
        video_box: [],
        video: {},
        search: "",
        usLevel: "",
        product_list: [],       // 选中的商品
        productList: [],        // 可选择的商品
        couponList: [],         // 可选择的优惠券
        circleCoupon: true,     // 是在圈子页的优惠券
        getCoupon: false        // 是否请求过获取优惠券的接口
      }
    },
    mixins: [wxapi],
    components: { product, couponCard },
    methods: {
      // 预览图片
      previewImage(index, image) {
        let images = [];
        for(let i = 0; i < image.length; i ++) {
          images.push(location.origin + image[i].niimg);
        }
        let options = {
          current: location.origin + image[index].niimg, // 当前显示图片的http链接
          urls: images,                  // 当前预览图片的list
        };
        wxapi.previewImage(options);
      },
      // 获取圈子所在的标签
      getNav() {
        axios.get(api.items_list + "?ittype=10").then(res => {
          if(res.data.status == 200){
            let option = {};
            this.options = [];
            for(let i = 0; i < res.data.data.length; i ++) {
              option = { label: res.data.data[i].itname, value: res.data.data[i].itid };
              this.options.push(option);
            }
          }
        })
      },
      // 圈子多选标签的确定按钮
      circleDone() {
        this.circle = "";
        this.circlePopup = false;
        for(let i = 0; i < this.options.length; i ++) {
          for(let j = 0; j < this.circleList.length; j ++) {
            if(this.options[i].value == this.circleList[j]) {
              this.circle = this.circle + this.options[i].label + " ";
            }
          }
        }
      },
      // 获取当前用户是否是店主
      getUserLevel() {
        axios.get(api.get_home + "?token=" + localStorage.getItem('token')).then(res => {
          if(res.data.status == 200) {
            this.usLevel = res.data.data.uslevel;
          }
        });
      },
      // 获取发布圈子时可选择的优惠券
      getUserCoupon() {
        if(this.couponList.length > 0) {
          this.getCoupon = false;
          this.couponList = [];
        }else {
          let params = {
            token: localStorage.getItem('token'),
            // itid: 'news_bind_coupon',
            page_num : 1,
            page_size : 200
          };
          axios.get(api.coupon_list, { params: params }).then(res => {
            if(res.data.status == 200) {
              this.couponList = res.data.data;
              this.getCoupon = true;
              // 名称优化、选择优惠券
              for(let i = 0; i < this.couponList.length; i ++) {
                this.couponList[i].choose = false;
                if(this.couponList[i].title_subtitle.left_text.length > 8) {
                  this.couponList[i].title_subtitle.left_text = this.couponList[i].title_subtitle.left_text.substring(0, 8) + "..";
                }
              }
              // 优惠券显示内容精简
              for(let i in this.couponList) {
                if(this.couponList[i].cosubtration.toString().length > 4) {
                  this.couponList[i].cosubtration = 999
                }
                this.couponList[i].codiscount = this.couponList[i].codiscount.toString().slice(0, 3)
              }
            }
          });
        }
      },
      // 删除图片
      deleteImg(index) {
        this.img_box.splice(index, 1);
        this.upload_img.splice(index, 1);
      },
      // 删除视频
      deleteVideo(index) {
        this.video_box = [];
        this.video = {}
      },
      //上传图片
      uploadImg(e) {
        if(this.img_box && this.img_box.length == 4) {
          Toast('最多只可上传4张图片');
          return false;
        }
        let files = e.target.files || e.dataTransfer.files;
        if (!files.length)
          return;
        if (files[0].size/1024/1024 > 15) {
          Toast('图片不应大于15M');
          return false
        }
        let reader = new FileReader();
        let that = this;
        let form = new FormData();
        form.append("file", files[0]);
        axios.post(api.upload_file+'?type=news&token='+localStorage.getItem('token'),form).then(res => {
          if(res.data.status == 200){
            let img = { niimg: res.data.data, nisort: this.img_box.length + 1 };
            this.upload_img.push(img);
            reader.readAsDataURL(files[0]);
            reader.onload = function(e) {
              that.img_box.push(this.result);
            };
            this.$refs.imgUpload.value = "";
          }
        })
      },
      //上传视频
      uploadVideo(e) {
        let files = e.target.files || e.dataTransfer.files;
        if (!files.length)
          return;
        if (files[0].size/1024/1024 > 20) {
          Toast('视频不应大于20M');
          return false
        }
        let reader = new FileReader();
        let that = this;
        let form = new FormData();
        form.append("file", files[0]);
        axios.post(api.upload_file+'?type=video&token='+localStorage.getItem('token'),form).then(res => {
          if(res.data.status == 200){
            this.video.nvurl = res.data.data;
            this.video.nvthum = res.data.video_thum;
            this.video.nvdur = res.data.video_dur;
            reader.readAsDataURL(files[0]);
            reader.onload = function(e) {
              that.video_box.push(window.location.origin + res.data.video_thum);
            };
          }
        });
      },
      //获取商品列表
      getProduct(kw) {
        if(this.productList.length > 0) {
          this.productList = [];
        }else {
          let params = {
            // itid: 'news_bind_product',
            kw: '' || kw,
            page_num: 1,
            page_size: 200
          }
          axios.get(api.product_list, { params: params }).then(res => {
            if(res.data.status == 200) {
              this.productList = res.data.data;
              for(let i = 0; i < this.productList.length; i ++) {
                this.productList[i].choose = false;
              }
            }
          });
        }
      },
      // 取消商品或优惠券的选择
      productCouponCancel(which, index) {
        if(which == 'product') {
          this.productList[index].choose = !this.productList[index].choose;
          this.productList = this.productList.concat();
        }else if(which == 'circle') {
          this.couponList[index].choose = !this.couponList[index].choose;
          this.couponList = this.couponList.concat();
        }
      },
      // 发布圈子资讯
      createNews() {
        if(!this.circleList.length) {
          Toast("请选择标签");
          return false;
        }
        if(this.title == "") {
          Toast("请输入标题");
          return false;
        }
        if(this.content == "") {
          Toast("请输入内容");
          return false;
        }
        if(this.content.length >10000) {
          Toast("内容字数不可操作10000");
          return false;
        }
        let params = {
          items: this.circleList,
          netitle: this.title,
          netext: this.content,
          images: this.upload_img,
          video: this.video,
          source: "h5",
        };
        params.coupon = [];
        params.product = [];
        for(let i = 0; i < this.productList.length; i ++) {
          if(this.productList[i].choose) {
            params.product.push(this.productList[i].prid);
          }
        }
        for(let i = 0; i < this.couponList.length; i ++) {
          if(this.couponList[i].choose) {
            params.coupon.push(this.couponList[i].coid);
          }
        }
        axios.post(api.create_news + "?token=" + localStorage.getItem("token"), params).then(res => {
          if(res.data.status == 200){
            Toast(res.data.message);
            this.$router.go(-1);
          }
        })
      }
    },
    mounted() {
      common.changeTitle('发布圈子');
      this.getNav();                 // 获取圈子所在的标签
      this.getUserLevel();           // 获取当前用户是否是店主
    },
    watch: {
      search(val) {
        this.getProduct(val)
      }
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  @import "../../../common/css/index";
  @import "../../../common/css/scroll";

  .m-editCircle{
    color: #999;
    text-align: left;
    font-size: 21px;
    .m-editCircle-content{
      padding: 40px 50px 0 50px;
    }
    .m-one{
      border-radius: 30px;
      border: 1px solid #999;
      margin-bottom: 40px;
      padding: 11px 30px 11px 30px;
    }
    .m-select{
      /*width: 284px;*/
      display: flex;
      flex-flow: row;
      justify-content: space-between;
      align-items: center;
      .m-select-more{
        display: block;
        width: 22px;
        height: 22px;
        margin-top: -10px;
        background: url("/static/images/icon-up.png") no-repeat;
        transform: rotate(180deg);
        background-size: 100% 100%;
      }
    }
    .m-input{
      input{
        border: none;
        width: 100%;
        color: #999;
        font-size: 24px;
      }
    }
    .m-textarea{
      textarea{
        display: block;
        width: 100%;
        height: 580px;
        border: none;
        font-size: 24px;
      }
    }
    .m-upload-box{
      display: flex;
      flex-flow: row;
      justify-content: space-between;
      align-items: flex-end;
      margin-top: 58px;
    }
    .m-selectBack-img-box{
      margin-bottom: 30px;
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      .img-box {
        position: relative;
        .circle-img {
          display: inline-block;
          width: 186px;
          height: 186px;
          margin-bottom: 20px;
          margin-right: 15px;
        }
        .del-img {
          width: 40px;
          height: 40px;
          position: absolute;
          top: -20px;
          right: 0;
        }
      }
      .m-selectBack-camera{
        width: 186px;
        height: 186px;
        background: url('/static/images/icon-upload-img.png') no-repeat;
        background-size: 100% 100%;
        display: inline-block;
        margin: 0 15px 15px 0;
        position: relative;
      }
      .m-selectBack-video{
        width: 186px;
        height: 186px;
        background: url('/static/images/icon-upload-video.png') no-repeat;
        background-size: 100% 100%;
        display: inline-block;
        margin: 0 15px 15px 0;
        position: relative;
      }
      .m-upload-input{
        position: absolute;
        top: 0;
        left: 0;
        opacity: 0;
        width: 186px;
        height: 186px;
      }
    }
    .m-product-coupon {
      .m-input-box {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border: 1px #707070 solid;
        border-radius: 50px;
        width: 310px;
        padding: 10px 30px 10px 60px;
        margin-bottom: 30px;
        .m-input-text {
          color: #999999;
          font-size: 21px;
        }
        .m-input-icon {
          width: 22px;
          height: 22px;
        }
      }
      .m-product-search {
        width: 400px;
        border-radius: 30px;
        box-sizing: border-box;
        border: 2px solid #999;
        padding: 10px 30px;
        input {
          width: 340px;
        }
      }
      .m-scroll-box {
        margin: 0 30px 0 -60px;
      }
      .m-coupon-box {
        margin: 0 0 60px -50px;
        .m-no-coupon {
          margin-left: 60px;
        }
      }
    }
    .m-bottom-btn-box {
      text-align: center;
      padding: 0 0 50px 0;
      span{
        display: inline-block;
        width: 700px;
        height: 106px;
        border-radius: 10px;
        background-color: @mainColor;
        line-height: 106px;
        font-size: 38px;
        font-weight: bold;
        color: #ffffff;
      }
    }
    input::-webkit-input-placeholder{
      color: #999;
    }
    textarea::-webkit-input-placeholder{
      color: #999;
    }
  }
  .m-circle-popup {
    width: 750px;
    .m-popup-btn {
      color: #333333;
      display: flex;
      justify-content: space-between;
      font-size: 28px;
      padding: 20px 40px 0 40px;
    }
    .m-checklist {
      padding: 50px 0;
      text-align: center;
    }
  }
/*  .m-product-popup {
    width: 750px;
    .m-popup-btn {
      color: #333333;
      display: flex;
      justify-content: space-between;
      font-size: 28px;
      padding: 20px 40px 0 40px;
    }
    .m-product-box {
      height: 800px;
    }
  }*/
</style>
