<template>
    <div class="m-evaluate">
      <div class="m-evaluate-content" v-if="evaluate_list" @touchmove="touchMove">
        <mt-loadmore :top-method="loadTop">
          <template v-for="(item,index) in evaluate_list">
            <div class="m-evaluate-one">
              <img :src="item.user.usheader" class="m-evaluate-portrait" alt="">
              <div class="m-evaluate-one-content">
                <h3>{{item.user.usname}}</h3>
                <div class="m-evaluate-start">
                  <div>
                    <span class="m-label">评价</span>
                    <span class="m-icon-start" v-for="(a, b) in star" :class="b < item.oescore ? 'active' : ''"></span>
                  </div>
                  <span>{{item.zh_oescore}}</span>
                </div>
                <p class="m-evaluate-text">
                  <span class="m-label">评价详情</span>
                  <span>
                 {{item.oetext}}
               </span>
                </p>
                <ul class="m-evaluate-img-ul">
                  <li>
                    <div class="m-video-box" v-if="item.video.length > 0" v-on:click="playVideo(index)">
                      <img v-if="item.video[0].oevthumbnail" :src="item.video[0].oevthumbnail" class="m-video-img" alt="">
                      <video v-if="item.video[0].oevideo" :src="item.video[0].oevideo" :id="index" v-show="false">您的浏览器不支持 video 视频播放</video>
                      <span class="m-video-time" v-if="item.video[0].oeduration">{{item.video[0].oeduration}}</span>
                      <span class="m-icon-video"></span>
                    </div>
                  </li>
                  <li v-for="(k,j) in item.image">
                    <img :src="k.oeimg" @click="previewImage(j, item.image)">
                  </li>
                </ul>
                <p class="m-product-label">
                  <span v-for="(key,i) in item.skuattritedetail">{{key}} </span>
                </p>
              </div>
            </div>
          </template>
          <bottom-line v-if="bottom_show"></bottom-line>
        </mt-loadmore>
      </div>
      <div class="m-no-comments" v-else>
        暂无评价
      </div>
    </div>
</template>

<script>
  import axios from 'axios';
  import api from '../../../api/api';
  import {Toast} from 'mint-ui'
  import common from '../../../common/js/common';
  import bottomLine from '../../../components/common/bottomLine';
  import wxapi from '../../../common/js/mixins';

    export default {
      data(){
        return{
          page_info: {
            page_num: 1,
            page_size: 10
          },
          bottom_show: false,
          isScroll: true,
          total_count: 0,
          evaluate_list: [],
          star: ['','','','','']
        }
      },
      mixins: [wxapi],
      inject: ['reload'],
      components: { bottomLine },
      beforeRouteEnter (to, from, next){
        console.log(from)
        next(vm => {
          // 通过 `vm` 访问组件实例,将值传入oldUrl
          vm.oldUrl = from.path
        })
      },
      mounted() {
          this.getEvaluation();        // 获取评价
      },
      methods:{
        // 预览图片
        previewImage(index, image) {
          let images = [];
          for(let i = 0; i < image.length; i ++) {
            images.push(image[i].oeimg);
          }
          let options = {
            current: image[index].oeimg,   // 当前显示图片的http链接
            urls: images,                  // 当前预览图片的list
          };
          wxapi.previewImage(options);
        },
        changeRoute(){
          this.$router.go(-1);
        },
        // 获取评价
        getEvaluation() {
          axios.get(api.get_evaluation,{
            params:{
              prid:this.$route.query.prid,
              page_num:this.page_info.page_num,
              page_size:this.page_info.page_size
            }
          }).then(res => {
            if(res.data.status == 200){
              // this.evaluate_list = res.data.data;
              this.isScroll =true;
              if(res.data.data.length > 0) {
                if(this.page_info.page_num > 1) {
                  this.evaluate_list =  this.evaluate_list.concat(res.data.data);
                }else{
                  this.evaluate_list = res.data.data;
                }
                this.page_info.page_num = this.page_info.page_num + 1;
                this.total_count = res.data.total_count;
              }else{
                this.evaluate_list = null;
                this.page_info.page_num = 1;
                this.total_count = 0;
              }
            }
          })
        },
        // 播放视频
        playVideo(index) {
          let vdo = document.getElementById(index);
          vdo.play();
        },
        //滚动加载更多
        touchMove(e) {
          let scrollTop = common.getScrollTop();
          let scrollHeight = common.getScrollHeight();
          let ClientHeight = common.getClientHeight();
          if (scrollTop + ClientHeight  >= scrollHeight -10) {
            if(this.isScroll) {
              this.isScroll = false;
              if(this.evaluate_list.length == this.total_count) {
                this.bottom_show = true;
              }else{
                this.getEvaluation();        // 获取评价
              }
            }
          }
        },
        // 下拉刷新
        loadTop() {
          this.reload();
        }
      }
    }
</script>

<style lang="less" rel="stylesheet/less" scoped>
.m-evaluate{
  .m-product-title{
    position: relative;
    font-size: 32px;
    font-weight: bold;
    background-color: #fff;
    .m-icon-back{
      position: absolute;
      top: 0;
      left: 68px;
      width: 24px;
      height: 41px;
      background: url("/static/images/icon-back.png") no-repeat;
      background-size: 100% 100%;
    }
  }
  .m-evaluate-content{
    min-height: 100vh;
    background-color: #EEEEEE;
    padding-bottom: 20px;
  }
  .m-no-comments {
    font-size: 30px;
    padding: 80px 0;
  }
  .m-evaluate-one{
    background-color: #fff;
    box-shadow:0 5px 6px rgba(0,0,0,0.16);
    padding: 16px 20px 30px 30px;
    text-align: left;
    margin-bottom: 20px;
    .m-evaluate-portrait{
      display: inline-block;
      width: 90px;
      height: 90px;
      background-color: #9fd0bf;
      margin-right: 30px;
      vertical-align: top;
    }
    .m-evaluate-one-content{
      display: inline-block;
      color: #8A8A8A;
      width: 570px;
      h3{
        font-size: 24px;
        font-weight: normal;
        margin: 0;
      }
      .m-evaluate-start{
        padding: 10px 0;
        display: flex;
        flex-flow: row;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #C7C7C7;
        .m-label{
          display: inline-block;
          margin-right: 24px;
        }
        .m-icon-start{
          display: inline-block;
          width: 35px;
          height: 35px;
          background: url("/static/images/icon-evaluate-star.png") no-repeat;
          background-size: 100% 100%;
          vertical-align: text-bottom;
          &.active{
            background: url("/static/images/icon-evaluate-star-active.png") no-repeat;
            background-size: 100% 100%;
          }
        }
      }
      .m-evaluate-text{
        font-weight: 300;
        line-height: 32px;
        .m-label{
          font-weight: 400;
          display: inline-block;
          margin-right: 39px;
        }
      }
      .m-evaluate-img-ul{
        text-align: left;
        padding: 0;
        margin: 0;
        li{
          display: inline-block;
          margin: 0 20px 20px 0;
          &:nth-child(3n){
            margin-right: 0;
          }
          img{
            display: block;
            width: 170px;
            height: 170px;
            background-color: #9fd0bf;
          }
        }
        .m-video-box{
          width: 170px;
           position: relative;
           padding-bottom: 200px;
           .m-video{
             display: block;
             width: 170px;
             height: 170px;
             border-radius: 10px;
             margin-bottom: 20px;
           }
           .m-video-img{
             position: absolute;
             top:0;
             left: 0;
             width: 170px;
             height: 170px;
             margin-top: 30px;
           }
           .m-icon-video{
             display: block;
             width: 109px;
             height: 109px;
             position: absolute;
             top: 60px;
             left: 30px;
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
      }
      .m-product-label{
        margin: 0;
      }
    }
  }
}
</style>
