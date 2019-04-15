<template>
    <div class="m-product-detail" v-if="product_info">
      <div class="m-product-swipe">
        <mt-swipe :auto="3000">
          <mt-swipe-item class="product-swipe" v-for="(item, index) in product_info.images" v-bind:key="item.piid">
            <img class="product-img" :src="item.pipic" @click="previewImage(index, product_info.images)" v-lazy="item.pipic" :key="item.pipic">
          </mt-swipe-item>
        </mt-swipe>
        <span class="m-icon-back" @click="changeBack"></span>
        <span class="m-icon-gray-share" @click="shareProduct"></span>
      </div>
      <div class="m-product-detail-info">
        <h3 v-if="user.uslevel == 2">
          <span class="m-profict-title">预计赚：</span>
          <span class="m-red">￥{{product_info.profict}}</span>
        </h3>
        <h3>
          <span class="m-product-title">{{product_info.prtitle}}</span>
          <span class="m-red" v-if="product_info.price_range">￥{{product_info.price_range}}</span>
          <span class="m-red" v-else>￥{{product_info.prprice | money}}</span>
        </h3>
        <div class="m-info-list">
          <span>快递：{{product_info.prfreight | money}} 元</span>
          <span>月销：{{product_info.month_sale_value}}</span>
          <div @click="changeRoute('/brandDetail')">
            <span class="m-brand-name">{{product_info.brand.pbname}}</span>
            <span class="m-more"></span>
          </div>
        </div>
      </div>
      <div class="m-product-detail-more" @click="changeModal('show_sku',true)">
        <div>
          <span class="m-label">规格</span>
          <span class="m-select m-black">选择
            <template  v-if="select_value">
               <span v-for="(item,index) in select_value.skuattritedetail">{{product_info.prattribute[index]}} {{item}}</span>
            </template>
             <template  v-else>
               <span v-for="item in product_info.prattribute">{{item}} </span>
             </template>
          </span>
        </div>
        <div>
          <span class="m-more"></span>
        </div>
      </div>
      <div class="m-product-detail-more" @click="changeRoute('/evaluate')">
        <div>
          <span class="m-label">评价</span>
          <span class="m-start" v-for="(a, b) in star" :class="b <= product_info.praveragescore - 1 ?
           'active' : ((b < product_info.praveragescore && b > product_info.praveragescore - 1) ? 'half' : '')"></span>
        </div>
        <div>
          <span class="m-ft-20">查看详情</span>
          <span class="m-more"></span>
        </div>
      </div>
      <div class="m-product-description" v-if="product_info.prdescription">
        {{product_info.prdescription}}
      </div>
      <div class="m-product-detail-img-box" v-if="product_info.prdesc">
        <img v-for="item in product_info.prdesc" :src="item" v-lazy="item" :key="item">
      </div>
      <div class="m-product-detail-foot">
        <span class="m-icon-car" @click.stop="changeRoute('/shop')"></span>
        <span class="m-icon-service" @click.stop="changeRoute('/personal/serviceCenter')"></span>
        <div class="m-product-detail-btn">
          <span class="m-border" @click="sendShare">推广</span>
          <span class="active" @click="addCart">加入购物车</span>
          <span @click="buyNow">立即购买</span>

        </div>
        <img class="m-invite-course" src="/static/images/invite.png" v-if="show_invite" @click="show_invite = false">
      </div>
      <div class="m-modal-img" v-if="show_img">
        <div class="m-modal-state">
          <span class="m-close" @click="show_img = false"> X</span>
          <img :src="share_img" class="m-share-img" alt="">
        </div>
      </div>
      <sku v-if="show_sku" :now_select="select_value" :now_num="canums" :product="product_info" @changeModal="changeModal" @sureClick="sureClick"></sku>
    </div>
</template>

<script>
  import sku from '../components/sku';
  import common from '../../../common/js/common';
  import axios from 'axios';
  import api from '../../../api/api';
  import { Toast } from 'mint-ui'
  import wxapi from '../../../common/js/mixins';
  import wx from 'weixin-js-sdk';

  var scroll = (function (className) {
    var scrollTop;
    return {
      afterOpen: function () {
        scrollTop = document.scrollingElement.scrollTop || document.body.scrollTop;
        document.body.classList.add(className);
        document.body.style.top = -scrollTop + 'px';
      },
      beforeClose: function () {
        document.body.classList.remove(className);
        document.scrollingElement.scrollTop = scrollTop;
        document.body.scrollTop = scrollTop;
      }
    };
  })('scroll');
    export default {
      data(){
        return{
          show_sku:false,
          product_info:null,
          sku:null,
          select_value:null,
          canums:1,
          cart_buy:null,
          star:['','','','',''],
          user: { uslevel: '1' },
          show_invite: false,
          show_img:false,
          share_img:'',
          share_url:''
        }
      },
      mixins: [wxapi],
      components: { sku },
      mounted() {
        common.changeTitle('商品详情');
        wxapi.wxRegister(location.href.split('#')[0]);
        this.getInfo();
        this.getUser();

        localStorage.removeItem('share');
        localStorage.removeItem('url');
        if(localStorage.getItem('token')) {
          // 倒计时
          const TIME_COUNT = 1;
          let count = TIME_COUNT;
          let time = setInterval(() => {
            if(count > 0 && count <= TIME_COUNT) {
              count --;
            }else {
              this.shareProduct(1);
              clearInterval(time);
            }
          }, 300);
        }
        // alert(this.$route.fullPath);
        // alert(location.href);
      },
      activated() {
       /* this.getInfo();
        this.getUser();
        localStorage.removeItem('share');
        localStorage.removeItem('url');*/
      },
      methods:{
        // 分享商品
        shareProduct(val) {
          if(localStorage.getItem('token')) {
            let options = {
              title: this.product_info.prtitle,
              desc: this.product_info.prdescription,
              imgUrl: this.product_info.prmainpic,
              link: location.href.split('#')[0] + '?prid=' + this.$route.query.prid
            };
            axios.get(api.secret_usid + '?token=' + localStorage.getItem('token')).then(res => {
              if(res.data.status == 200) {
                options.link += '&secret_usid=' + res.data.data.secret_usid;
                this.share_url = location.origin + '/?prid=' + this.$route.query.prid +  '&secret_usid=' + res.data.data.secret_usid;
                if(val !== 1) {
                  // 点击分享
                  this.show_invite = true;
                }
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
            localStorage.setItem('login_to',location.href.split('#')[0] + '?prid=' + this.$route.query.prid);
            // this.$router.push('/login');
            // this.$router.push('/login');
            this.$store.state.show_login = true;
          }
        },
        // 获取个人信息
        getUser() {
          if(localStorage.getItem('token')) {
            axios.get(api.get_home + "?token=" + localStorage.getItem('token')).then(res => {
              if(res.data.status == 200){
                this.user = res.data.data;
              }
            });
          }
        },
         // 改变模态框
         changeModal(v,bool) {
           this[v] = bool;
           if(bool){
             scroll.afterOpen();
           }else{
             scroll.beforeClose();
           }
         },
        //改变路由
        changeRoute(v){
          if(v == '/evaluate'){
            this.$router.push({path:v,query:{prid:this.product_info.prid}});
          }else if(v == '/brandDetail'){
            this.$router.push({path:v,query:{pbid:this.product_info.pbid,pbname:this.product_info.pbname}});
          }else if(v == '/personal/serviceCenter'){
            this.$router.push({path:v});
          }else{
             sessionStorage.setItem('shop', true);
            // localStorage.setItem('last', this.$route.fullPath);
            //  this.$router.push('/selected');
            this.$router.push('/shop');
           }
        },
        // 预览图片
        previewImage(index, image) {
          let images = [];
          for(let i = 0; i < image.length; i ++) {
            images.push(image[i].pipic);
          }
          let options = {
            current: image[index].pipic, // 当前显示图片的http链接
            urls: images,                  // 当前预览图片的list
          };
          wxapi.previewImage(options);
        },
        // 返回上一页
        changeBack(){
          this.$router.go(-1);
        },
        //获取商品信息
        getInfo(){
           axios.get(api.product_get,{
             params:{
               prid:this.$route.query.prid
             }
           }).then(res => {
             if(res.data.status == 200){
               this.product_info = res.data.data;
               this.product_info.praveragescore = this.product_info.praveragescore / 2;
               /*if(this.product_info.prtitle.length > 27) {
                 this.product_info.prtitle = this.product_info.prtitle.slice(0, 27) + '...'
               }*/
               /*if(this.product_info.profict) {
                 this.product_info.profict = this.product_info.profict.toString().slice(0, 5) + '...'
               }*/
             }
           },error => {
             Toast({ message: error.data.message,duration:1000, className: 'm-toast-fail' });
           })
        },
        //获取评价
        getEvaluation(){
          // axios.get(api.get_evaluation,)
        },
        //购物车确定
        sureClick(item,num){
          this.canums = num;
          this.select_value = item;
          if(this.cart_buy == 'cart'){
            this.postCart();
            this.cart_buy = null;
          }else if(this.cart_buy == 'buy'){
            this.buyNow();
            this.cart_buy = null;
          }
          this.changeModal('show_sku',false);
        },
        // 加入购物请求
        postCart(){
          axios.post(api.cart_create + '?token=' + localStorage.getItem('token'),{
            skuid:this.select_value.skuid,
            canums:this.canums
          }).
          then(res => {
            if(res.data.status == 200){
              Toast({ message: res.data.message,duration:1000, className: 'm-toast-success' });
            }
          },error => {
            Toast({ message: error.data.message,duration:1000, className: 'm-toast-fail' });
          })
        },
        // 加入购物车
        addCart(){
           /*if(this.select_value){
               this.postCart();
           }else{
             this.show_sku = true;
           }*/
          this.show_sku = true;
           this.cart_buy = 'cart';
        },
        //立即购买
        buyNow() {
          if(this.select_value){
            let product = {};
            product.pb = this.product_info.brand;
            product.cart = [];
            product.cart.push({product:{prtitle:this.product_info.prtitle,prfreight:this.product_info.prfreight},sku:this.select_value,canums:this.canums,prid:this.product_info.prid});
            let arr = [];
            arr.push(product);
            this.$router.push({path:'/submitOrder',query:{product:JSON.stringify(arr)}});
          }else{
            this.show_sku = true;
            this.cart_buy = 'buy';
          }
        },
        //推广
        sendShare(){

          if(this.share_img== ''){
            axios.get(api.get_promotion,{
              params:{
                prid:this.$route.query.prid,
                token:localStorage.getItem('token'),
                url:this.share_url
              }
            }).then(res => {
              if(res.data.status == 200){
                this.share_img = res.data.data;
                this.show_img = true;
              }
            },error => {
              Toast({ message: error.data.message,duration:1000, className: 'm-toast-fail' });
            })
          }else{
            this.show_img = true;
          }
        }
      }
    }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  @import "../../../common/css/index";
.m-product-detail{
  padding-bottom: 100px;
  .m-product-swipe{
    position: relative;
    width: 100%;
    height: 750px;
    .m-icon-back{
      position: absolute;
      top: 45px;
      left: 45px;
      width: 70px;
      height: 70px;
      background: url("/static/images/yuan-back.png") no-repeat;
      background-size: 100% 100%;
    }
    .m-icon-gray-share {
      position: absolute;
      top: 45px;
      right: 45px;
      display: block;
      width: 70px;
      height: 70px;
      background: url("/static/images/yuan-share.png") no-repeat;
      background-size: 100% 100%;
    }
  }
  .m-product-detail-info{
    padding: 30px;
    box-shadow: 0 3px 6px rgba(0,0,0,0.16);
    h3{
      display: flex;
      flex-flow: row;
      justify-content: space-between;
      font-size: 30px;
      font-weight: bold;
      color: #666666;
      margin-bottom: 40px;
      .m-product-title{
        color: #000000;
        margin-right: 20px;
        text-align: left;
        /*!*text-indent: 2em;*!
        overflow: hidden; // 超出的文本隐藏
        text-overflow: ellipsis;    // 溢出用省略号显示
        display: -webkit-box; // 将对象作为弹性伸缩盒子模型显示。
        -webkit-box-orient: vertical; // 从上到下垂直排列子元素（设置伸缩盒子的子元素排列方式）
        -webkit-line-clamp: 2; // 这个属性不是css的规范属性，需要组合上面两个属性，表示显示的行数。*/
      }
      .money-text {
        width: 240px;
        overflow: hidden; // 超出的文本隐藏
        text-overflow: ellipsis;    // 溢出用省略号显示
      }
      .m-profict-title {
        white-space: nowrap;
        margin-left: auto;
      }
      .m-red{
        color: #EF9B2D;
      }
    }
    .m-info-list{
      display: flex;
      flex-flow: row;
      align-items: center;
      justify-content: space-between;
      color: #999999;
      .m-brand-name {
        font-size: 24px;
        font-weight: bold;
        color: @mainColor;
      }
      .m-more{
        display: inline-block;
        width: 13px;
        height: 19px;
        background: url("/static/images/icon-right.png") no-repeat;
        background-size: 100% 100%;
        margin-left: 10px;
      }
    }
  }
  .m-product-detail-more{
    display: flex;
    flex-flow: row;
    align-items: center;
    justify-content: space-between;
    padding: 24px 30px;
    color: #999999;
    box-shadow: 0 3px 6px rgba(0,0,0,0.16);
    .m-label{
      display: inline-block;
      margin-right: 30px;
    }
    .m-black{
      color: #666666;
    }
    .m-more{
      display: inline-block;
      width: 13px;
      height: 19px;
      background: url("/static/images/icon-right.png") no-repeat;
      background-size: 100% 100%;
      margin-left: 20px;
    }
  }
  .m-product-description{
    margin: 15px 0;
    background: #ffffff;
    text-align: center;
    padding: 10px 20px;
  }
  .m-product-detail-img-box{
    margin: 5px 0 15px 0;
    img{
      display: block;
      width: 750px;
      max-height: 100%;
    }
  }
  .m-product-detail-foot{
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 26px 0;
    /*padding: 26px 0 98px;*/
    background-color: #fff;
    text-align: left;
    .m-icon-car{
      display: inline-block;
      width: 53px;
      height: 53px;
      background: url("/static/images/icon-car.png") no-repeat;
      background-size: 100% 100%;
      margin: 0 29px 0 15px;
      vertical-align: middle;
    }
    .m-icon-service{
      display: inline-block;
      width: 53px;
      height: 53px;
      background: url("/static/images/icon-service.png") no-repeat;
      background-size: 100% 100%;
      margin-right: 20px;
      vertical-align: middle;
    }
    .m-product-detail-btn{
      display: inline-block;
      height: 62px;
      line-height: 62px;
      span{
        color: #ffffff;
        display: inline-block;
        width: 166px;
        text-align: center;
        background-color: @mainColor;
        margin: 0;
        border-radius: 0 10px 10px 0;
        &.active{
          background-color: @mainColor;
          margin-right: -3px;
          border-radius: 10px 0 0 10px;
        }
        &.m-border{
          background-color: #fff;
          border: 3px solid  @mainColor;
          color: @mainColor;
          border-radius: 10px;
        }
      }
    }
    .m-invite-course {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1000;
    }
  }
  .m-modal-img{
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    bottom: 0;
    left:0;
    right: 0;
    background-color: rgba(0,0,0,0.4);
    .m-modal-state{
      position: absolute;
      left: 50%;
      margin-left: -250px;
      top:50%;
      margin-top: -350px;
      width: 500px;
      height: 700px;
      background-color: #fff;
      border-radius: 10px;
      .m-close{
        position: absolute;
        top: 20px;
        right: 20px;
        font-size: 40px;
      }
      .m-share-img{
        display: block;
        width: 500px;
        height: 700px;
      }
    }
  }
}

</style>
