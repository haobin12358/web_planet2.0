<template>
  <div class="m-addComment">
    <div v-for="(item, No) in productList">
      <div class="m-addComment-top">
        <div>
          <img class="m-product-img" v-if="item.prmainpic" :src="item.prmainpic">
          <span class="m-label">评分</span>
          <span class="m-start" :class="star.active ? 'active' : ''" v-for="(star, index) in item.starList" @click="starClick(index, No)"></span>
        </div>
        <span>{{item.scoreText}}</span>
      </div>
      <div class="m-addComment-content">
        <div class="m-addComment-content-edit">
          <!--<p>填写商品评价</p>-->
          <textarea v-model="item.oetext" placeholder="填写商品评价"></textarea>
          <div class="m-addComment-img-box">
            <!--添加视频和图片的区域-->
            <div class="m-upload-box" @click="setNo(No)">
              <div>
                <div class="m-selectBack-img-box">
                  <!--<template v-for="(img, index) in item.img_box">
                    <img :src="img" alt="">
                  </template>-->
                  <div class="img-box" v-for="(img,index) in item.img_box">
                    <img class="circle-img" :src="img" alt="" @click="previewImage(index, item.image)">
                    <img class="del-img" src="/static/images/icon-close.png" alt="" @click="deleteImg(No, index)">
                  </div>
                  <div class="m-selectBack-camera" v-if="item.img_box.length < 5">
                    <input type="file" name="file" class="m-upload-input" value="" accept="image/*" multiple="" @change="uploadImg" ref="commentsImg">
                  </div>
                </div>
                <div class="m-selectBack-img-box">
                  <div class="img-box" v-for="(video,index) in item.video_box">
                    <img class="circle-img" :src="video" alt="">
                    <img class="del-img" src="/static/images/icon-close.png" alt="" @click="deleteVideo(No, index)">
                  </div>
                  <div class="m-selectBack-video" v-if="item.video_box.length < 1">
                    <input type="file" name="file" class="m-upload-input" value="" accept="video/*" multiple="" @change="uploadVideo">
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
    <div class="m-foot-btn">
      <span @click="createEvaluation">发 布</span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import common from '../../../common/js/common'
  import axios from 'axios'
  import api from '../../../api/api'
  import { Toast } from 'mint-ui'
  import wxapi from '../../../common/js/mixins'

  export default {
    data() {
      return {
        name: '',
        order_info: null,
        productList: [],
        No: ''
      }
    },
    mixins: [wxapi],
    beforeDestroy() {
      localStorage.removeItem('productComment');
    },
    methods: {
      // 预览图片
      previewImage(index, image) {
        let images = [];
        for(let i = 0; i < image.length; i ++) {
          images.push(location.origin + image[i].oeimg);
        }
        let options = {
          current: location.origin + image[index].oeimg,   // 当前显示图片的http链接
          urls: images,                  // 当前预览图片的list
        };
        wxapi.previewImage(options);
      },
      // 将订单中的商品展开
      getProduct() {
        this.order_info = JSON.parse(localStorage.getItem('productComment'));
        // this.order_info = JSON.parse(this.$route.query.product);
        this.productList = [];
        for(let i = 0; i < this.order_info.order_part.length; i ++) {
          if(!this.order_info.order_part[i].opisinora) {
            let product = {
              opid: this.order_info.order_part[i].opid,
              prmainpic: this.order_info.order_part[i].prmainpic,
              img_box: [], video_box: [], image: [], video: {},
              starList: [{ active: false }, { active: false }, { active: false }, { active: false }, { active: false }]
            };
            this.productList.push(product);
          }
        }
      },
      // 记录点击的是哪个商品的图片、视频
      setNo(No) {
        this.No = No;
      },
      // 点击星星评分
      starClick(index, No) {
        // 星星active
        for(let i = 0; i < this.productList[No].starList.length; i ++) {
          this.productList[No].starList[i].active = false;
          if(i <= index) {
            this.productList[No].starList[i].active = true;
          }
        }
        this.productList[No].oescore = index + 1;    // 分数
        if(index == 0) {  // 提示的文字
          this.productList[No].scoreText = '非常差';
        }else if(index == 1) {
          this.productList[No].scoreText = '差';
        }else if(index == 2) {
          this.productList[No].scoreText = '一般';
        }else if(index == 3) {
          this.productList[No].scoreText = '好';
        }else if(index == 4) {
          this.productList[No].scoreText = '非常好';
        }
      },
      //上传图片
      uploadImg(e) {
        if(this.productList[this.No].img_box && this.productList[this.No].img_box.length == 5) {
          Toast('最多只可上传5张图片');
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
        axios.post(api.upload_file + '?type=product&token=' + localStorage.getItem('token'), form).then(res => {
          if(res.data.status == 200){
            let img = { oeimg: res.data.data, oeisort: this.productList[this.No].img_box.length + 1 };
            this.productList[this.No].image.push(img);
            reader.readAsDataURL(files[0]);
            reader.onload = function(e) {
              that.productList[that.No].img_box.push(this.result);
            };
            for(let i = 0; i < this.$refs.commentsImg.length; i ++) {
              this.$refs.commentsImg[i].value = '';
            }
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
        axios.post(api.upload_file + '?type=video&token=' + localStorage.getItem('token'), form).then(res => {
          if(res.data.status == 200){
            this.productList[this.No].video.oevideo = res.data.data;
            this.productList[this.No].video.oevthumbnail = res.data.video_thum;
            reader.readAsDataURL(files[0]);
            reader.onload = function(e) {
              that.productList[that.No].video_box.push(window.location.origin + res.data.video_thum);
            };
          }
        })
      },
      // 删除图片
      deleteImg(No, index) {
        this.productList[No].image.splice(index, 1);
        this.productList[No].img_box.splice(index, 1);
      },
      // 删除视频
      deleteVideo(No, index) {
        this.productList[No].video = {};
        this.productList[No].video_box = [];
      },
      // 发布评论
      createEvaluation() {
        for(let i = 0; i < this.productList.length; i ++) {
          if(this.productList[i].oescore == undefined) {
            if(this.productList.length > 1) {
              Toast('请对第 ' + (i + 1) + ' 件商品进行评分');
            }else {
              Toast('请对商品进行评分');
            }
            return false;
          }
        }
        let params = { omid: this.order_info.omid };
        params.evaluation = [];
        for(let i = 0; i < this.productList.length; i ++) {
          let comments = {
            opid: this.productList[i].opid,
            oetext: this.productList[i].oetext,
            oescore: this.productList[i].oescore,
            image: this.productList[i].image,
            video: this.productList[i].video,
          };
          params.evaluation.push(comments);
        }
        // console.log(params);
        axios.post(api.create_evaluation + '?token='+ localStorage.getItem('token'), params).then(res => {
          if(res.data.status == 200) {
            Toast(res.data.message);
            this.$router.go(-1);
            localStorage.removeItem('productComment');
          }
        });
      }
    },
    mounted(){
      common.changeTitle('发表评价');
      this.getProduct();        // 将订单中的商品展开
    },
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>
@import "../../../common/css/index";
  .m-addComment{
    width: 100%;
    overflow-x: hidden;
    min-height: 1334px;
    background-color: #eee;
    .m-addComment-top{
     .flex-row(space-between);
      padding: 15px 36px;
      background-color: #fff;
      .m-product-img{
        display: inline-block;
        width: 84px;
        height: 84px;
        background-color: #9fd0bf;
        vertical-align: middle;
      }
      .m-label{
        display: inline-block;
        padding: 0 53px 0 36px;
        vertical-align: middle;
      }
      .m-start{
        width: 35px;
        height: 35px;
        vertical-align: middle;
      }
    }
    .m-addComment-content{
      padding: 25px 0;
      .m-addComment-content-edit{
        width: 670px;
        padding: 20px 41px;
        background-color: #fff;
        box-shadow:0 5px 6px rgba(0,0,0,0.16);
        text-align: left;
        color: #999;
        textarea{
          width: 610px;
          display: block;
          min-height: 100px;
          padding: 20px;
          font-size: 24px;
          margin-bottom: 20px;
        }
        .m-addComment-img-box{
          .flex-row(flex-start);
          flex-wrap: wrap;
          .m-addComment-upload{
            display: inline-block;
            width:220px;
            height:220px;
            text-align: center;
            color: #ccc;
            margin-right: 20px;
            margin-bottom: 20px;
            background: url("/static/images/icon-upload-img.png") no-repeat;
            background-size: 100% 100%;
          }
          .m-upload-box{
            display: flex;
            flex-flow: row;
            justify-content: space-between;
            align-items: flex-end;
            margin-top: 20px;
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
                  top: -17px;
                  right: -15px;
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
              img{
                display: inline-block;
                width: 186px;
                height: 186px;
                margin-bottom: 20px;
                margin-right: 15px;
              }
            }
          }
        }
      }
    }
    .m-foot-btn{
      span{
        color: #ffffff;
        display: inline-block;
        width: 700px;
        height: 106px;
        line-height: 106px;
        background-color: @mainColor;
        border-radius: 10px;
        font-weight: bold;
        font-size: 38px;
        box-shadow: 0 5px 6px rgba(0,0,0,0.16);
        margin: 93px 0 140px;
      }
    }
  }
</style>
